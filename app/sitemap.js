import { GetDjs, GetMixtapes } from "@/actions/functions";

const baseUrl = "https://mixtube.xyz";


export default async function sitemap() {

  const sitemapArray = [
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
      url: baseUrl + "/upload",
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
    {
      url: baseUrl + "/signup",
      lastModified: new Date(),
    },
    {
      url: baseUrl + "/notifications",
      lastModified: new Date(),
    }
  ];
  return sitemapArray;
}
