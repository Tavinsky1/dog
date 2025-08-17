"use client";
import { useState } from "react";

export default function PhotoUpload({ placeId }: { placeId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");

  async function upload() {
    if (!file) return;
    setStatus("Requesting upload URL…");
    const res = await fetch("/api/uploads/photo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentType: file.type, placeId })
    });
    if (!res.ok) { setStatus("Failed to get presigned URL"); return; }
    const { uploadUrl, publicUrl } = await res.json();

    setStatus("Uploading…");
    const up = await fetch(uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
    if (!up.ok) { setStatus("Upload failed"); return; }

    setStatus("Uploaded! Pending moderation entry…");

    // optional: create a Photo row and Submission for moderation
    await fetch("/api/photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ placeId, url: publicUrl, width: 0, height: 0 })
    });

    setStatus("Photo submitted for approval.");
  }

  return (
    <div className="border rounded p-3 mt-3">
      <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0] ?? null)} />
      <button disabled={!file} onClick={upload} className="ml-2 px-3 py-1 border rounded disabled:opacity-50">Upload</button>
      <div className="text-xs mt-1 opacity-70">{status}</div>
    </div>
  );
}
