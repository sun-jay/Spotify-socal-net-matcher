import React from 'react'
import { useState , useEffect} from 'react';
import { useRouter } from 'next/router';
import userServices from '@/firebase/userServices';
import Link from 'next/link';
import { useCookies } from 'react-cookie';
import CryptoJS from "crypto-js";


const Callback = () => {
    const [cookies, setCookie] = useCookies(["user"]);
  const [signedIn, setSignIn] = useState(false);
  const [name, setName] = useState(undefined);

  useEffect(() => {
    setName(  decode_cookie(cookies).name);
  });

  function decode_cookie(cookie) {
    var encrypted_user_string;
    try {
      encrypted_user_string = cookie.user ? cookie.user : console.error(e);
    } catch {
      return "Please Sign In";
    }
    var bytes = CryptoJS.AES.decrypt(
      encrypted_user_string,
      process.env.NEXT_PUBLIC_SESSION_SECRET
    );
    var cookie_json = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return cookie_json;
  }

    const [status, setstatus] = useState("Loading ...");

    const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const CLIENT_SECRET = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;

    //get code from URL
    const { asPath } = useRouter();
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
    const url = `${origin}${asPath}`;
    function findAndReturn(str, sub) {
        var index = str.indexOf(sub);
        if (index !== -1) {
            return str.substring(index + sub.length);
        }
        return "Substring not found.";
    }
    const code = findAndReturn(url, "code=")

    //use code to get refresh and access token
    const getRefreshToken = async () => {
        const response =
            await fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: {
                    Authorization: `Basic ${Buffer.from(
                        `${CLIENT_ID}:${CLIENT_SECRET}`
                    ).toString("base64")}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    grant_type: "authorization_code",
                    code: code,
                    redirect_uri: REDIRECT_URI,
                }),
            });

        return await response.json();
    }
    //use access token to get user info
    const getInfo = async (access_token) => {

        const response = await fetch("https://api.spotify.com/v1/me/", {
            headers: {
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
            },
        });
        return await response.json();
    };
    //get all users from firebase
    const getUsers = async () => {
        const data = await userServices.getAllUsers();
        var users = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        return (users)
    }

    //gets access and refresh tokens
    getRefreshToken()
        .then((value) => {
            console.log(value)
            //checks that it actually sent back tokens
            if (value.refresh_token) {
                console.log("acess toekan", value.access_token)
                //gets account information given access token
                const name = getInfo(value.access_token)
                    .then((inf) => {

                        //at this point I want to store the spoitify user ID and the Refresh token in cookies;

                        // data = {id: inf.spotify_id, refresh: value.refresh_token}
                        // cipher and set cookie

                        var cook = {name: inf.display_name, id:inf.id, refresh_token: value.refresh_token, img_url: inf.images[0]?.url ? inf.images[0].url :"https://www.meme-arsenal.com/memes/b6a18f0ffd345b22cd219ef0e73ea5fe.jpg"}
                        
                        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(cook), process.env.NEXT_PUBLIC_SESSION_SECRET ).toString();
                        
                        cook.error?{}:setCookie("user", ciphertext, {path: "/", maxAge: 3600,sameSite: true,})

                        //gets all users from firebase
                        var u = getUsers().then((all_users) => {
                            //searches all users and checks if emails match, if so, updates refresh token in user's record

                            for (var user of all_users) {
                                if (user.email === inf.email) {
                                    userServices.updateUser(user.id, { email: inf.email, name: inf.display_name, refresh_token: value.refresh_token })
                                    console.log("UPDATED USER RECORD")
                                    return
                                }
                            }
                            //if email not found in firebase, adds new user record
                            userServices.addUser({ email: inf.email, name: inf.display_name, refresh_token: value.refresh_token })
                            return
                        })
                    })
                console.log("REFRESH_TOKEN:", value.refresh_token ? (value.refresh_token, "Success") : "weird error")
                value.refresh_token ? setstatus("Logged In!"):console.log("failed")
            }
        })
        


    return (
        <div className='bg_gradient  w-screen h-screen text-white text-xl'>
            <div className='w-screen h-screen items-center flex flex-col justify-evenly'>
                <div className='text-8xl ml-10'>{status}</div>
                <div className='text-8xl ml-10'>Welcome, {name}</div>
                <Link className="text-white spotify_green font-bold py-2 px-4 rounded-full" href="/">
                    Return Home
                </Link>
            </div>
        </div>

    )
}

export default Callback