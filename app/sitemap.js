const baseUrl = "https://mixtube.xyz";

async function fetchData(url) {
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

async function GetMixtapes() {
  return fetchData("https://server-nezz.vercel.app/allmx");
}

async function GetDjs() {
  return fetchData("https://server-nezz.vercel.app/alldjs");
}

export default async function sitemap() {
  const [Djs, Mixxes] = await Promise.all([GetDjs(), GetMixtapes()]);

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

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      priority: 1,
    },
    ...Mixobj,
    ...Djobj,
  ];
}
