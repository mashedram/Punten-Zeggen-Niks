export type DataPacketContents<T> =
  | {
      data: Partial<T>;
      /**
       * The step at which the partial snapshot was made
       */
      step: number;
      overwrite: false;
    }
  | {
      data: T;
      step: number;
      overwrite: true;
    };

export interface Trackable<T = never> {
  getTypeId(): string;
  sync<K extends keyof T>(key: K): void;
  set<K extends keyof T>(key: K, value: T[K]): void;
  get<K extends keyof T>(key: K): T[K];
  fields(): (keyof T)[];
  raw(): T;
  getStep(): number;
  getDataPacket(clientStep: number): DataPacketContents<T>;
  applyDataPacket(step: number, packet: DataPacketContents<T>): void;
}
