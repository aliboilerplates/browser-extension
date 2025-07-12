import { logger } from "@/lib/logger";
import {
  DownloadLastScreenShotResponse,
  ScreenshotMessage,
} from "@/shared/interfaces/messages.interface";
import { saveDataToStorage, getDataFromStorage } from "@/utils/storage.utils";

export default defineBackground(() => {
  browser.runtime.onMessage.addListener(handleScreenShotMessage);
});

function handleScreenShotMessage(
  message: ScreenshotMessage,
  _: Browser.runtime.MessageSender,
  sendResponse: (response: unknown) => void,
) {
  if (message.type == "downloadLastScreenShot") {
    void downloadLastScreenShot().then(sendResponse);
    return true;
  }

  takeScreenShot(message.type)
    .then((dataUrl) => {
      if (!dataUrl) {
        logger.warn("'takeScreenShot' method returned undefined img url");
        return;
      }

      void downloadScreenShot(dataUrl);
      void saveScreenShotToStorage(dataUrl);
    })
    .catch(logger.error);
  return true;
}

async function takeScreenShot(
  type: Exclude<ScreenshotMessage["type"], "downloadLastScreenShot">,
) {
  switch (type) {
    case "captureVisible":
      return captureVisibleTab();
    default:
      logger.warn(
        "Unknown message received in screen shot message handler: ",
        type,
      );
  }
}

async function captureVisibleTab() {
  try {
    return await browser.tabs.captureVisibleTab({
      format: "png",
      quality: 100,
    });
  } catch (error) {
    logger.error("Failed to capture visibleTab: ", error);
    throw error;
  }
}

async function downloadScreenShot(dataUrl: string) {
  try {
    await browser.downloads.download({
      url: dataUrl,
      saveAs: true,
      filename: getScreenShotFileName(),
    });
  } catch (error: unknown) {
    logger.error("Failed to downlaod the screenshot: ", error);
    throw error;
  }
}

async function saveScreenShotToStorage(dataUrl: string) {
  try {
    await saveDataToStorage({ lastScreenshot: dataUrl });
  } catch (error: unknown) {
    logger.error("Failed to save screen shot to storage", error);
    throw error;
  }
}

async function downloadLastScreenShot(): Promise<DownloadLastScreenShotResponse> {
  try {
    const { lastScreenshot } = await getDataFromStorage(["lastScreenshot"]);
    if (!lastScreenshot) return null;
    await downloadScreenShot(lastScreenshot);
    return lastScreenshot;
  } catch (error: unknown) {
    logger.error("Failed to download last screenshot", error);
    throw error;
  }
}

function getScreenShotFileName() {
  return `snapscope_${new Date().toISOString().split("T")[0]}.png`;
}
