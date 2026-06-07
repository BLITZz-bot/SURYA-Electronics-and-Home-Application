import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireAdmin } from "../../../../lib/server-utils";

interface UserRouteParams {
  params: {
    id: string;
  };
}

export async function PATCH(request: Request, { params }: UserRouteParams) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { role } = body;

    if (!role || !["customer", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: { role },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
