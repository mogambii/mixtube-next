import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = 5;

    if (!username) {
        return NextResponse.json(
            { error: 'Username is required' },
            { status: 400 }
        );
    }

    try {
        // First get the user to ensure they exist and get their ID
        const user = await prisma.user.findUnique({
            where: { username },
            select: { id: true }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const skip = (page - 1) * limit;

        // Get mixtapes with their stats
        const [mixtapes, totalCount] = await Promise.all([
            prisma.mixtape.findMany({
                where: {
                    userId: user.id
                },
                select: {
                    title: true,
                    imgthumb: true,
                    unique: true,
                    djName: true,
                    stats: {
                        select: {
                            plays: true,
                            downloads: true
                        }
                    }
                },
                orderBy: {
                    time: 'desc'
                },
                skip,
                take: limit
            }),
            prisma.mixtape.count({
                where: {
                    userId: user.id
                }
            })
        ]);

        // Calculate total plays and downloads for each mixtape
        const formattedMixtapes = mixtapes.map(mixtape => ({
            title: mixtape.title,
            imgthumb: mixtape.imgthumb,
            unique: mixtape.unique,
            djName: mixtape.djName,
            engagement: {
                plays: mixtape.stats.reduce((sum, stat) => sum + stat.plays, 0),
                downloads: mixtape.stats.reduce((sum, stat) => sum + stat.downloads, 0)
            }
        }));

        const totalPages = Math.ceil(totalCount / limit);
        
        return NextResponse.json({
            mixes: formattedMixtapes,
            pagination: {
                currentPage: page,
                totalPages,
                totalDocs: totalCount,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching mixes:', error);
        return NextResponse.json(
            { error: 'Failed to fetch mixes' },
            { status: 500 }
        );
    }
}
