# with-timeout

Add a timeout to an asynchronous function.

This package exports a single function, `withTimeout`, an Error class, `TimeoutError, and a guard function that will determine if an error is a TimeoutError.

Given a Promise-returning function, `F1<T,U>`, where:

`type F1<T, U> = (a: T) => Promise<U>;`

and a number of milliseconds in which to timeout, withTimeout returns a new function with the same signature. The returned function will resolve/reject with the original function if the original function resolves/rejects within the timeout. If the timeout expires, the returned function will reject with an instance of `TimeoutError`.

## Example Usage

Add a timeout to a node readFile operation:

```
    import { readFile } from "fs";
    import { promisify } from "util";
    import { withTimeout, isTimeoutError } from "with-timeout";

    const TIMEOUT_MS = 1000;

    const readFileWithTimeout = withTimeout(readFile, TIMEOUT_MS);

    readFileWithTimeout("./filename.txt")
        .then(file => { /* Do something */ })
        .catch(err => {
            if (isTimeoutError(err)) {
                // Read file timed out
            } else {
                // Read file rejected
            }
        })
```
