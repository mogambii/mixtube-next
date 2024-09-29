import { GetDjs, GetMixtapes } from "@/actions/functions";

const baseUrl = "https://mixtube.xyz";

function sanitizeUrl(str) {
  return str.replace(/[^\w-]+/g, '-') 
            .replace(/--+/g, '-')  
            .replace(/^-|-$/g, ''); 
}

export default async function sitemap() {
  const [Djs, Mixxes] = await Promise.all([GetDjs(), GetMixtapes()]);

  const Mixobj =
    Mixxes?.map((mix) => ({
      url: `${baseUrl}/mix/${sanitizeUrl(mix.unique)}`,
      lastModified: new Date(mix.time),
    })) || [];

  const Djobj =
    Djs?.map((dj) => ({
      url: `${baseUrl}/dj/${sanitizeUrl(dj.username)}`,
      lastModified: new Date(),
    })) || [];

  const sitemapArray = [
    {
      url: baseUrl,
      lastModified: new Date(),
      priority: 1,
    },
    ...Mixobj,
    ...Djobj,
  ];
  return sitemapArray;
}
