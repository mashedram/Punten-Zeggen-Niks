import {
  DataPacketContents,
  Trackable,
} from '@/common/networking/tracking/trackable/Trackable';
import { ChangeOutOfRangeError } from '@/common/networking/tracking/trackable/stagedobject/ChangeOutOfRangeError';

export class StagedObject<T extends Record<string, unknown>>
  implements Trackable<T>
{
  private _data: T;
  private _stepMap: Record<keyof T, number>;
  /**
   * A pointer to where the next step *will* be placed
   */
  private _step: number;

  constructor(data: T, step: number = 0) {
    this._data = data;
    this._stepMap = Object.fromEntries(
      Object.keys(data).map(key => [key, step]),
    ) as Record<keyof T, number>;
    this._step = step;
  }

  public getStep(): number {
    return this._step;
  }

  public set<K extends keyof T>(key: K, value: T[K]): void {
    this._data[key] = value;
    this.sync(key);
  }

  public get<K extends keyof T>(key: K): T[K] {
    return this._data[key];
  }

  public sync<K extends keyof T>(key: K): void {
    this._stepMap[key] = this._step++;
  }

  public raw(): T {
    return this._data;
  }

  public getChangesFrom(step: number): {
    changes: Partial<T>;
    complete: boolean;
  } {
    if (step > this._step) throw new ChangeOutOfRangeError(step, this._step);
    const changes: Partial<T> = {};
    let complete = true;

    for (const key in this._stepMap) {
      const changedAt = this._stepMap[key];
      if (changedAt < step) {
        complete = false;
        continue;
      }
      changes[key] = this._data[key];
    }

    return {
      complete,
      changes,
    };
  }

  public applyChanges(step: number, changes: Partial<T>): void {
    this._step = step;
    for (const [key, value] of Object.entries(changes)) {
      const localKey: keyof T = key;

      this._data[localKey] = value;
      this._stepMap[localKey] = step;
    }
  }

  public getDataPacket(clientStep: number): DataPacketContents<T> {
    const { changes, complete } = this.getChangesFrom(clientStep);

    if (complete) {
      return { data: changes as T, step: this._step, overwrite: true };
    }

    return { data: changes, step: this._step, overwrite: false };
  }

  public applyDataPacket(step: number, packet: DataPacketContents<T>): void {
    this.applyChanges(step, packet.data);
  }

  public fields(): (keyof T)[] {
    return Object.keys(this._data) as (keyof T)[];
  }

  public getTypeId(): string {
    return 'stagedobject';
  }
}
