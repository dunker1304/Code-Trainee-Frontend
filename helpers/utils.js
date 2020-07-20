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

export const translateClassName = (level) => {
  switch (level) {
    case 'Easy':
      return 'success';
    case 'Medium':
      return 'warning';
    case 'Hard':
      return 'danger';
  }
}

export const getQuery = (query)=> {
  //format discuss_id
  return query.split('_')[1]
}