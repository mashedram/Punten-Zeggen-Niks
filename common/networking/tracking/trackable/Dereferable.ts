import { DataStore } from '../stores/DataStore';
import { Deref } from '../tracker/TrackedInstanceReference';

export const LoadingSymbol: unique symbol = Symbol('derefIsLoading');
export type LoadingSymbolType = typeof LoadingSymbol;

export interface Dereferable<T> {
  deref(store: DataStore): Deref<T> | LoadingSymbolType;
}
