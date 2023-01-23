import '@/styles/globals.css'
import { CookiesProvider } from "react-cookie"

import Navbar from '@/components/Navbar'
import CryptoJS from "crypto-js";
import cookie from "cookie"

export default function App({ Component, pageProps }) {
  return (
    <div className=''>
      <CookiesProvider>
        <Navbar />
        < Component {...pageProps} />
      </CookiesProvider>
    </div>
  )
}

