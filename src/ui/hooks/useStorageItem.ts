import { useEffect, useState } from "react";

type StorageWatchCallback<T> = (value: T) => void;

type StorageLike<T> = {
  fallback: T;
  getValue: () => Promise<T>;
  setValue: (value: T) => Promise<void>;
  watch: (callback: StorageWatchCallback<T>) => () => void;
};

export function useStorageItem<T>(item: StorageLike<T>) {
  const [value, setValue] = useState<T>(item.fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    void item.getValue().then((next: T) => {
      if (!isMounted) {
        return;
      }

      setValue(next);
      setLoading(false);
    });

    const unwatch = item.watch((next: T) => {
      setValue(next);
    });

    return () => {
      isMounted = false;
      unwatch();
    };
  }, [item]);

  const update = async (next: T) => {
    await item.setValue(next);
  };

  return { value, loading, update } as const;
}
