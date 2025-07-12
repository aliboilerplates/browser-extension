export interface ScreenshotMessage {
  type:
    | "captureVisible"
    | "captureFull"
    | "captureSelect"
    | "downloadLastScreenShot";
}

export type DownloadLastScreenShotResponse = string | null;
