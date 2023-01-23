import React from 'react'
import { useCookies } from "react-cookie"
import { useState, useEffect} from 'react'
import { handleClientScriptLoad } from 'next/script'



const login = () => {
    const [cookie, setCookie, removeCookie] = useCookies(["user"])

    return (


        <button onClick={() =>removeCookie("user")} className="text-white spotify_green font-bold py-2 px-4 rounded-full">
            Logout
        </button>
    )
}

export default login