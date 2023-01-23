import React from 'react'
import { useCookies } from "react-cookie"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import decode_cookie from '@/lib/decode_cookie'
import userServices from '@/firebase/userServices'

const Profile = () => {

    const [cookies, setCookie, removeCookie] = useCookies(["user"]);
    const [token, setToken] = useState(undefined);
    const [name, setName] = useState(undefined);

    useEffect(() => {
        setToken(decode_cookie(cookies).refresh_token);
    });
    useEffect(() => {
        setName(decode_cookie(cookies).name);
    });

    const getUsers = async () => {
        const data = await userServices.getAllUsers();
        var users = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        return (users)
    }

    async function delete_user_firebase(passed_token) {
        //get all refresh tokens
        //find current refresh token from cookie in database
        //get database id of current user
        //delete database entry for user
        var u = getUsers().then((all_users) => {
            //searches all users and checks if emails match, if so, updates refresh token in user's record

            for (var user of all_users) {
                if (user.refresh_token === passed_token) {
                    userServices.deleteUser(user.id)
                    // console.log("DELETED USERS")
                    return
                }
            }
        })
        // can return a thing that changes state and when state changes deletes all cookies
        removeCookie("user")
    }

    return (
        <div className='bg_gradient  w-screen h-screen text-white text-xl'>
            <div className='w-screen h-screen items-center flex flex-col justify-evenly'>
                {token ? (
                    <div>
                        
                        <div className='text-8xl ml-10'>Welcome, {name}</div>
                    </div>
                ) : <div></div>
                }
                {token ? (
                    <div>
                        
                        
                        <button onClick={() => delete_user_firebase(token)} className="text-white spotify_green font-bold py-2 px-4 rounded-full" >
                            Logout and delete my data
                        </button>
                    </div>
                ) : <div className='text-8xl ml-10'>Logout Sucessful and Data Removed</div>
                }

                <Link className="text-white spotify_green font-bold py-2 px-4 rounded-full" href="/">
                    Return Home
                </Link>
            </div>
        </div>
    )
}

export default Profile