"use client";
import { useEffect, useState } from "react";

type Props = { roles: Array<"MOD" | "ADMIN">; children: React.ReactNode };

export default function RequireRole({ roles, children }: Props) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/me");
      if (!res.ok) return setAllowed(false);
      const me = await res.json();
      setAllowed(roles.includes(me.role));
    })();
  }, [roles]);

  if (allowed === null) return <div className="p-6">Checking permissions…</div>;
  if (!allowed) return <div className="p-6 text-red-600">Not authorized.</div>;
  return <>{children}</>;
}
