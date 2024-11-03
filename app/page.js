import dynamic from 'next/dynamic';
import TopMixtapes from "./(components)/TopMixtapes";
import NewMixtapes from "./(components)/NewMixtapes";
import Link from "next/link";

// Dynamically import MpNav and NavMenu for performance optimization
const MpNav = dynamic(() => import('./(components)/MpNav'));
const NavMenu = dynamic(() => import('@/components/NavMenu'));

export const metadata = {
  title: "Explore Mixtapes | Discover & Download Mixtube Music",
  description: "Explore the latest mixtapes, stream, and download your favorite music on MixTube. Share your playlists, and discover new artists every day.",
  keywords: "latest mixtapes, free music, download mixtapes, mixtube music, playlists, trending music, mixtape downloads, music streaming",
  openGraph: {
    type: "website",
    url: "https://mixtube.xyz/",
    title: "Discover & Download Mixtapes | MixTube",
    description: "Stream and download the best mixtapes from your favorite artists on MixTube. Share playlists and stay updated with new releases.",
    images: [
      {
        url: "https://i.ibb.co/17dxyfD/a5282d7a00d9ec58056a5.png",
        width: 800,
        height: 600,
        alt: "MixTube - Stream, download, and share your favorite mixtapes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stream & Download Your Favorite Mixtapes | MixTube",
    description: "Explore the hottest mixtapes on MixTube. Play, download, and share your favorite music anytime.",
    images: ["https://i.ibb.co/17dxyfD/a5282d7a00d9ec58056a5.png"],
  },
  alternates: {
    canonical: "https://mixtube.xyz/",
  },
};


export default function Mainpage() {
  return (
    <div className="min-h-screen">
      <header className="flex justify-between items-center p-0" role="banner">
        <Link href="/search" className="flex-1 mr-2" aria-label="Search Mixtapes">
          <MpNav place="Search Mixtape" />
        </Link>
        <NavMenu />
      </header>

      <main className="pt-8 pb-10 w-full" role="main">
        <section className="bg-slate-100 dark:bg-gray-950 rounded-2xl p-4 mb-6" aria-labelledby="top-mixtapes-heading">
          <h2 id="top-mixtapes-heading" className="text-lg font-semibold text-gray-800 dark:text-slate-50 mb-2">Top Mixtapes</h2>
          <TopMixtapes />
        </section>

        <section className="w-full" aria-labelledby="new-mixtapes-heading">
          <h2 id="new-mixtapes-heading" className="text-lg font-semibold text-gray-800 dark:text-slate-50 mb-2">New Mixtapes</h2>
          <div className="dark:bg-gray-950 bg-slate-100 rounded-2xl p-4">
            <NewMixtapes />
          </div>
        </section>
      </main>
    </div>
  );
}
