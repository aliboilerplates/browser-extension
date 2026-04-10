import { sendMessage } from "@/core/messaging";

// Offscreen remains optional scaffolding in v1.


const res = await sendMessage("core/updateSettings", { theme: "dark" });
