import { Camera, Crop, ScanLine, Download } from "lucide-react";
import { ActionCard } from "./components/ActionCard";
import { sendRuntimeMessage } from "@/utils/message.utils";
import {
  DownloadLastScreenShotResponse,
  ScreenshotMessage,
} from "@/shared/interfaces/messages.interface";
import { Button } from "@/components/ui/Button";
import { logger } from "@/lib/logger";

export function Popup() {
  const [isLastScreenShotFound, setIsLastScreenShotFound] =
    useState<boolean>(true);

  const [isScreenShotDownloading, setIsScreenShotDownloading] =
    useState<boolean>(false);

  async function handleDownloadLast() {
    setIsScreenShotDownloading(true);
    try {
      const screenShot =
        await sendRuntimeMessage<DownloadLastScreenShotResponse>({
          type: "downloadLastScreenShot",
        });
      if (screenShot === null) {
        setIsLastScreenShotFound(false);
      }
      console.log(screenShot);
    } catch (error) {
      logger.error("Failed to downlaod last screenshot", error);
    } finally {
      setIsScreenShotDownloading(false);
    }
  }
  return (
    <div className="w-80 p-5 rounded-2xl bg-gradient-to-br from-[#fdfdfd] to-[#f2f4f7] shadow-xl border border-gray-200 space-y-5">
      <header className="text-center space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-gray-800">
          📸 SnapScope
        </h2>
        <p className="text-xs text-gray-500">Capture your screen with style</p>
      </header>

      <div className="grid grid-cols-3 gap-4">
        <ActionCard
          label="Visible"
          icon={<Camera className="w-5 h-5" color="black" />}
          onClick={() => {
            handleScreenshot("captureVisible");
          }}
          color="bg-primary"
        />
        <ActionCard
          label="Full"
          icon={<ScanLine className="w-5 h-5" color="black" />}
          onClick={() => {
            handleScreenshot("captureFull");
          }}
          color="bg-secondary"
        />
        <ActionCard
          label="Select"
          icon={<Crop className="w-5 h-5" color="black" />}
          onClick={() => {
            handleScreenshot("captureSelect");
          }}
          color="bg-accent"
        />
      </div>

      <div className="border-t border-gray-200 pt-4">
        <Button
          onClick={handleDownloadLast}
          shape="neutral"
          className="w-full"
          disabled={!isLastScreenShotFound || isScreenShotDownloading}
        >
          {isLastScreenShotFound ? (
            <span className="flex gap-2">
              <Download className="w-4 h-4" />
              Download Last
            </span>
          ) : (
            <span className="text-black opacity-60">
              😞 No screenshot found
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}

function handleScreenshot(
  type: Exclude<ScreenshotMessage["type"], "downloadLastScreenShot">,
) {
  void sendRuntimeMessage({ type });
}
