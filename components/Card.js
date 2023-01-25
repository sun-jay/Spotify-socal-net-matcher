import React from 'react'
import { SocialIcon } from 'react-social-icons';


const Card = ({ name, genre, artist, path, number }) => {
    return (
        <div>
            <div className='flex hover:bg-gray-600 items-center flex-col p-8 items-left m-2 justify-between border border-white rounded-lg	'>
                <div className='mb-4 font-bold text-2xl'>{number?"#"+number:""}</div>
                <div className='w-5/12 flex items-center justify-center m-2'>
                    
                    <div className='p-6'>
                        <SocialIcon bgColor="#1ECF5E" fgColor="#000000" url="https://open.spotify.com/" />
                    </div>
                    <img className={name==="You"?'rounded-full w-24 h-24':'rounded-full '} src={path} ></img>
                    <div className='p-6'>
                        <SocialIcon bgColor="#FCDCFB" fgColor="#CF2393" url="https://www.instagram.com/" />
                    </div>

                </div>
                <div className='m-2 text-2xl'>{name}</div>
                <div className='m-2'>Favorite Artist: {artist}</div>
                <div className='m-2'>Favorite Genre: {genre}</div>
            </div>
        </div>
    )
}

export default Card