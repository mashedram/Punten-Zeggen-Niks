import { SERVER_DATA_STORE } from '@/common/networking/Globals';
import { TrackedInstance } from '@/common/networking/tracking/tracker/TrackedInstance';

export class TrackedInstanceReference<T> {
  public instanceId: number;
  public descriptorId: number;

  public get(): TrackedInstance<T> | undefined {
    return SERVER_DATA_STORE.getFromRef(this);
  }

  constructor(instanceId: number, descriptorId: number) {
    this.instanceId = instanceId;
    this.descriptorId = descriptorId;
  }
}

export type Deref<T> =
  T extends TrackedInstanceReference<infer U>
    ? Deref<U>
    : T extends object
      ? { [K in keyof T]: Deref<T[K]> }
      : T;
