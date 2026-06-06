import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { requireAdmin } from "../../../lib/server-utils";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { name, description, price, stock, category, brand, imageUrl } = body;

    if (!name || !description || !price || !stock || !category || !brand || !imageUrl) {
      return NextResponse.json({ error: "Missing required product fields." }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        category,
        brand,
        imageUrl,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
