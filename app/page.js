import MpNav from "./(components)/MpNav";
import TopMixtapes from "./(components)/TopMixtapes";
import NewMixtapes from "./(components)/NewMixtapes";
import Link from "next/link";
import NavMenu from "@/components/NavMenu";
import Head from "next/head";

export const metadata = {
  title: "Explore Mixtapes | Discover & Download Mixtube Music",
  description:
    "Explore the latest mixtapes, stream, and download your favorite music on MixTube. Share your playlists, and discover new artists every day.",
  keywords: "latest mixtapes, free music, download mixtapes, mixtube music, playlists",
  openGraph: {
    title: "Discover & Download Mixtapes | MixTube",
    description:
      "Stream and download the best mixtapes from your favorite artists on MixTube. Share playlists and stay updated with new releases.",
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
    description:
      "Explore the hottest mixtapes on MixTube. Play, download, and share your favorite music anytime.",
    images: ["https://i.ibb.co/17dxyfD/a5282d7a00d9ec58056a5.png"],
  },
};

export default function Mainpage() {
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:image" content={metadata.openGraph.images[0].url} />
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta name="twitter:description" content={metadata.twitter.description} />
        <meta name="twitter:image" content={metadata.twitter.images[0]} />
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MusicPlaylist",
              name: "Top Mixtapes",
              description:
                "Stream and download the best mixtapes from top artists. Explore, play, and share new releases on MixTube.",
              url: "https://mixtube.com",
              image: {
                "@type": "ImageObject",
                url: "https://i.ibb.co/17dxyfD/a5282d7a00d9ec58056a5.png",
                width: 800,
                height: 600,
                caption: "MixTube - Stream, download, and share your favorite mixtapes",
              },
              genre: "Hip-Hop, Rap, R&B",
              publisher: {
                "@type": "Organization",
                name: "MixTube",
                logo: {
                  "@type": "ImageObject",
                  url: "https://i.ibb.co/17dxyfD/a5282d7a00d9ec58056a5.png",
                  width: 60,
                  height: 60,
                },
              },
              mainEntityOfPage: "https://mixtube.com",
            }),
          }}
        />
      </Head>

      <div className="min-h-screen">
        <header className="flex justify-between items-center p-0">
          <Link href="/search" className="flex-1 mr-2">
            <MpNav place="Search Mixtape" />
          </Link>
          <NavMenu />
        </header>

        <main className="pt-8 pb-10 w-full">
          <section className="bg-slate-100 dark:bg-gray-950 rounded-2xl p-4 mb-6">
            <TopMixtapes />
          </section>

          <section className="w-full">
            <div className="dark:bg-gray-950 bg-slate-100 rounded-2xl p-4">
              <NewMixtapes />
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
