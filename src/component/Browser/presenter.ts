import {createAtMostOnceAsyncFlowLock, createAtMostOneAsyncFlow} from 'common/Async';
import {assertExists} from 'extlib/js/optional/assert';
import {action} from 'mobx';
import {ListApi} from 'service/CollectionService';
import {BrowserStore} from './state';

export class BrowserPresenter {
  private listFetchLock = createAtMostOnceAsyncFlowLock();

  constructor (
    private readonly store: BrowserStore,
    private readonly searchQuery: () => string | undefined,
    private readonly listFetcher: ListApi,
  ) {
  }

  continueListFetch = createAtMostOneAsyncFlow(
    () => {
      this.store.loading = true;
      this.store.error = undefined;
    },
    () => this.listFetcher({
      filter: this.searchQuery(),
      source: {path: this.store.currentPath, subdirectories: this.store.subdirectories},
      types: this.store.types,
      // This should only ever be called to continue fetching.
      continuation: assertExists(this.store.continuation),
    }),
    res => {
      // `approximate{Size,Duration,Count}` should not change with continued fetches.
      this.store.entries = [...this.store.entries, ...res.results];
      this.store.continuation = res.continuation;
    },
    err => this.store.error = err.message,
    () => this.store.loading = false,
    this.listFetchLock,
  );

  newListFetch = createAtMostOneAsyncFlow(
    () => {
      this.store.continuation = undefined;
      this.store.loading = true;
      this.store.error = undefined;
    },
    () => this.listFetcher({
      filter: this.searchQuery(),
      source: {path: this.store.currentPath, subdirectories: this.store.subdirectories},
      types: this.store.types,
    }),
    // `approximate{Size,Duration,Count}` should not change with continued fetches.
    res => {
      this.store.entries = res.results;
      this.store.approximateCount = res.approximateCount;
      this.store.approximateDuration = res.approximateDuration;
      this.store.approximateSize = res.approximateSize;
      this.store.continuation = res.continuation;
    },
    err => this.store.error = err.message,
    () => this.store.loading = false,
    this.listFetchLock,
  );

  @action
  setCurrentPath = (path: string[]) => {
    this.store.currentPath = path;
    this.newListFetch();
  };

  @action
  goToSubfolder = (folder: string) => {
    this.store.currentPath = this.store.currentPath.concat(folder);
    this.newListFetch();
  };
}
