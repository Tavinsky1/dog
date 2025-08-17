"use client";
import { useEffect, useState } from "react";

type Submission = { id: string; type: string; status: string; placeId?: string | null; payload: any; notes?: string|null };

export default function ModPage() {
  const [subs, setSubs] = useState<Submission[]>([]);
  const [reason, setReason] = useState<Record<string,string>>({});

  useEffect(() => { fetch("/api/mod/pending").then(r => r.json()).then(setSubs); }, []);

  async function approve(id: string) {
    await fetch(`/api/moderation/${id}/approve`, { method: "POST" });
    setSubs(prev => prev.filter(s => s.id !== id));
  }
  async function reject(id: string) {
    const r = reason[id]?.trim();
    if (!r || r.length < 3) { alert("Please provide a short reason"); return; }
    await fetch(`/api/moderation/${id}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: r })
    });
    setSubs(prev => prev.filter(s => s.id !== id));
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Moderation queue</h1>
      <ul className="space-y-3">
        {subs.map(s => (
          <li key={s.id} className="border rounded p-3">
            <div className="text-sm opacity-60">{s.type}</div>
            <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">{JSON.stringify(s.payload, null, 2)}</pre>
            <div className="mt-2 flex gap-2">
              <button onClick={() => approve(s.id)} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
              <input
                value={reason[s.id] ?? ""}
                onChange={(e)=>setReason(prev=>({ ...prev, [s.id]: e.target.value }))}
                placeholder="Reason to reject…"
                className="flex-1 border rounded px-2 py-1"
              />
              <button onClick={() => reject(s.id)} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
