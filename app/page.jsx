import dynamic from "next/dynamic";
import TopMixtapes from "./(components)/TopMixtapes";
import NewMixtapes from "./(components)/NewMixtapes";
import Link from "next/link";

// Dynamically import MpNav and NavMenu for performance optimization
const MpNav = dynamic(() => import("./(components)/MpNav"));
const NavMenu = dynamic(() => import("@/components/NavMenu"));

export const metadata = {
  title: "Stream & Download the Best DJ Mixtapes | MixTube Music",
  description:
    "Discover the top DJ mixtapes on MixTube. Stream, download, and share trending mixtapes. Explore new DJs, exclusive mixes, and your favorite music daily.",
  keywords:
    "DJ mixtapes, free mixtape downloads, trending mixtapes, new DJ mixes, mixtape streaming, music downloads, share mixtapes, top mixtapes, MixTube music",
  openGraph: {
    type: "website",
    url: "https://mixtube.xyz/",
    title: "Stream & Download Trending DJ Mixtapes | MixTube",
    description:
      "Get the latest DJ mixtapes on MixTube. Stream music, download exclusive mixes, and discover trending DJs. Share and enjoy top mixtapes daily.",
    images: [
      {
        url: "https://mixtube.xyz/og.jpg",
        width: 800,
        height: 600,
        alt: "MixTube - Discover and stream the best DJ mixtapes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stream & Download Top DJ Mixtapes | MixTube",
    description:
      "Find trending DJ mixtapes on MixTube. Stream, download, and share your favorite mixes anytime. Explore exclusive music and new DJs daily.",
    images: ["https://mixtube.xyz/og.jpg"],
  },
  alternates: {
    canonical: "https://mixtube.xyz/",
  },
};


export default function Mainpage() {
  return (
    <div className="min-h-screen">
      <header className="flex justify-between items-center p-0" role="banner">
        <Link
          href="/search"
          className="flex-1 mr-2"
          aria-label="Search Mixtapes"
        >
          <MpNav place="Search Mixtape" />
        </Link>
        <NavMenu />
      </header>

      <main className="pt-8 pb-10 w-full" role="main">
        <section
          className="bg-slate-100 dark:bg-gray-950 rounded-2xl p-4 mb-6"
          aria-labelledby="top-mixtapes-heading"
        >
          <TopMixtapes />
        </section>

        <section className="w-full" aria-labelledby="new-mixtapes-heading">
          <div className="dark:bg-gray-950 bg-slate-100 rounded-2xl p-4">
            <NewMixtapes />
          </div>
        </section>
      </main>
    </div>
  );
}
