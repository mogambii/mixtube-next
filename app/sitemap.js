import { GetDjs, GetMixtapes } from "@/actions/functions";

const baseUrl = "https://mixtube.xyz";

// Function to sanitize URL strings for use in routes
function sanitizeUrl(str) {
  return str.replace(/[^\w-]+/g, '-') 
            .replace(/--+/g, '-')  
            .replace(/^-|-$/g, ''); 
}

// Function to generate sitemap dynamically
export default async function sitemap() {
  try {
    // Fetch the latest DJs and Mixtapes data
    const [Djs, Mixxes] = await Promise.all([GetDjs(), GetMixtapes()]);

    // Generate the mixtape URLs
    const Mixobj = Mixxes?.map((mix) => ({
      url: `${baseUrl}/mix/${sanitizeUrl(mix.unique)}`,
      lastModified: new Date(mix.time), // Use the mix's actual last modified time
      priority: 0.8, // Medium priority for mixtapes
    })) || [];

    // Generate the DJ URLs
    const Djobj = Djs?.map((dj) => ({
      url: `${baseUrl}/dj/${sanitizeUrl(dj.username)}`,
      lastModified: new Date(dj.updatedAt || dj.createdAt), // Latest timestamp for DJ profiles
      priority: 0.7, // Lower priority for individual DJ pages
    })) || [];

    // Static pages that are generally fixed and infrequently updated
    const staticPages = [
      {
        url: baseUrl + "/",
        lastModified: new Date(),
        priority: 1.0, // Highest priority for the homepage
      },
      {
        url: baseUrl + "/login",
        lastModified: new Date(),
        priority: 0.5,
      },
      {
        url: baseUrl + "/editprofile",
        lastModified: new Date(),
        priority: 0.5,
      },
      {
        url: baseUrl + "/upload",
        lastModified: new Date(),
        priority: 0.5,
      },
      {
        url: baseUrl + "/editmixtape",
        lastModified: new Date(),
        priority: 0.5,
      },
      {
        url: baseUrl + "/profile",
        lastModified: new Date(),
        priority: 0.5,
      },
      {
        url: baseUrl + "/discover",
        lastModified: new Date(),
        priority: 0.6,
      },
      {
        url: baseUrl + "/mix",
        lastModified: new Date(),
        priority: 0.7,
      },
      {
        url: baseUrl + "/dj",
        lastModified: new Date(),
        priority: 0.7,
      },
      {
        url: baseUrl + "/search",
        lastModified: new Date(),
        priority: 0.6,
      },
      {
        url: baseUrl + "/discoverdjs",
        lastModified: new Date(),
        priority: 0.6,
      },
      {
        url: baseUrl + "/discovermixtapes",
        lastModified: new Date(),
        priority: 0.6,
      },
    ];

    // Combine static pages with dynamic content (Mixtapes + DJs)
    const sitemapArray = [
      ...staticPages,
      ...Mixobj,
      ...Djobj,
    ];

    // Sort all URLs by lastModified date (newest first)
    sitemapArray.sort((a, b) => b.lastModified - a.lastModified);

    // Return the final sorted sitemap array
    return sitemapArray;

  } catch (error) {
    console.error("Error generating sitemap:", error);
    return []; // Return an empty array if an error occurs
  }
}
