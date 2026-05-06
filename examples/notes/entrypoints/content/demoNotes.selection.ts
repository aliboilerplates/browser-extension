export function getSelectedText() {
  return globalThis.getSelection()?.toString().trim() ?? "";
}

