import React from 'react'

const Match = () => {
    return (
        <div className='bg_gradient  w-screen h-screen text-white text-xl'>
            <div className='w-screen h-screen flex flex-col justify-evenly p-10'>

                <div className='text-6xl '>
                    <span className=''>{`Today's Top Song: `}</span>
                    <span className='font-bold linear-wipe'>
                        {`${top_song?.key.split(',')[0]} by ${top_song?.key.split(',')[1]} with ${top_song?.value} plays!`}
                    </span>
                </div>
                <div className='text-5xl '>
                    <span className=''>{`Minutes Listened in the past 24 hours: `}</span>

                    <span className='font-bold linear-wipe'>26,256</span>
                </div>
                <div className='text-4xl '>
                    <span className=''>{`Today's Top Genre: `}</span>
                    <span className='font-bold linear-wipe'>Rap</span>
                </div>



            </div>
        </div>
    )
}

export default Match