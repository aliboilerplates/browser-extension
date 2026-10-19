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
    <div className="pointer-events-none fixed right-4 bottom-4 z-[2147483647]">
      <div className="rounded-box bg-base-100 ring-base-300 px-4 py-3 text-sm shadow-xl ring-1">
        {message}
      </div>
    </div>
  );
}
