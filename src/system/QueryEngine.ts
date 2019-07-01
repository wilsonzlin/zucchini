import {Song} from "../common/Media";
import {
  QueryEngineWorkerRequestType,
  QueryEngineWorkerResponse,
  QueryEngineWorkerResponseType
} from "./QueryEngineWorkerMessage";
import Worker from "worker-loader!./QueryEngine.worker";

interface PromiseResultCallbacks<R, E> {
  resolve: (val: R) => void;
  reject: (err: E) => void;
}

export const queryEngine = new class {
  private readonly worker: Worker;
  private readonly inTransit: Map<number, PromiseResultCallbacks<any, any>>;
  private nextID: number;

  constructor () {
    this.worker = new Worker();
    this.inTransit = new Map();
    this.nextID = 0;

    // this.worker.addEventListener("error", console.error);
    this.worker.addEventListener("message", msg => {
      const {id, type, error, data} = msg.data as QueryEngineWorkerResponse<any>;
      if (type === QueryEngineWorkerResponseType.WORKER_LOADED) {
        // Do nothing
      } else if (type === QueryEngineWorkerResponseType.REQUEST_RESPONSE) {
        const callbacks = this.inTransit.get(id);
        if (!callbacks) {
          throw new Error(`Response to unknown request ID: ${id}`);
        }
        const {resolve, reject} = callbacks;
        if (error) {
          reject(data);
        } else {
          resolve(data);
        }
      } else {
        throw new Error(`Unknown response type: ${type}`);
      }
    });
  }

  private generateID () {
    return this.nextID++;
  }

  private postMessage<D> (type: QueryEngineWorkerRequestType, data: D) {
    return new Promise((resolve, reject) => {
      const id = this.generateID();
      this.worker.postMessage({id, type, data});
      this.inTransit.set(id, {resolve, reject});
    });
  }

  loadData (songs: Song[]) {
    void this.postMessage(QueryEngineWorkerRequestType.LOAD_LIBRARY, songs);
  }

  async query (query: string) {
    return await this.postMessage(QueryEngineWorkerRequestType.RUN_JS_QUERY, query);
  }
};
