import { NextResponse } from "next/server";
import { COOKIE_TDB } from "@/lib/tdb/auth";

export const runtime = "nodejs";

export async function POST() {
  const reponse = NextResponse.json({ ok: true });
  reponse.cookies.set({
    name: COOKIE_TDB,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return reponse;
}
