import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Categories fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, slug, image } = await req.json();

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        image,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Category creation error:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
