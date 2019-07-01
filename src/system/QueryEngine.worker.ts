import {
  QueryEngineWorkerRequest,
  QueryEngineWorkerRequestType,
  QueryEngineWorkerResponse,
  QueryEngineWorkerResponseType
} from "./QueryEngineWorkerMessage";
import {isWellFormedSong, Song} from "../common/Media";

let library: Song[] = [];

const worker: Worker = self as any;

const postRawMessage = (msg: QueryEngineWorkerResponse): void => {
  worker.postMessage(msg);
};

worker.addEventListener("message", (msg) => {
  const {type, data} = msg.data as QueryEngineWorkerRequest;

  switch (type) {
  case QueryEngineWorkerRequestType.LOAD_LIBRARY:
    library = data;
    postRawMessage({
      type: QueryEngineWorkerResponseType.LIBRARY_LOADED,
      data: true,
    });
    break;

  case QueryEngineWorkerRequestType.RUN_INLINE_JS_QUERY:
    let result: Song[] = [], error;
    try {
      result = new Function(`l`, `return ${data}`)(library);
    } catch (e) {
      error = e;
    }
    if (!Array.isArray(result) || !result.every(s => isWellFormedSong(s))) {
      error = new TypeError(`Query result is not an array of songs`);
    }
    postRawMessage({
      type: QueryEngineWorkerResponseType.REQUEST_RESPONSE,
      error: error !== undefined,
      // Error objects cannot be sent using postMessage.
      data: error !== undefined ? `${error}` : result!.map(s => s.file),
    });
  }
});

postRawMessage({
  type: QueryEngineWorkerResponseType.WORKER_LOADED,
  data: true,
});

