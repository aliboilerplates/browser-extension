import { Camera, Crop, ScanLine, Download } from "lucide-react";

export function Popup() {
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
            handleScreenshot("visible");
          }}
          color="bg-primary"
        />
        <ActionCard
          label="Full"
          icon={<ScanLine className="w-5 h-5" color="black" />}
          onClick={() => {
            handleScreenshot("full");
          }}
          color="bg-secondary"
        />
        <ActionCard
          label="Select"
          icon={<Crop className="w-5 h-5" color="black" />}
          onClick={() => {
            handleScreenshot("select");
          }}
          color="bg-accent"
        />
      </div>

      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={handleDownloadLast}
          className="btn btn-neutral w-full gap-2"
        >
          <Download className="w-4 h-4" />
          Download Last
        </button>
      </div>
    </div>
  );
}

function ActionCard({
  label,
  icon,
  onClick,
  color,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
}) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-xl p-3 shadow-md text-white flex flex-col items-center justify-center gap-1 hover:scale-105 transition-transform duration-200 ${color}`}
    >
      <div className="bg-white bg-opacity-20 p-2 rounded-full">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

// Storage logic
function handleScreenshot(type: "visible" | "full" | "select") {
  console.log(`Take ${type} screenshot`);
  const dummyData = "data:image/png;base64,iVBORw0..."; // ← use actual captured base64
  void browser.storage.local.set({ lastScreenshot: dummyData });
}

function handleDownloadLast() {
  browser.storage.local.get("lastScreenshot", (result) => {
    const dataUrl = result.lastScreenshot as string | undefined;
    if (dataUrl) {
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "screenshot.png";
      a.click();
    } else {
      alert("No screenshot found.");
    }
  });
}
