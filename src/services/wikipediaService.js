/**
 * Wikipedia GeoSearch + Summary API
 * Completely free, no API key required.
 * Used by AuraMode to show historical/cultural context for the user's location.
 * Docs: https://www.mediawiki.org/wiki/API:Geosearch
 */

const WIKI_API = 'https://en.wikipedia.org/w/api.php';

/**
 * Find Wikipedia articles geographically near the given coordinates.
 * Returns an array of articles with title + snippet.
 */
export async function fetchNearbyWikiArticles(lat, lon, limit = 6) {
  const params = new URLSearchParams({
    action: 'query',
    list: 'geosearch',
    gscoord: `${lat}|${lon}`,
    gsradius: 3000,
    gslimit: limit,
    format: 'json',
    origin: '*',
  });

  const res = await fetch(`${WIKI_API}?${params}`);
  if (!res.ok) throw new Error(`Wikipedia geosearch error: ${res.status}`);
  const data = await res.json();
  return data.query?.geosearch ?? [];
}

/**
 * Fetch the full extract (summary) for a given page title.
 * Returns { title, extract, thumbnail, url }
 */
export async function fetchWikiArticle(title) {
  const params = new URLSearchParams({
    action: 'query',
    titles: title,
    prop: 'extracts|pageimages|info',
    exintro: true,
    explaintext: true,
    exsentences: 4,
    pithumbsize: 400,
    inprop: 'url',
    format: 'json',
    origin: '*',
  });

  const res = await fetch(`${WIKI_API}?${params}`);
  if (!res.ok) throw new Error(`Wikipedia article error: ${res.status}`);
  const data = await res.json();

  const pages = data.query?.pages ?? {};
  const page = Object.values(pages)[0];

  if (!page || page.missing !== undefined) return null;

  return {
    title: page.title,
    extract: page.extract ?? '',
    thumbnail: page.thumbnail?.source ?? null,
    url: page.fullurl ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
    pageid: page.pageid,
  };
}

/**
 * Combined: find the best nearby article and return its full content.
 * Tries each nearby article until it finds one with a real extract.
 */
export async function fetchLocationLore(lat, lon) {
  const nearby = await fetchNearbyWikiArticles(lat, lon, 8);
  if (!nearby.length) return null;

  for (const article of nearby) {
    const full = await fetchWikiArticle(article.title);
    if (full && full.extract && full.extract.length > 100) {
      return {
        ...full,
        dist: article.dist,
        lat: article.lat,
        lon: article.lon,
      };
    }
  }

  return null;
}
