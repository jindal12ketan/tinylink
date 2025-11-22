import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: Promise<{ code: string }> }) {
  const { code } = await context.params;
  console.log(code, "response code");

  const res = await query("SELECT * FROM links WHERE code=$1", [code]);
  console.log(res, "response");

  if (res.rowCount === 0)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(res.rows[0]);
}

export async function DELETE(req: Request, context: { params: Promise<{ code: string }> }) {
  const { code } = await context.params;

  await query("DELETE FROM links WHERE code=$1", [code]);

  return NextResponse.json({ ok: true });
}
