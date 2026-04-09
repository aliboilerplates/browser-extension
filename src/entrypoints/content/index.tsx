import "@/assets.css";
import { browser } from "wxt/browser";
import { saveSelectionAsNote } from "./demoNotes.bridge";
import { getSelectedText } from "./demoNotes.selection";
import { ContentToast } from "@/ui/components/ContentToast";
import ReactDOM from "react-dom/client";
import { useEffect, useState } from "react";
import { defineContentScript } from "wxt/utils/define-content-script";
import { createShadowRootUi } from "wxt/utils/content-script-ui/shadow-root";
import { createContentMessageListener } from "./messageListener";

function ContentApp() {
  const [selectedText, setSelectedText] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    const handleMouseUp = () => {
      setSelectedText(getSelectedText());
    };

    const contentMessageListener = createContentMessageListener((message) => {
      setToastMessage(message);
      setToastVisible(true);
      window.setTimeout(() => {
        setToastVisible(false);
      }, 1800);
    });

    document.addEventListener("mouseup", handleMouseUp);
    browser.runtime.onMessage.addListener(contentMessageListener);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      browser.runtime.onMessage.removeListener(contentMessageListener);
    };
  }, []);

  return (
    <>
      {selectedText ? (
        <div className="fixed bottom-4 left-4 z-[2147483647]">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              void saveSelectionAsNote(selectedText);
              setSelectedText("");
            }}
            type="button"
          >
            Save selection
          </button>
        </div>
      ) : null}
      <ContentToast message={toastMessage} visible={toastVisible} />
    </>
  );
}

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: "template-content-ui",
      position: "inline",
      anchor: "body",
      onMount: (container) => {
        const wrapper = document.createElement("div");
        container.append(wrapper);

        const root = ReactDOM.createRoot(wrapper);
        root.render(<ContentApp />);
        return { root, wrapper };
      },
      onRemove: (elements) => {
        elements?.root.unmount();
        elements?.wrapper.remove();
      }
    });

    ui.mount();
  }
});
