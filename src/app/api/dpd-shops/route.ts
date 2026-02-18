import { NextRequest, NextResponse } from "next/server";

const DPD_API = "https://pickup.dpd.cz/api/GetParcelShopsByAddress";

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address") || "";
  const lang = request.nextUrl.searchParams.get("lang") || "fr";

  if (!address.trim()) {
    return NextResponse.json({ status: "error", data: { items: [] } });
  }

  const res = await fetch(
    `${DPD_API}?address=${encodeURIComponent(address)}&limit=10&lang=${lang}`,
    { next: { revalidate: 300 } }
  );
  const data = await res.json();

  return NextResponse.json(data);
}
