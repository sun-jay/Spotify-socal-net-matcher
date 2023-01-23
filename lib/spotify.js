export const getAccessToken = async (refresh_token) => {  
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token,
      }),
    });
    // console.log(response.json())
    return response.json();

  };

export const topTracks = async () => {
    const { access_token } = await getAccessToken();
  
    return fetch("https://api.spotify.com/v1/me/top/tracks", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
  };

  export const topArtists = async () => {
    const { access_token } = await getAccessToken();
  
    return fetch("https://api.spotify.com/v1/me/top/artists", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
  };
  export const recents = async () => {
    const { access_token } = await getAccessToken();
  
    return fetch("https://api.spotify.com/v1/me/player/recently-played", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
  };