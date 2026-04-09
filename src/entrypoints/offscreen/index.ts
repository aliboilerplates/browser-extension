import { sendMessage } from "@/core/messaging";

// Offscreen remains optional scaffolding in v1.
export {};

const res = await sendMessage("core/updateSettings", { theme: "dark" });
