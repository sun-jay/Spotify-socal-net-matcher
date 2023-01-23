import CryptoJS from "crypto-js";
import cookie from "cookie"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import LoginLink from "../components/LoginLink.js"
import LogoutBtn from "../components/LogoutBtn"


export default function Navbar({ curr_user }) {
  console.log("Curr_User", curr_user)

  const [nav, setNav] = useState(false);
  const [cur, setCur] = useState("Home");
  const [color, setColor] = useState("transparent");
  const [textColor, setTextColor] = useState("white");

  const handleNav = () => {
      setNav(!nav);
    };
  
  useEffect(() => {
    const changeColor = () => {
      if (window.scrollY >= 90) {
        setColor('#000000');
        setTextColor('#ffffff');
      } else {
        setColor('transparent');
        setTextColor('#ffffff');
      }
    };
    window.addEventListener('scroll', changeColor);
  }, []);

return (
  <div style={{ backgroundColor: `${color}` }} className="fixed left-0 top-0 w-full z-20 ease-in duration-300">
    <div className="max-w-[1300px] m-auto flex md:justify-between justify-between items-center p-4 text-white">
      <Link className = "md:block hidden " href="/">
        <h1 style={{ color: `${textColor}` }} className="text-4xl">Calify.com</h1>
      </Link>
      <ul style={{ color: `${textColor}` }} className="hidden md:flex">
        <li className={cur === "Home"? "p-4 font-bold	": "p-4"}>
          <Link onClick={()=>{handleNav; setCur('Home')}} href="/">
          <button className="text-white  font-bold py-2 px-4 rounded-full">
                Home
            </button>
          </Link>
        </li>
        {!curr_user? (
        <li className={cur === "Projects"? "p-4 font-bold	": "p-4 "}>
          <div onClick={()=>{handleNav; setCur('Projects')}} >
            <LoginLink> 
            </LoginLink>
          </div>
        </li> ) :
        (
        <li className={cur === "Projects"? "p-4 font-bold	": "p-4 "}>
          <div onClick={()=>{handleNav; setCur('Projects')}} >
            <LogoutBtn> 
            </LogoutBtn>
          </div>
        </li>   )
        }


        {/* <li className="p-4">
          <Link href="/work">Work</Link>
        </li>
        <li className="p-4">
          <Link href="/contact">Contact</Link>
        </li> */}
      </ul>
      <div className="block md:hidden">Calify</div>
      <div onClick={handleNav} className='block md:hidden z-10'>
        {nav ? (
          <AiOutlineClose size={20} style={{ color: nav ? '#ffffff': `${textColor}`   } } />
        ) : (
          <AiOutlineMenu size={20} style={{ color: `${textColor}` }} />
        )}
      </div>
      {/* mobile */}
      <div 
        className={
          nav
            ? "md:hidden absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center w-full h-screen bg-black text-center ease-in duration-200"
            : "md:hidden absolute top-0 left-[-100%] right-0 bottom-0 flex justify-center items-center w-full h-screen bg-black text-center ease-in duration-200"
        } 
      >
        <ul>
          <li className={cur === "Home"? "font-bold p-4 text-4xl hover:text-gray-500": "p-4 text-4xl hover:text-gray-500"}>
            <Link onClick={()=>{handleNav(); setCur('Home');}} href="/">Home</Link>
          </li>
          <li className={cur === "Projects"? "font-bold p-4 text-4xl hover:text-gray-500": "p-4 text-4xl hover:text-gray-500"}>
            <div onClick={()=>{handleNav(); setCur('Projects');}}>


              <LoginLink> 
              </LoginLink>

              {/* make this a log out button if theres cookies */}

            </div>
          </li>
          {/* <li className="p-4 text-4xl hover:text-gray-500">
            <Link href="/work">Work</Link>
          </li>
          <li className="p-4 text-4xl hover:text-gray-500">
            <Link href="/contact">Contact</Link>
          </li> */}
        </ul>
      </div>
    </div>
  </div>
);
}

Navbar.getInitialProps = async ({ req, res }) => {
  function parseCookies(req) {
    return cookie.parse(req ? req.headers.cookie || "" : document.cookie)
  }
  const data = parseCookies(req)

  if (res) {
    if (Object.keys(data).length === 0 && data.constructor === Object) {
      res.writeHead(301, { Location: "/" })
      res.end()
    }
  }

  function decode_cookie() {
    var encrypted_user_string
    try {
      encrypted_user_string = data.user?data.user:console.error(e);
    }
    catch {
      return "Please Sign In"
    }
    var bytes = CryptoJS.AES.decrypt(encrypted_user_string, process.env.NEXT_PUBLIC_SESSION_SECRET);
    var cookie_json = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return cookie_json
  }

  return {
    curr_user: decode_cookie()
  }
}