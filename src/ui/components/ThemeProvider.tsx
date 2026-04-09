import { useEffect, type ReactNode } from "react";
import { settingsStorage } from "@/core/storage/shared";
import { useStorageItem } from "@/ui/hooks/useStorageItem";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { value: settings } = useStorageItem(settingsStorage);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", settings.theme);
  }, [settings.theme]);

  return <>{children}</>;
}

