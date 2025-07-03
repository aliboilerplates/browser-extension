import { useEffect, useState } from "react";

export const Popup: React.FC = () => {
  const [response, setResponse] = useState<string>("");

  async function sendMessageToBackgroundScript() {
    await chrome.runtime.sendMessage({ text: "Popup" });
  }

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg: { text: string }) => {
      console.log("Message received From Background:", msg);
      setResponse(msg.text);
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold text-red-700">
        Hello, Chrome Extension!
      </h1>

      <button className="btn btn-info" onClick={sendMessageToBackgroundScript}>
        Send Message
      </button>

      <p>Response: {response}</p>
    </div>
  );
};
