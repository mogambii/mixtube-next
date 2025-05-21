import getDb from "@/util/db";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const db = await getDb();
    const page = request.nextUrl.searchParams.get("page") || 1;

    const totalmixtapes = await db.collection("Mixtape").countDocuments();

    const mixtapes = await prisma.mixtape.findMany({
      orderBy: {
        totalDownloads: "desc",
      },
      select: {
        id: true,
        title: true,
        imgthumb: true,
        unique: true,
        djName: true,
        totalPlays: true,
        totalDownloads: true,
      },
      skip: (page - 1) * 12,
      take: 12,
    });
    const serializedMixtapes = mixtapes.map((mixtape) => ({
      ...mixtape,
      totalPlays: Number(mixtape.totalPlays),
      totalDownloads: Number(mixtape.totalDownloads),
    }));
    return NextResponse.json(
      { mixtapes: serializedMixtapes, totalmixtapes },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
