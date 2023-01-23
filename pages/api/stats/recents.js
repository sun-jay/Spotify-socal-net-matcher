
const getAccessToken = async (refresh_token) => {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });
  return response.json();

};

const recents = async (refresh_token) => {
  const { access_token } = await getAccessToken(refresh_token);
  return fetch("https://api.spotify.com/v1/me/player/recently-played", {
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    },
  });
  // return `Bearer ${access_token} and ${refresh_token} and ${fetch("https://api.spotify.com/v1/me/player/recently-played", {
  //   headers: {
  //     Authorization: `Bearer ${access_token}`,
  //   },
  // })[0]}`
}

const getRecents = async (refresh_token) => {
  const { access_token } = await getAccessToken(refresh_token);
  const response = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=50&after=86400000", {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};

const recents2 = (req) => {
  return { b: "B" }
};

export default async function handler(req, res) {
  const token = req.body
  // const token = "AQBLLAH3MW_cgPvjXUbDgUhB1Hw-lOSdtNOaoKEQkwmv6lsFFsCuMWI8x7lkt2wJk9cXCzosQKr7ylnbsBzNmRi-c0FgqjpyjpxEDs_pNRRbpb125m-mRAnXXvdGtfoi8AY"
  const response = await getRecents(token);
  // const { items } = await response.json();
  // const r = items.slice(0, 5).map((recent) => ({
  //   title: recent.track.name,
  //   artist: recent.track.artists.map((_artist) => _artist.name).join(", "),
  //   url: recent.track.external_urls.spotify,
  //   coverImage: recent.track.album.images[1].url
  // }));

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=43200"
  );

  return res.status(200).json(response);
}