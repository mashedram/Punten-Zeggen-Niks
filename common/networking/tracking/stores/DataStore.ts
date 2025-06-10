import { Dereferable } from '@/common/networking/tracking/trackable/Dereferable';
import { TrackedInstanceReference } from '@/common/networking/tracking/tracker/TrackedInstanceReference';

export interface DataStore {
  getFromRef<T>(ref: TrackedInstanceReference<T>): Dereferable<T> | undefined;
}
