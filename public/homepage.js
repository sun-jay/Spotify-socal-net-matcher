import CryptoJS from "crypto-js";
import cookie from "cookie"


export default function HomePage({ curr_user }) {
  // console.log(curr_user)

  return (
    <>
      <div className="m-24">
        <h1>Homepage </h1>
        <p>Logged in As: {curr_user.name}</p>
      </div>
    </>
  )
}

HomePage.getInitialProps = async ({ req, res }) => {
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