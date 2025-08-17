"use client";
import { useState } from "react";
import Lightbox from "@/components/Lightbox";

export default function PhotoStrip({ urls }: { urls: string[] }) {
  const [open, setOpen] = useState(false);
  if (!urls?.length) return null;
  return (
    <>
      <div className="mt-1 grid grid-cols-3 gap-2">
        {urls.slice(0, 3).map((u, i) => (
          <button key={u + i} onClick={() => setOpen(true)} className="group">
            <img
              src={u}
              alt={`photo ${i + 1}`}
              className="h-24 w-full object-cover rounded-md border group-hover:opacity-90"
            />
          </button>
        ))}
      </div>
      <Lightbox urls={urls} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
