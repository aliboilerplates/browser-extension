// @vitest-environment jsdom
/* eslint-disable unicorn/no-useless-undefined */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeBrowser } from "wxt/testing/fake-browser";
import * as messaging from "@/core/messaging";
import { settingsStorage } from "@/core/storage/storageItems";
import { PopupApp } from "./PopupApp";

describe("PopupApp", () => {
  beforeEach(async () => {
    fakeBrowser.reset();
    vi.restoreAllMocks();
    await settingsStorage.setValue({ theme: "system" });
  });

  it("reflects the stored theme in the select", async () => {
    await settingsStorage.setValue({ theme: "dark" });

    render(<PopupApp />);

    await waitFor(() => {
      const select = screen.getByLabelText("Theme");
      expect(select).toHaveProperty("value", "dark");
    });
  });

  it("renders the pong timestamp after a successful ping", async () => {
    vi.spyOn(messaging, "sendMessage").mockImplementation(((
      type: messaging.AppMessageType
    ) => {
      if (type === "core/ping") {
        return Promise.resolve({
          ok: true,
          data: { ok: true, pongAt: 1_700_000_000_000 },
        });
      }
      return Promise.resolve(undefined);
    }) as never);

    render(<PopupApp />);

    await userEvent.click(screen.getByRole("button", { name: "Ping background" }));

    await waitFor(() => {
      expect(screen.getByText(/Pong at /)).toBeTruthy();
    });
  });

  it("surfaces a domain error code from the Result", async () => {
    vi.spyOn(messaging, "sendMessage").mockImplementation(((
      type: messaging.AppMessageType
    ) => {
      if (type === "core/ping") {
        return Promise.resolve({
          ok: true,
          data: { ok: false, error: { code: "unavailable" } },
        });
      }
      return Promise.resolve(undefined);
    }) as never);

    render(<PopupApp />);

    await userEvent.click(screen.getByRole("button", { name: "Ping background" }));

    await waitFor(() => {
      expect(screen.getByText("Error: unavailable")).toBeTruthy();
    });
  });
});
