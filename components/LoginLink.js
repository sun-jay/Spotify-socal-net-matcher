import React from 'react'

const login = () => {
    const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const CLIENT_SECRET = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
    const scope = 'user-read-private user-read-email user-read-recently-played user-top-read    ';

    const querystring = require("querystring");
    const queryParams = querystring.stringify({
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        scope: scope
    });

    return (
        <a className='' href={`https://accounts.spotify.com/authorize?${queryParams}`}>
            <button className="text-white spotify_green font-bold py-2 px-4 rounded-full">
                Login With Spotify
            </button>
        </a>
    )
}

export default login