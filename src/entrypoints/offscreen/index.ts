import { sendRuntimeMessage } from "@/core/messaging";

// Offscreen remains optional scaffolding in v1.
export {};

const res = await sendRuntimeMessage("core/updateSettings", { theme: "dark" });

