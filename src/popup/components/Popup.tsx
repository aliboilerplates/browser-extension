import { useState } from "react";
import browser from "webextension-polyfill";

interface Message {
  text: string;
}

export const Popup: React.FC = () => {
  const [response, setResponse] = useState<string>("");

  async function sendMessageToBackgroundScript() {
    const response = await browser.runtime.sendMessage<Message, Message>({
      text: "Popup",
    });

    setResponse(response.text);
  }

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
