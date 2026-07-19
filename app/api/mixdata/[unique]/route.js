import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { unique } = await params;

    const mixtape = await prisma.mixtape.findUnique({
      where: { unique },
      select: {
        unique: true,
        title: true,
        djName: true,
        genre: true,
        audio: true,
        imgthumb: true,
        compressed: true,
        compressedUrl: true,
        hlsUrl: true,
        waveformUrl: true,
      },
    });

    return NextResponse.json(mixtape);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
