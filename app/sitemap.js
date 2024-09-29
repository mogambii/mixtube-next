import { GetDjs, GetMixtapes } from "@/actions/functions";

const baseUrl = "https://mixtube.xyz";


export default async function sitemap() {
  console.debug("Generating sitemap...");
  const [Djs, Mixxes] = await Promise.all([GetDjs(), GetMixtapes()]);

  console.debug("DJs fetched:", Djs);
  console.debug("Mixtapes fetched:", Mixxes);

  const Mixobj =
    Mixxes?.map((mix) => ({
      url: `${baseUrl}/mix/${mix.unique}`,
      lastModified: mix.time,
    })) || [];

  const Djobj =
    Djs?.map((dj) => ({
      url: `${baseUrl}/dj/${dj.username}`,
      lastModified: new Date(),
    })) || [];

  console.debug("Mix object created:", Mixobj);
  console.debug("DJ object created:", Djobj);

  const sitemapArray = [
    {
      url: baseUrl,
      lastModified: new Date(),
      priority: 1,
    },
    ...Mixobj,
    ...Djobj,
  ];

  console.debug("Sitemap generated:", sitemapArray);
  return sitemapArray;
}
