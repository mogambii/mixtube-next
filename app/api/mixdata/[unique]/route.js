import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req,{params}) {
    try {
        const { unique } = params;

        const mixtape = await prisma.mixtape.findUnique({
            where: { unique },
            select: {
                unique: true,
                title: true,
                audio: true,
                imgthumb: true,
            }
        })

        console.log(mixtape);
        return NextResponse.json(mixtape);
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}