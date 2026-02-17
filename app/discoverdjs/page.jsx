import DiscoverDjsClient from "./DiscoverDjsClient";

const INITIAL_LIMIT = 18;
const DEFAULT_SORT = "popular";
const DEFAULT_FILTER = "all";

export const metadata = {
  title: "Discover DJs | mixtapped",
  description:
    "Explore and discover talented DJs on mixtapped. Browse profiles, listen to mixes, and connect with the DJ community.",
  alternates: { canonical: "/discover-djs" },
};

async function getInitialDjs(sort = DEFAULT_SORT, filter = DEFAULT_FILTER) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(
      `${baseUrl}/api/dj-search?sort=${sort}&filter=${filter}&page=1&limit=${INITIAL_LIMIT}`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const data = await res.json();
    return {
      results: data.results || [],
      pagination: data.pagination || { currentPage: 1, totalPages: 1 },
    };
  } catch (err) {
    console.error("Failed to fetch initial DJs:", err);
    return {
      results: [],
      pagination: { currentPage: 1, totalPages: 1 },
      error: err.message,
    };
  }
}

export default async function DiscoverDjsPage({ searchParams }) {
  const { sort: sortParam, filter: filterParam } = await searchParams;
  const sort = sortParam || DEFAULT_SORT;
  const filter = filterParam || DEFAULT_FILTER;

  const { results, pagination, error } = await getInitialDjs(sort, filter);

  return (
    <DiscoverDjsClient
      initialResults={results}
      initialPagination={pagination}
      initialSort={sort}
      initialFilter={filter}
      initialLimit={INITIAL_LIMIT}
      initialError={error || null}
    />
  );
}
