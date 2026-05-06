export function ContentToast({
  message,
  visible,
}: {
  message: string;
  visible: boolean;
}) {
  if (!visible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[2147483647]">
      <div className="rounded-box bg-base-100 px-4 py-3 text-sm shadow-xl ring-1 ring-base-300">
        {message}
      </div>
    </div>
  );
}

