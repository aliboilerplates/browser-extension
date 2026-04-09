import { Trash2 } from "lucide-react";
import { sendMessage } from "@/core/messaging";
import { settingsStorage } from "@/core/storage/storageItems";
import { demoNotesStorage } from "@/shared/demo-notes.storage";
import { useStorageItem } from "@/ui/hooks/useStorageItem";
import { usePopupStore } from "@/ui/stores/usePopupStore";

export function DemoNotesPanel() {
  const { value: notes, loading } = useStorageItem(demoNotesStorage);
  const { value: settings, update: updateSettings } =
    useStorageItem(settingsStorage);
  const query = usePopupStore((state) => state.query);
  const setQuery = usePopupStore((state) => state.setQuery);

  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(query.toLowerCase())
  );

  async function handleSubmit(formData: FormData) {
    const textField = formData.get("text");
    const text = typeof textField === "string" ? textField.trim() : "";

    if (!text) {
      return;
    }

    await sendMessage("demoNotes/createNote", {
      text,
      source: "popup",
    });
  }

  async function handleDelete(id: string) {
    await sendMessage("demoNotes/deleteNote", { id });
  }

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">Web Clipper Notes</h1>
        <p className="text-sm opacity-70">
          Save notes from the popup or selected text from the page.
        </p>
      </div>

      <form
        className="flex flex-col gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          void handleSubmit(formData);
          event.currentTarget.reset();
        }}
      >
        <textarea
          className="textarea textarea-bordered min-h-24 w-full"
          name="text"
          placeholder="Write a note"
        />
        <button className="btn btn-primary" type="submit">
          Save Note
        </button>
      </form>

      <div className="flex items-center gap-2">
        <input
          className="input input-bordered w-full"
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          placeholder="Filter notes"
          value={query}
        />
        <select
          className="select select-bordered"
          onChange={(event) => {
            void updateSettings({
              ...settings,
              theme: event.target.value as typeof settings.theme,
            });
          }}
          value={settings.theme}
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      {loading ? (
        <p className="text-sm opacity-70">Loading notes...</p>
      ) : filteredNotes.length === 0 ? (
        <p className="text-sm opacity-70">No notes yet.</p>
      ) : (
        <ul className="space-y-2">
          {filteredNotes.slice(0, settings.maxNotes).map((note) => (
            <li
              className="rounded-box border-base-300 bg-base-200 border p-3"
              key={note.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm">{note.text}</p>
                  <p className="text-xs opacity-60">{note.source}</p>
                </div>
                <button
                  aria-label={`Delete ${note.text}`}
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    void handleDelete(note.id);
                  }}
                  type="button"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
