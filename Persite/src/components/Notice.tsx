import { useEffect, useRef } from 'react';



type NoticeProps = {
  message: string;
  onDismiss: () => void;
  timeout?: number;
};

export default function Notice({
  message,
  onDismiss,
  timeout = 7000,
}: NoticeProps) {
  const dismissRef = useRef(onDismiss);
  useEffect(() => {
    dismissRef.current = onDismiss;
  });

  useEffect(() => {
    if (!timeout) return;
    const id = window.setTimeout(() => dismissRef.current(), timeout);
    return () => window.clearTimeout(id);
  }, [timeout]);

  return (
    <aside className="notice" role="status">
      <p className="notice-text">{message}</p>
      <button
        className="notice-dismiss"
        onClick={() => dismissRef.current()}
        aria-label="Dismiss"
      >
        ×
      </button>
    </aside>
  );
}