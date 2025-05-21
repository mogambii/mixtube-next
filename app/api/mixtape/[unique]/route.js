import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { unique } = params;

  try {
    const mixtape = await prisma.mixtape.findUnique({
      where: { unique },
      include: {
        user: {
          select: {
            username: true,
            profilep: true,
            id: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                username: true,
                profilep: true,
                id: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    // console.log(mixtape);

    if (!mixtape) {
      return new NextResponse("Mixtape not found", { status: 404 });
    }

    const responseData = {
      id: mixtape.id,
      title: mixtape.title,
      desc: mixtape.desc,
      genre: mixtape.genre,
      cover: mixtape.imgthumb,
      audio: mixtape.audio,
      downloadUrl: mixtape.downloadUrl,
      time: mixtape.time,
      unique: mixtape.unique,
      djName: mixtape.djName,
      totalPlays: mixtape.totalPlays,
      totalDownloads: mixtape.totalDownloads,
      totalLikes: mixtape.totalLikes,
      user: {
        username: mixtape.user.username,
        profilep: mixtape.user.profilep,
        userId: mixtape.user.id,
      },
      comments: mixtape.comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        user: {
          username: comment.user.username,
          profilep: comment.user.profilep,
          id: comment.user.id,
        },
      })),
    };
    // console.log(responseData);
    return new NextResponse(JSON.stringify(responseData), { status: 200 });
  } catch (error) {
    console.error("Error fetching mixtape:", error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
