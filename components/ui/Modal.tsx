"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "./Icons";

export function Modal({
  open,
  onClose,
  children,
  label,
  side,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  label: string;
  /** render as a sheet sliding in from the right */
  side?: boolean;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex" role="dialog" aria-modal="true" aria-label={label}>
      <button aria-label="Close" className="animate-fade absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className={
          side
            ? "animate-slide-in relative ml-auto flex h-full w-full max-w-md flex-col overflow-y-auto bg-paper"
            : `animate-rise relative m-auto max-h-[92vh] w-[calc(100%-2rem)] overflow-y-auto bg-paper ${wide ? "max-w-5xl" : "max-w-xl"}`
        }
      >
        <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center bg-paper/80 text-ink backdrop-blur transition hover:bg-ink hover:text-paper">
          <CloseIcon />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
