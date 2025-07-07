import browser from "webextension-polyfill";

async function main() {
  browser.runtime.onMessage.addListener(async (msg: unknown) => {
    console.log("Message recievend in backend Script", msg);
    return { text: "Message from Background Script" };
  });
  const activeTabs = await browser.tabs.query({ currentWindow: true });
  console.log(activeTabs);
}

main().catch(console.error);
