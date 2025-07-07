import browser from "webextension-polyfill";

browser.runtime.onMessage.addListener(async (msg: unknown) => {
  console.log("Message recievend in backend Script", msg);
  return { text: "Message from Background Script" };
});
