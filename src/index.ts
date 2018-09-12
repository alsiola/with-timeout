export type F1<T, U> = (a: T) => Promise<U>;

export const TIMED_OUT = "TIMED_OUT";

function delay(ms: number): Promise<typeof TIMED_OUT> {
    return new Promise(resolve => setTimeout(() => resolve(TIMED_OUT), ms));
}

export class TimeoutError extends Error {
    constructor() {
        super("TIMED_OUT");
    }
}

export function withTimeout<T, U>(fn: F1<T, U>, timeoutMs: number): F1<T, U> {
    return a =>
        new Promise((resolve, reject) => {
            Promise.race([fn(a), delay(timeoutMs)])
                .then(result => {
                    if (result === TIMED_OUT) {
                        return reject(new TimeoutError());
                    }
                    resolve(result);
                })
                .catch(reject);
        });
}
