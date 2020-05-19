export type F1<T, R> = (a: T) => Promise<R>;
export type F2<T, U, R> = (a: T, b: U) => Promise<R>;
export type F3<T, U, V, R> = (a: T, b: U, c: V) => Promise<R>;
export type F4<T, U, V, W, R> = (a: T, b: U, c: V, d: W) => Promise<R>;
export type F5<T, U, V, W, X, R> = (a: T, b: U, c: V, d: W, e: X) => Promise<R>;

type FAny =
    | F1<any, any>
    | F2<any, any, any>
    | F3<any, any, any, any>
    | F4<any, any, any, any, any>
    | F5<any, any, any, any, any, any>;

const TIMED_OUT = "TIMED_OUT";

function delay(ms: number): Promise<typeof TIMED_OUT> {
    return new Promise(resolve => setTimeout(() => resolve(TIMED_OUT), ms));
}

export class TimeoutError extends Error {
    constructor() {
        super(TIMED_OUT);
    }
}

export function isTimeoutError(
    error: Error | TimeoutError
): error is TimeoutError {
    return error.message === TIMED_OUT;
}

export function withTimeout<T, R>(fn: F1<T, R>, timeoutMs: number): F1<T, R>;
export function withTimeout<T, U, R>(
    fn: F2<T, U, R>,
    timeoutMs: number
): F2<T, U, R>;
export function withTimeout<T, U, V, R>(
    fn: F3<T, U, V, R>,
    timeoutMs: number
): F3<T, U, V, R>;
export function withTimeout<T, U, V, W, R>(
    fn: F4<T, U, V, W, R>,
    timeoutMs: number
): F4<T, U, V, W, R>;
export function withTimeout<T, U, V, W, X, R>(
    fn: F5<T, U, V, W, X, R>,
    timeoutMs: number
): F5<T, U, V, W, X, R>;
export function withTimeout(fn: FAny, timeoutMs: number): FAny {
    return (...args: any[]) =>
        new Promise((resolve, reject) => {
            Promise.race([
                (fn as any).apply(fn as FAny, args),
                delay(timeoutMs)
            ])
                .then(result => {
                    if (result === TIMED_OUT) {
                        return reject(new TimeoutError());
                    }
                    resolve(result);
                })
                .catch(reject);
        });
}
