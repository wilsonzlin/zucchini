import {
  QueryEngineWorkerRequest,
  QueryEngineWorkerRequestType,
  QueryEngineWorkerResponse,
  QueryEngineWorkerResponseType
} from "./QueryEngineWorkerMessage";
import {Song} from "../common/Media";

type Handler<D, R> = (data: D) => R | Promise<R>;

const worker = new class QueryEngineWorker {
  private readonly worker: Worker;
  private readonly handlers: Map<QueryEngineWorkerRequestType, Handler<any, any>>;

  constructor () {
    this.worker = self as any;
    this.handlers = new Map();

    this.worker.addEventListener("message", async (msg) => {
      const {id, type, data} = msg.data as QueryEngineWorkerRequest<any>;
      const handler = this.handlers.get(type);
      if (!handler) {
        throw new Error(`No registered handler for request type: ${type}`);
      }
      let response, error;
      try {
        response = await handler(data);
      } catch (e) {
        error = e;
      }
      if (response !== undefined) {
        this.postRawMessage({
          id,
          type: QueryEngineWorkerResponseType.REQUEST_RESPONSE,
          data: response,
        });
      } else if (error !== undefined) {
        this.postRawMessage({
          id,
          type: QueryEngineWorkerResponseType.REQUEST_RESPONSE,
          error: true,
          data: error,
        });
      }
    });
  }

  postRawMessage<D> (msg: QueryEngineWorkerResponse<D>): void {
    this.worker.postMessage(msg);
  }

  registerHandler (type: QueryEngineWorkerRequestType, handler: Handler<any, any>) {
    if (this.handlers.has(type)) {
      throw new Error(`A handler has already been registered for type: ${type}`);
    }
    this.handlers.set(type, handler);
  }
};

worker.postRawMessage({
  id: -1,
  type: QueryEngineWorkerResponseType.WORKER_LOADED,
  data: true,
});

let library: Song[] = [];

worker.registerHandler(QueryEngineWorkerRequestType.LOAD_LIBRARY, songs => {
  library = songs;
});

worker.registerHandler(QueryEngineWorkerRequestType.RUN_JS_QUERY, query => {
  return new Function(query)(library);
});
