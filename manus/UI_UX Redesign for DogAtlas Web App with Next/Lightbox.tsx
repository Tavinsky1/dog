"use client";
import { useEffect } from "react";

export default function Lightbox({
  urls, open, startIndex = 0, onClose
}: { urls: string[]; open: boolean; startIndex?: number; onClose: ()=>void }) {
  // simple dialog-based lightbox
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 grid place-items-center p-4" onClick={onClose}>
      <div className="max-w-5xl w-full" onClick={(e)=>e.stopPropagation()}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {urls.map((u, i) => (
            <img key={u + i} src={u} className="w-full h-64 object-cover rounded-lg border" alt={`photo ${i+1}`} />
          ))}
        </div>
        <div className="text-center mt-3">
          <button onClick={onClose} className="px-3 py-1.5 rounded-md border text-white hover:bg-white/10">Close</button>
        </div>
      </div>
    </div>
  );
}
