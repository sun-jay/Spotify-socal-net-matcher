import React from 'react'
import useSWR from "swr";
import userServices from '@/firebase/userServices';
import { useState, useEffect } from 'react';
import { data } from 'autoprefixer';
import Match from "../components/Match"
import { FaArrowCircleDown } from "react-icons/fa";
import Card from '@/components/Card';
import { useCookies } from 'react-cookie';
import decode_cookie from '@/lib/decode_cookie';
import { SocialIcon } from 'react-social-icons';


const Dashboard = () => {
  const [cookies, setCookie] = useCookies(["user"]);
  const [signedIn, setSignIn] = useState(false);
  const [img_url, setImg_url] = useState(undefined);

  useEffect(() => {
    setImg_url(decode_cookie(cookies).img_url);
  });
  const [top_song, setTopSong] = useState({ key: 'Loading...', value: 'Loading...' });

  const getUsers = async () => {
    const data = await userServices.getAllUsers();
    var users = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    return users
  }

  useEffect(() => {
    update_db()
    get_songs_db()
  }, [])

  const update_db = () => {
    const get_songs = async (refresh_token) => {
      const response = await fetch("api/stats/recents", {
        method: "POST",
        // body: "Search",
        body: refresh_token,
      });
      return await response.json();
    };
    async function loop(users) {
      for (let i = 0; i < users.length; i++) {
        var user = users[i]
        var songs = await get_songs(user.refresh_token);
        userServices.updateUser(user.id, { songs: songs })
        // console.log("DB updated")

      }
    };
    getUsers().then((users) => {
      setTopSong(users)
      loop(users)
    })
  }

  function get_songs_db() {
    function countOccurrences(arrays) {
      let counts = [];
      for (let array of arrays) {
        for (let element of array) {
          if (counts[element]) {
            counts[element]++;
          } else {
            counts[element] = 1;
          }
        }
      }
      return counts;
    }
    getUsers().then((users) => {
      var data = []
      for (var user of users) {
        data.push({
          user: user.id, songs: user.songs?.items?.map((recent) => ({
            title: recent.track.name,
            artist: recent.track.artists.map((_artist) => _artist.name).join(", "),
            url: recent.track.external_urls.spotify,
            coverImage: recent.track.album.images[1].url
          }))
        })
      }
      // console.log("get_songs_db:", data)

      var arr_of_song_arrs = data.map((user) => (user.songs ? user.songs.map((song) => [song.title, song.artist, song.url]) : []))
      // console.log("arr of arrs of songs:", arr_of_song_arrs)
      const counts = countOccurrences(arr_of_song_arrs)
      // console.log("Counts:", counts)

      function findHighest(arr) {
        let highest = { key: null, value: -Infinity };
        let lst = []
        for (var key in arr) {
          let temp_value = arr[key];
          if (temp_value > highest.value) {
            highest = { key: key, value: temp_value }
          }
        }
        return highest;
      }

      // function updateHighest(obj, highest) {
      //   let temp_key = Object.keys(obj)[0];
      //   let temp_value = obj[key];
      //   console.log(value)
      //   if (value > highest.value) {
      //     return { key: temp_key, value: temp_value }
      //   }
      //   return highest
      // }

      // console.log("Highest", findHighest(counts))

      setTopSong(findHighest(counts))
    })

  }



  return (
    <div>
      <div className='bg_gradient  w-screen h-screen text-white text-xl'>
        <div className='w-screen h-screen flex flex-col justify-evenly p-10'>

          <div className='text-6xl  '>
            <span className=''>{`Top Song: `}</span>
            <span className='font-bold   '>

              <span className='underline'>
                <div className='flex items-center'>

                  <a target="_blank" rel="noreferrer"  href={top_song?.key?.split(',').slice(-1)} >
                    <span className='linear-wipe mr-6' > {`  ${top_song?.key?.split(',')[0]} by ${top_song?.key?.split(',')[1]} `}</span>
                  </a>
                  <a target="_blank" rel="noreferrer"  href={top_song?.key?.split(',').slice(-1)} >
                    <div classname="" >
                      <img className='w-16 h-16' src="Spotify-Logo-PNG-Photos.png" />
                    </div>
                  </a>
                </div>
              </span>

              <span>{`with ${top_song?.value} plays!`}</span>

            </span>
          </div>
          <div className='text-5xl '>
            <span className=''>{`Minutes Listened in the past 24 hours: `}</span>

            <span className='font-bold linear-wipe'>26,256</span>
          </div>
          <div className='text-4xl flex w-1/2 justify-between'>
            <div className=''>
              <span className=''>{`Today's Top Genre: `}</span>
              <span className='font-bold  linear-wipe'>Rap</span>
            </div>
            <FaArrowCircleDown
              className="fade-d fade-m animate-[bounce_2s_ease-in-out_infinite]  text-white/70 select-none z-[2]"
              size={90}
              opacity={0.5}
            />
          </div>

        </div>
      </div>

      <div className='bg_gradient  w-screen h-screen text-white text-xl'>
        <div className='w-screen h-screen flex flex-col justify-evenly'>
          <div className='text-8xl ml-10'>Your Top Matches</div>
          <div className='flex items-center justify-evenly 	flex-grow: 0 '>
            <Card name='You' genre="Rap" artist="Drake" path={img_url} number=""></Card>
            <Card name='Victoria S.' genre="Rap" artist="Drake" path="girl_pfp Cropped.jpg" number="1"></Card>
            <Card name='Molly P.' genre="Rap" artist="Future" path="pfp Cropped.jpg" number="2"></Card>
            <Card name='Akira A.' genre="Rap" artist="Gunna" path='guypfp (1).png' number="3"></Card>

          </div>
        </div>
      </div>

    </div>

  )
}

export default Dashboard