import {ISong, isWellFormedSong} from 'model/Song';
import {
  QueryEngineWorkerRequest,
  QueryEngineWorkerRequestType,
  QueryEngineWorkerResponse,
  QueryEngineWorkerResponseType,
} from './QueryEngineWorkerMessage';

let library: ISong[] = [];

const executors: Map<QueryEngineWorkerRequestType, (query: string) => any> = new Map();
executors
  .set(QueryEngineWorkerRequestType.RUN_INLINE_JS_QUERY,
    query => new Function(`l`, `return ${query}`)(library))
  .set(QueryEngineWorkerRequestType.RUN_FILTER_JS_QUERY,
    // Use true as return value if query is blank so that it doesn't hide everything.
    query => library.filter(new Function(`song`, `
      const s = song;
      const {artists, genres} = song;
      const as = artists;
      const gs = genres;
      const album = song.album || "";
      const l = album;
      const artist = artists[0] || "";
      const a = artist;
      const decade = song.decade || "";
      const d = decade;
      const genre = genres[0] || "";
      const g = genre;
      const title = song.title || "";
      const t = title;
      const year = song.year == null ? -1 : song.year;
      const y = year;
      return ${query.trim() || true};
    `) as (s: ISong) => boolean))
;

const worker: Worker = self as any;

const postRawMessage = (msg: QueryEngineWorkerResponse): void => {
  worker.postMessage(msg);
};

worker.addEventListener('message', (msg) => {
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
  case QueryEngineWorkerRequestType.RUN_FILTER_JS_QUERY:
    const executor = executors.get(type)!;
    let result: ISong[] = [], error;
    try {
      result = executor(data);
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
    break;
  }
});

postRawMessage({
  type: QueryEngineWorkerResponseType.WORKER_LOADED,
  data: true,
});

