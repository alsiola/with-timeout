import { F1, withTimeout } from "../src";

describe("with-timeout", () => {
    let timeoutFn: F1<string, string>;
    let resolveFn: F1<string, string>;
    let rejectFn: F1<string, string>;

    beforeEach(() => {
        resolveFn = withTimeout((a: string) => new Promise(r => r(a)), 1000);

        rejectFn = withTimeout(
            (a: string) => new Promise((res, rej) => rej(a)),
            1000
        );

        timeoutFn = withTimeout(
            (a: string) => new Promise(r => setTimeout(() => r(a), 200)),
            100
        );
    });

    it("returns fn result if no timeout", () => {
        return expect(resolveFn("test")).resolves.toEqual("test");
    });

    it("throws if timesout", () => {
        return expect(timeoutFn("test")).rejects.toThrowErrorMatchingSnapshot();
    });

    it("passes through fn rejections", () => {
        return expect(rejectFn("fails")).rejects.toBe("fails");
    });

    it("passes arguments for functions with arity > 1", () => {
        const fn = withTimeout(
            (a: string, b: number) => new Promise(r => r([a, b])),
            1000
        );

        expect(fn("test", 5)).resolves.toEqual(["test", 5]);
    });

    it("resolves or time out correctly across multiple uses", () => {
        return Promise.all([
            expect(resolveFn("test")).resolves.toEqual("test"),
            expect(timeoutFn("test")).rejects.toThrowError(),
            expect(timeoutFn("test")).rejects.toThrowError(),
            expect(resolveFn("test")).resolves.toEqual("test"),
            expect(timeoutFn("test")).rejects.toThrowError(),
            expect(timeoutFn("test")).rejects.toThrowError(),
            expect(resolveFn("test")).resolves.toEqual("test"),
            expect(resolveFn("test")).resolves.toEqual("test"),
            expect(timeoutFn("test")).rejects.toThrowError(),
            expect(resolveFn("test")).resolves.toEqual("test"),
            expect(resolveFn("test")).resolves.toEqual("test"),
            expect(timeoutFn("test")).rejects.toThrowError(),
            expect(resolveFn("test")).resolves.toEqual("test"),
            expect(timeoutFn("test")).rejects.toThrowError()
        ]);
    });
});
