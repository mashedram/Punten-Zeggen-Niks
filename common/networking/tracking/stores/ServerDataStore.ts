import { ClientPool } from '@/common/networking/client/ClientPool';
import { DataTracker } from '@/common/networking/tracking/tracker/DataTracker';
import { DataStore } from '@/common/networking/tracking/stores/DataStore';
import {
  getDataInstanceDescriptor,
  DataInstanceDescriptor,
} from '@/common/networking/tracking/descriptors/DataInstanceDescriptor';
import { TrackedInstance } from '@/common/networking/tracking/tracker/TrackedInstance';
import { TrackedInstanceReference } from '@/common/networking/tracking/tracker/TrackedInstanceReference';

export class ServerDataStore implements DataStore {
  private _trackers: Record<string, DataTracker>;

  constructor() {
    this._trackers = {};
  }

  public create(name: string, clients: ClientPool): DataTracker {
    const tracker = new DataTracker(name, clients);
    this._trackers[name] = tracker;
    return tracker;
  }

  public getInstance<T>(
    instanceId: number,
    descriptor: DataInstanceDescriptor<T>,
  ): TrackedInstance<T> | undefined {
    const tracker = this._trackers[descriptor.tracker.name];
    if (!tracker) {
      console.debug('Tracker not found: ' + descriptor.tracker.name);
      return undefined;
    }
    return tracker.get(instanceId);
  }

  public get(name: string): DataTracker | undefined {
    return this._trackers[name];
  }

  public getFromRef<T>(
    ref: TrackedInstanceReference<T>,
  ): TrackedInstance<T> | undefined {
    const descriptor = getDataInstanceDescriptor(
      ref.descriptorId,
    ) as DataInstanceDescriptor<T>;
    if (!descriptor)
      throw new Error('Descriptor not found: ' + ref.descriptorId);
    return this.getInstance(ref.instanceId, descriptor);
  }

  public startTracking<T>(
    descriptor: DataInstanceDescriptor<T>,
    data: T,
    tracker: DataTracker,
  ): TrackedInstance<T> {
    if (tracker.getName() !== descriptor.tracker.name) {
      throw new Error(
        'Invalid tracker name, expected ' +
          descriptor.tracker.name +
          ' for descriptor ' +
          descriptor.name,
      );
    }
    return tracker.startTracking(descriptor, data);
  }

  public stopTracking<T>(instance: TrackedInstance<T>): void {
    const tracker = instance.getTracker();
    tracker.stopTracking(instance.getId());
  }

  public createDataTracker(name: string, clients: ClientPool) {
    return this.create(name, clients);
  }

  public removeDataTracker(tracker: DataTracker) {
    tracker.onRemoval();
    delete this._trackers[tracker.getName()];
  }
}
