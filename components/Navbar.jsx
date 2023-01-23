import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Link from "next/link";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import LoginLink from "./LoginLink.js";
import LogoutBtn from "./LogoutBtn";
import CryptoJS from "crypto-js";

export default function Navbar() {
  const [cookies, setCookie] = useCookies(["user"]);
  const [signedIn, setSignIn] = useState(false);
  const [img_url, setImg_url] = useState(undefined);
  // const [user, setUser] = useState(undefined)
  useEffect(() => {
    setSignIn(decode_cookie(cookies).id ? true : false);
  });
  // useEffect(() => {
  //   setUser(decode_cookie(cookies).img_url ? decode_cookie(cookies) : undefined);
  // });
  useEffect(() => {
    setImg_url(decode_cookie(cookies).img_url);
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

  console.log("Curr_User_navbar", cookies);
  console.log("decoded", decode_cookie(cookies));

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
        setColor("#000000");
        setTextColor("#ffffff");
      } else {
        setColor("transparent");
        setTextColor("#ffffff");
      }
    };
    window.addEventListener("scroll", changeColor);
  }, []);

  return (
    <div
      style={{ backgroundColor: `${color}` }}
      className="fixed left-0 top-0 w-full z-20 ease-in duration-300"
    >
      <div className="max-w-[1300px] w-full m-auto flex md:justify-between justify-between items-center p-4 text-white">
        <Link className="md:block hidden w-4/12 " href="/">
          <h1 style={{ color: `${textColor}` }} className="text-4xl">
            Calify.com
          </h1>
        </Link>
        <ul
          style={{ color: `${textColor}` }}
          className="hidden md:flex w-8/12 items-center justify-end"
        >
          <li className={cur === "Home" ? "p-4 font-bold	" : "p-4"}>
            <Link
              onClick={() => {
                handleNav;
                setCur("Home");
              }}
              href="/"
            >
              <button className="text-white  font-bold py-2 px-4 rounded-full">
                Home
              </button>
            </Link>
          </li>
          {signedIn ? (
            <li className={cur === "Projects" ? "p-4 font-bold	" : "p-4 "}>
              <div
                onClick={() => {
                  handleNav;
                  setCur("Projects");
                }}
              >
                <LogoutBtn></LogoutBtn>
              </div>
            </li>
          ) : (
            <li className={cur === "Projects" ? "p-4 font-bold	" : "p-4 "}>
              <div
                onClick={() => {
                  handleNav;
                  setCur("Projects");
                }}
              >
                <LoginLink></LoginLink>
              </div>
            </li>
          )}
          {signedIn ? (
            <li
              className={
                cur === "Projects" ? "p-4 font-bold	w-1/12" : "w-1/12 p-4 "
              }
            >
              <Link
                href="/profile"
              >
                <img className="rounded-full " src={img_url}></img>
              </Link>
              {/* {JSON.stringify(img_url)} */}
            </li>
          ) : (
            <div></div>
          )}

          {/* <li className="p-4">
          <Link href="/work">Work</Link>
        </li>
        <li className="p-4">
          <Link href="/contact">Contact</Link>
        </li> */}
        </ul>
        <div className="block md:hidden">Calify</div>
        <div onClick={handleNav} className="block md:hidden z-10">
          {nav ? (
            <AiOutlineClose
              size={20}
              style={{ color: nav ? "#ffffff" : `${textColor}` }}
            />
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
            <li
              className={
                cur === "Home"
                  ? "font-bold p-4 text-4xl hover:text-gray-500"
                  : "p-4 text-4xl hover:text-gray-500"
              }
            >
              <Link
                onClick={() => {
                  handleNav();
                  setCur("Home");
                }}
                href="/"
              >
                Home
              </Link>
            </li>
            <li
              className={
                cur === "Projects"
                  ? "font-bold p-4 text-4xl hover:text-gray-500"
                  : "p-4 text-4xl hover:text-gray-500"
              }
            >
              <div
                onClick={() => {
                  handleNav();
                  setCur("Projects");
                }}
              >
                <LoginLink></LoginLink>

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
