import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const variable = process.env.NEXT_PUBLIC_VAR
  // console.log(variable)
  return (
    <div className='bg-black'>
      hello
    </div>
  )
}
