import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  const body = await req.json();
  let { url, code } = body;

  if (!url)
    return NextResponse.json({ error: "URL required" }, { status: 400 });

  // Validate URL format
  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  // Auto-generate code if missing
  if (!code) code = nanoid(6);

  // Validate code format
  if (!/^[A-Za-z0-9]{6,8}$/.test(code))
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });

  // Check if code already exists
  const exists = await query("SELECT code FROM links WHERE code=$1", [code]);
  
  if (exists.rowCount > 0)
    return NextResponse.json({ error: "Code exists" }, { status: 409 });

  // Insert new link
  await query("INSERT INTO links (code, url) VALUES ($1,$2)", [code, url]);

  return NextResponse.json({ code }, { status: 201 });
}

export async function GET() {
  const res = await query("SELECT * FROM links ORDER BY created_at DESC");
  return NextResponse.json(res.rows);
}
