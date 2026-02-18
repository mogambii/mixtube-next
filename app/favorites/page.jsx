import { getServerSession } from "next-auth";
import FavoritesClient from "./FavoritesClient";
import { authOptions } from "../api/auth/[...nextauth]/route";
import prisma from "@/lib/prismadb";

const LIMIT = 9;

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="flex flex-col items-center justify-center h-screen gap-4"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Please Log In to View Your Favorites
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            You need to be logged in to access your favorite mixtapes.
          </p>
        </div>
        <div className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full">
          Go to Login
        </div>
        <div className="text-gray-500 dark:text-gray-400 mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </div>
      </Link>
    );
  }

  // Fetch first page on the server
  const [totalCount, favorites] = await Promise.all([
    prisma.mixtapeLike.count({
      where: { userId: session.user.id },
    }),
    prisma.mixtapeLike.findMany({
      where: { userId: session.user.id },
      select: {
        mixtape: {
          select: {
            id: true,
            djName: true,
            imgthumb: true,
            unique: true,
            title: true,
          },
        },
        createdAt: true,
      },
      skip: 0,
      take: LIMIT,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const initialFavorites = favorites.map((fav) => ({
    id: fav.mixtape.id,
    title: fav.mixtape.title,
    imgthumb: fav.mixtape.imgthumb,
    unique: fav.mixtape.unique,
    djName: fav.mixtape.djName || "Unknown DJ",
    createdAt: fav.createdAt.toISOString(), // serialize for client
  }));

  const totalPages = Math.ceil(totalCount / LIMIT);

  return (
    <FavoritesClient
      initialFavorites={initialFavorites}
      initialHasMore={totalPages > 1}
      limit={LIMIT}
    />
  );
}
