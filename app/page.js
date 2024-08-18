import MpNav from "./(components)/MpNav";
import TopMixtapes from "./(components)/TopMixtapes";
import NewMixtapes from "./(components)/NewMixtapes";
import Link from "next/link";
import NavMenu from "@/components/NavMenu";

export const metadata = {
  title: "MixTube",
  description: "Explore, play and download your favourite mixtapes",
  openGraph: {
    title: "MixTube",
    description: "Explore, play and download your favourite mixtapes",
    images: [
      {
        url: "https://i.ibb.co/17dxyfD/a5282d7a00d9ec58056a5.png",
        width: 800,
        height: 600,
        alt: "MixTube",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MixTube",
    description: "Explore, play and download your favourite mixtapes",
    images: ["https://i.ibb.co/17dxyfD/a5282d7a00d9ec58056a5.png"],
  },
};

export default function Mainpage() {
  return (
    <div className="min-h-screen">
      <header className="flex justify-between items-center p-0">
        <Link href="/search" className="flex-1 mr-2">
          <MpNav place="search mixtape" />
        </Link>
        <NavMenu />
      </header>

      <main className="pt-8 pb-10 w-full">
        <section className=" bg-slate-100 dark:bg-gray-950 rounded-2xl p-4 mb-6">
          <TopMixtapes />
        </section>

        <section className="w-full">
          <div className="dark:bg-gray-950 bg-slate-100 rounded-2xl p-4">
            <NewMixtapes />
          </div>
        </section>
      </main>
    </div>
  );
}
