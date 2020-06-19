export const getCookieFromReq = (req, cookieKey) => {
  let cookie = null
  if(req.headers.cookie) {
    cookie = req.headers.cookie
    .split(";")
    .find((c) => c.trim().startsWith(`${cookieKey}=`));
  }
  if (!cookie) return undefined;
  return cookie.split("=")[1];
}; 