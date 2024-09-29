"use server"
async function fetchData(url) {
  console.debug(`Fetching data from: ${url}`);
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const data = await res.json();
    console.debug(`Data fetched successfully from: ${url}`, data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

export async function GetMixtapes() {
  console.debug("Getting mixtapes...");
  return fetchData("https://server-nezz.vercel.app/allmx");
}

export async function GetDjs() {
  console.debug("Getting DJs...");
  return fetchData("https://server-nezz.vercel.app/alldjs");
}
