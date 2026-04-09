import { create } from "zustand";

interface PopupState {
  query: string;
  setQuery: (query: string) => void;
}

export const usePopupStore = create<PopupState>((set) => ({
  query: "",
  setQuery: (query) => set({ query }),
}));

