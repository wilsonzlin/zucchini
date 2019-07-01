export interface QueryEngineWorkerRequest<D> {
  id: number;
  type: QueryEngineWorkerRequestType;
  data: D;
}

export enum QueryEngineWorkerRequestType {
  LOAD_LIBRARY,
  RUN_JS_QUERY,
}

export interface QueryEngineWorkerResponse<D> {
  id: number;
  type: QueryEngineWorkerResponseType;
  error?: boolean;
  data: D;
}

export enum QueryEngineWorkerResponseType {
  WORKER_LOADED,
  REQUEST_RESPONSE,
}
