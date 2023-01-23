import { topArtists } from "../../../lib/spotify";

export default async function handler(req, res) {
  const response = await topArtists();
  const { items } = await response.json();

  const artists = items.slice(0, 5).map((artist) => ({
    artist: artist.name,
    img_url: artist.images[0].url
  }));

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=43200"
  );

  return res.status(200).json(artists);
}