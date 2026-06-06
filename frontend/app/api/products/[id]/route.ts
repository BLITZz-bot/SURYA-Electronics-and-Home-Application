import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireAdmin } from "../../../../lib/server-utils";

interface ProductRouteParams {
  params: {
    id: string;
  };
}

export async function GET(_request: Request, { params }: ProductRouteParams) {
  const product = await prisma.product.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PATCH(request: Request, { params }: ProductRouteParams) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { name, description, price, stock, category, brand, imageUrl } = body;

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price: price !== undefined ? Number(price) : undefined,
        stock: stock !== undefined ? Number(stock) : undefined,
        category,
        brand,
        imageUrl,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: ProductRouteParams) {
  try {
    await requireAdmin();

    await prisma.product.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
