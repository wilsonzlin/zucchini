import {createAtMostOnceAsyncFlowLock, createAtMostOneAsyncFlow} from '../../common/Async';
import {assertExists} from '../../common/Sanity';
import {MediaFile, MediaFileType} from '../../model/Media';
import {GroupDelimiter} from '../../model/Playlist';
import {ListViewStore} from './state';

export class ListViewPresenter {
  private listFetchLock = createAtMostOnceAsyncFlowLock();

  constructor (
    private readonly store: ListViewStore,
    private readonly searchQuery: () => string | undefined,
    private readonly listFetcher: (req: {
      source: { path: string[]; subdirectories: boolean; };
      filter?: string;
      groupBy?: string[]
      sortBy?: string[],
      types: MediaFileType[];
      continuation?: string;
    }) => Promise<{
      results: (GroupDelimiter | MediaFile)[];
      approximateSize?: number;
      approximateDuration?: number;
      approximateCount?: number;
      continuation?: string;
    }>,
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
}
