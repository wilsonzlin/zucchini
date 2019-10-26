export interface QueryEngineWorkerRequest {
  type: QueryEngineWorkerRequestType;
  data: any;
}

export enum QueryEngineWorkerRequestType {
  LOAD_LIBRARY,
  RUN_INLINE_JS_QUERY,
  RUN_FILTER_JS_QUERY,
}

export interface QueryEngineWorkerResponse {
  type: QueryEngineWorkerResponseType;
  error?: boolean;
  data: any;
}

export enum QueryEngineWorkerResponseType {
  WORKER_LOADED,
  LIBRARY_LOADED,
  REQUEST_RESPONSE,
}

export class QueryEngineWorkerResponseError extends Error {
  constructor (message: string) {
    super(message);
  }
}
