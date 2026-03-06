import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, scanUsage } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { handleCors, corsHeaders } from "@/lib/security";

const OPENFOODFACTS_API = "https://world.openfoodfacts.org/api/v2/product";

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) ?? NextResponse.json(null, { status: 204 });
}

export async function GET(request: NextRequest) {
  const cors = handleCors(request);
  if (cors) return cors;

  try {
    const deviceId = request.headers.get("x-device-id");
    if (!deviceId) {
      return NextResponse.json(
        { error: "Missing device ID" },
        { status: 401, headers: corsHeaders(request) }
      );
    }

    const barcode = request.nextUrl.searchParams.get("barcode");
    if (!barcode || !/^\d{8,14}$/.test(barcode)) {
      return NextResponse.json(
        { error: "Invalid barcode" },
        { status: 400, headers: corsHeaders(request) }
      );
    }

    // Verify user exists
    const [user] = await db()
      .select()
      .from(users)
      .where(eq(users.deviceId, deviceId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: "Device not registered" },
        { status: 401, headers: corsHeaders(request) }
      );
    }

    // Fetch from OpenFoodFacts (free, no API key needed)
    const response = await fetch(
      `${OPENFOODFACTS_API}/${barcode}.json?fields=product_name,brands,nutriments,serving_size,image_url`,
      { headers: { "User-Agent": "NourishAI/1.0 (CEO@epicai.ai)" } }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Barcode lookup failed" },
        { status: 502, headers: corsHeaders(request) }
      );
    }

    const data = await response.json();

    if (data.status !== 1 || !data.product) {
      return NextResponse.json(
        { error: "Product not found", barcode },
        { status: 404, headers: corsHeaders(request) }
      );
    }

    const p = data.product;
    const n = p.nutriments ?? {};

    // Log barcode scan (free, doesn't count toward AI limit)
    await db().insert(scanUsage).values({
      userId: user.id,
      scanType: "barcode",
      tokensUsed: 0,
    });

    // Sanity check: if kcal > 900/100g, the data is likely swapped with kJ
    let calories = Math.round(n["energy-kcal_100g"] ?? n["energy-kcal"] ?? 0);
    if (calories > 900) {
      // Likely kJ value in kcal field — convert or use kJ field
      const kj = n["energy-kj_100g"] ?? n["energy_100g"] ?? 0;
      if (kj > 0 && kj < calories) {
        calories = Math.round(kj / 4.184);
      } else {
        calories = Math.round(calories / 4.184);
      }
    }

    return NextResponse.json(
      {
        product: {
          name: p.product_name ?? "Unknown",
          brand: p.brands ?? "",
          servingSize: p.serving_size ?? "100g",
          imageUrl: p.image_url ?? null,
          nutrition: {
            calories,
            protein: Math.round((n.proteins_100g ?? n.proteins ?? 0) * 10) / 10,
            carbs: Math.round((n.carbohydrates_100g ?? n.carbohydrates ?? 0) * 10) / 10,
            fat: Math.round((n.fat_100g ?? n.fat ?? 0) * 10) / 10,
            fiber: Math.round((n.fiber_100g ?? n.fiber ?? 0) * 10) / 10,
            sugar: Math.round((n.sugars_100g ?? n.sugars ?? 0) * 10) / 10,
            sodium: Math.round((n.sodium_100g ?? n.sodium ?? 0) * 1000) / 10,
          },
        },
      },
      { headers: corsHeaders(request) }
    );
  } catch (error) {
    console.error("lookup-barcode error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders(request) }
    );
  }
}
