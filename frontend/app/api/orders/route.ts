import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { requireUser } from "../../../lib/server-utils";

export async function GET() {
  try {
    const user = await requireUser();
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const { shippingAddress, shippingCity, shippingPostalCode, shippingCountry, shippingPhone } = body;

    if (!shippingAddress || !shippingCity || !shippingPostalCode || !shippingCountry || !shippingPhone) {
      return NextResponse.json({ error: "Missing shipping details." }, { status: 400 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount,
        paymentMethod: "COD",
        shippingAddress,
        shippingCity,
        shippingPostalCode,
        shippingCountry,
        shippingPhone,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    await prisma.cartItem.deleteMany({ where: { userId: user.id } });

    await Promise.all(
      cartItems.map((item) =>
        prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: item.product.stock - item.quantity,
          },
        }),
      ),
    );

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 401 });
  }
}
