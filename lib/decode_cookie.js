import CryptoJS from 'crypto-js'

export default function decode_cookie(cookie) {
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