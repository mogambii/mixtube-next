import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const { unique } = params;

    try {
        const mixtape = await prisma.mixtape.findUnique({
            where: { unique },
            include: {
                stats: true,
                mixtapeLikes: true,
                user: {
                    select: {
                        username: true,
                        profilep: true,
                        id: true
                    }
                },
                comments: {
                    include: {
                        user: {
                            select: {
                                username: true,
                                profilep: true,
                                id: true    
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        if (!mixtape) {
            return new NextResponse("Mixtape not found", { status: 404 });
        }

        // Calculate totals from stats
        const totals = mixtape.stats.reduce((acc, stat) => ({
            plays: acc.plays + stat.plays,
            downloads: acc.downloads + stat.downloads,
            likes: acc.likes + stat.likes
        }), { plays: 0, downloads: 0, likes: 0 });

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
            totalPlays: totals.plays,
            totalDownloads: totals.downloads,
            totalLikes: mixtape.mixtapeLikes.length, // Count user likes from mixtapeLikes
            user: {
                username: mixtape.user.username,
                profilep: mixtape.user.profilep,
                userId: mixtape.user.id
            },
            comments: mixtape.comments.map(comment => ({
                id: comment.id,
                content: comment.content,
                createdAt: comment.createdAt,
                user: {
                    username: comment.user.username,
                    profilep: comment.user.profilep,
                    id: comment.user.id
                }
            }))
        };

        return new NextResponse(JSON.stringify(responseData), { status: 200 });
    } catch (error) {
        console.error('Error fetching mixtape:', error);
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
