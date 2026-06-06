import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireAdmin } from "../../../../lib/server-utils";

interface OrderRouteParams {
  params: {
    id: string;
  };
}

export async function PATCH(request: Request, { params }: OrderRouteParams) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "Order status is required." }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 401 });
  }
}
