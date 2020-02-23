import {ISong} from 'model/Song';
import {
  QueryEngineWorkerRequest,
  QueryEngineWorkerRequestType,
  QueryEngineWorkerResponse,
  QueryEngineWorkerResponseError,
  QueryEngineWorkerResponseType,
} from './QueryEngineWorkerMessage';
import Worker from 'worker-loader!./QueryEngine.worker';

interface PromiseResultCallbacks<R = any, E = any> {
  resolve: (val: R) => void;
  reject: (err: E) => void;
}

enum QueryEngineState {
  LOADING,
  READY,
  PROCESSING,
}

export const queryEngine = new class {
  // worker and state are not initialised initially before and during the beginning of the initNewWorker() call.
  private worker?: Worker;
  private state?: QueryEngineState;
  private request?: {
    message: QueryEngineWorkerRequest;
    callbacks: PromiseResultCallbacks;
  };
  // TODO Bind to store.
  private songs: ISong[] = [];

  constructor () {
    this.initNewWorker();
  }

  async inline (query: string) {
    return await this.makeAsyncRequest<string[]>(QueryEngineWorkerRequestType.RUN_INLINE_JS_QUERY, query);
  }

  async filter (query: string) {
    return await this.makeAsyncRequest<string[]>(QueryEngineWorkerRequestType.RUN_FILTER_JS_QUERY, query);
  }

  loadData (songs: ISong[]) {
    this.songs = songs;
    this.initNewWorker();
  }

  private makeAsyncRequest<R> (type: QueryEngineWorkerRequestType, data: any): Promise<R> {
    return new Promise((resolve, reject) => {
      const message = {type, data};
      const callbacks = {resolve, reject};
      this.request = {message, callbacks};
      switch (this.state) {
      case QueryEngineState.LOADING:
        break;

      case QueryEngineState.READY:
        this.startRequestProcessing();
        break;

      case QueryEngineState.PROCESSING:
        this.initNewWorker();
        break;

      default:
        throw new Error(`Unknown query engine state: ${this.state}`);
      }
    });
  }

  /**
   * Doesn't check if worker or request exist.
   * Doesn't check current state.
   */
  private startRequestProcessing () {
    this.worker!.postMessage(this.request!.message);
    this.state = QueryEngineState.PROCESSING;
  }

  private initNewWorker () {
    const worker = new Worker();

    // worker.addEventListener("error", console.error);
    worker.addEventListener('message', msg => {
      const {type, error, data} = msg.data as QueryEngineWorkerResponse;

      switch (type) {
      case QueryEngineWorkerResponseType.WORKER_LOADED:
        worker.postMessage({
          type: QueryEngineWorkerRequestType.LOAD_LIBRARY,
          // TODO Bind to store
          data: this.songs,
        });
        break;

      case QueryEngineWorkerResponseType.LIBRARY_LOADED:
        if (this.request) {
          this.startRequestProcessing();
        } else {
          this.state = QueryEngineState.READY;
        }
        break;

      case QueryEngineWorkerResponseType.REQUEST_RESPONSE:
        const {resolve, reject} = this.request!.callbacks;
        if (error) {
          reject(new QueryEngineWorkerResponseError(data));
        } else {
          resolve(data);
        }
        this.state = QueryEngineState.READY;
        break;

      default:
        throw new Error(`Unknown response type: ${type}`);
      }
    });

    if (this.worker != undefined) {
      this.worker.terminate();
    }

    this.worker = worker;
    this.state = QueryEngineState.LOADING;
  }
};
