import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireUser } from "../../../../lib/server-utils";

interface CartItemRouteParams {
  params: {
    id: string;
  };
}

export async function DELETE(_request: Request, { params }: CartItemRouteParams) {
  try {
    const user = await requireUser();
    const item = await prisma.cartItem.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!item || item.userId !== user.id) {
      return NextResponse.json({ error: "Cart item not found." }, { status: 404 });
    }

    await prisma.cartItem.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 401 });
  }
}
