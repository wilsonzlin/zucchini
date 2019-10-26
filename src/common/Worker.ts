import WebpackWorker from "worker-loader!*";

interface RawWorkerRequest {
  type: string;
  id: number;
  data: any;
}

interface RawWorkerResponse {
  id: number;
  response: any;
  error: any;
}

export interface WorkerRequests {
  [type: string]: {
    request: any;
    response: any;
  };
}

export type WorkerRequestHandlers<R extends WorkerRequests> = {
  [type in keyof R]: (req: R[type]["request"]) => (R[type]["response"] | Promise<R[type]["response"]>);
}

export type WorkerClient<R extends WorkerRequests> = {
  // TODO
  // [type in keyof R]: (req: R[type]["request"]) => Promise<R[type]["response"]>;
  [type in keyof R]: (req: R[type]["request"]) => any;
}

export const workerClient = <R extends WorkerRequests> (worker: WebpackWorker): WorkerClient<R> => {
  const pending: {
    [id: number]: {
      resolve: (value: any) => void;
      reject: (error: any) => void;
    }
  } = {};

  let nextId = 0;

  // TODO Error handling
  worker.addEventListener("message", msg => {
    const {id, response, error} = msg.data as RawWorkerResponse;
    const {resolve, reject} = pending[id];
    delete pending[id];
    if (error) {
      reject(error);
    } else {
      resolve(response);
    }
  });

  return new Proxy({}, {
    get: (_, type) => {
      const id = nextId++;
      return (data: any) =>
        new Promise(((resolve, reject) => {
          worker.postMessage({type, id, data});
          pending[id] = {resolve, reject};
        }));
    },
  }) as WorkerClient<R>;
};

export const workerServer = <R extends WorkerRequests> (handlers: WorkerRequestHandlers<R>) => {
  const worker: Worker = self as any;
  worker.addEventListener("message", async (msg) => {
    const {type, id, data} = msg.data as RawWorkerRequest;
    const handler = handlers[type];
    let response, error;
    try {
      response = await handler(data);
    } catch (err) {
      error = {
        name: err.name,
        stack: err.stack,
        message: err.message,
      };
    }
    worker.postMessage({id, response, error} as RawWorkerResponse);
  });
};
