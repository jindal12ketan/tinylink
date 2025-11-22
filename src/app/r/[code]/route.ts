import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(
  req: Request,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params;

  const res = await query("SELECT url FROM links WHERE code=$1", [code]);

  if (res.rowCount === 0) {
    return new NextResponse("Not found", { status: 404 });
  }

  const url = res.rows[0].url;

  // Update click count
  await query(
    "UPDATE links SET clicks = clicks + 1, last_clicked = NOW() WHERE code=$1",
    [code]
  );

  // Redirect the user to the target site
  return NextResponse.redirect(url);
}
