import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  const me = await getSessionUser();
  if (!me) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  return NextResponse.json({ id: me.id, name: me.name, role: me.role });
}
