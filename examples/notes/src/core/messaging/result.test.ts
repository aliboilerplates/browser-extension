import { describe, expectTypeOf, it } from "vitest";
import type { Result } from "./contracts";

describe("Result type shapes", () => {
  it("bare Result allows any string code and no extra fields on success", () => {
    const ok: Result = { ok: true };
    const fail: Result = { ok: false, error: { code: "anything-goes" } };

    expectTypeOf(ok).toMatchTypeOf<Result>();
    expectTypeOf(fail).toMatchTypeOf<Result>();
  });

  it("typed code narrows the failure branch", () => {
    type R = Result<"not-found" | "expired">;

    const ok: R = { ok: true };
    const notFound: R = { ok: false, error: { code: "not-found" } };

    expectTypeOf(ok).toMatchTypeOf<R>();
    expectTypeOf(notFound).toMatchTypeOf<R>();

    // @ts-expect-error — "other" is not in the code union
    const bad: R = { ok: false, error: { code: "other" } };
    void bad;
  });

  it("TData spreads onto the success branch as flat fields", () => {
    type R = Result<"unavailable", { pongAt: number }>;

    const ok: R = { ok: true, pongAt: 123 };
    const fail: R = { ok: false, error: { code: "unavailable" } };

    expectTypeOf(ok).toMatchTypeOf<R>();
    expectTypeOf(fail).toMatchTypeOf<R>();
  });

  it("TErrorData attaches extra context alongside code", () => {
    type R = Result<"validation", object, { field: string }>;

    const fail: R = {
      ok: false,
      error: { code: "validation", field: "email" },
    };

    expectTypeOf(fail).toMatchTypeOf<R>();
  });
});
