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
    {
      url: baseUrl + "/",
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: baseUrl + "/login",
      lastModified: new Date(),
    },
    {
      url: baseUrl + "/editprofile",
      lastModified: new Date(),
    },
    {
      url: baseUrl + "/upload",
      lastModified: new Date(),
    },
    {
      url: baseUrl + "/editmixtape",
      lastModified: new Date(),
    },
    {
      url: baseUrl + "/profile",
      lastModified: new Date(),
    },
    {
      url: baseUrl + "/discover",
      lastModified: new Date(),
    },
    {
      url: baseUrl + "/mix",
      lastModified: new Date(),
    },
    {
      url: baseUrl + "/dj",
      lastModified: new Date(),
    },
    {
      url: baseUrl + "/search",
      lastModified: new Date(),
    },
    {
      url: baseUrl + "/discoverdjs",
      lastModified: new Date(),
    },
    {
      url: baseUrl + "/discovermixtapes",
      lastModified: new Date(),
    },
    ...Mixobj,
    ...Djobj,
  ];
  return sitemapArray;
}
