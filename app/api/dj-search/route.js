import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = request.nextUrl;
    const query = searchParams.get("query") || "";
    const sort = searchParams.get("sort") || "name"; // Default to name if not provided
    const filter = searchParams.get("filter") || "all"; // Get filter parameter
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    // Process API request parameters

    const skip = (page - 1) * limit;

    try {
        // Build where clause based on filter
        let whereClause = {
            type: "DJ", // Filter for DJ users only
        };

        // Add search query if provided
        if (query) {
            whereClause.OR = [
                {
                    username: {
                        contains: query.toLowerCase(),
                    },
                },
                {
                    djName: {  
                        contains: query.toLowerCase(),
                    },
                },
            ];
        }

        // Determine sort order based on the actual schema
        let orderBy = {};
        
        // Add filter conditions
        if (filter === "new") {
            // For new DJs, sort by createdAt (most recent first)
            orderBy = {
                createdAt: 'desc'
            };
        }
        // Note: verified and trending filters have been removed
        
        // If filter didn't set orderBy, use the sort parameter
        if (Object.keys(orderBy).length === 0) {
            if (sort === "name") {
                // Sort by DJ name alphabetically
                orderBy = { djName: 'asc' };
            } else if (sort === "followers") {
                // Looking at the schema, we need to count the followedBy relation
                orderBy = { followedBy: { _count: 'desc' } };
            } else if (sort === "popular") {
                // Sort by mixtapes count as a measure of popularity
                orderBy = { mixtapes: { _count: 'desc' } };
            } else {
                // Default sort by DJ name
                orderBy = { djName: 'asc' };
            }
        }

        // Execute Prisma query with the configured parameters

        const results = await prisma.user.findMany({
            where: whereClause,
            select: {
                username: true,
                profilep: true,
                djName: true,
                createdAt: true, // Include createdAt for "new" sorting
                _count: {
                    select: { followedBy: true, mixtapes: true }
                }
            },
            skip: skip,
            take: limit,
            orderBy: orderBy
        });

        const totalResults = await prisma.user.count({
            where: whereClause,
        });

        const totalPages = Math.ceil(totalResults / limit);

        const response = {
            results,
            pagination: {
                currentPage: page,
                totalPages,
                totalResults,
                limit
            }
        };

        // Return the formatted response
        return new NextResponse(JSON.stringify(response), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
