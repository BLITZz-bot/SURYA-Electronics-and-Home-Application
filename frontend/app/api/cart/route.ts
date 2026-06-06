import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { requireUser } from "../../../lib/server-utils";

export async function GET() {
  try {
    const user = await requireUser();
    const items = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: true,
      },
    });

    const serializedItems = items.map((item) => ({
      ...item,
      product: {
        ...item.product,
        price: Number(item.product.price),
        stock: item.product.stock,
      },
    }));

    return NextResponse.json({ items: serializedItems });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const { productId, quantity } = body;

    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json({ error: "Invalid cart payload." }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const requestedQuantity = Number(quantity);
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
    });

    const newQuantity = existingItem ? existingItem.quantity + requestedQuantity : requestedQuantity;
    if (newQuantity > product.stock) {
      return NextResponse.json({ error: "Quantity exceeds stock." }, { status: 400 });
    }

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          userId: user.id,
          productId,
          quantity: requestedQuantity,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 401 });
  }
}
