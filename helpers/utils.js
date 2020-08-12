
import  Router  from "next/router";

const  CONSTANTS =  require("../utils/constants")

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
  let key = level.toUpperCase();
    switch (key) {
      case 'EASY':
        return 'success';
      case 'MEDIUM':
        return 'warning';
      case 'HARD':
        return 'danger';
    }
}

export const getQuery = (query)=> {
  //format discuss_id
  return query.split('_')[1]
}

export const redirectRouter = (roleId) => {
  switch(roleId) {
    case CONSTANTS.ROLE.ROLE_ADMIN : 
        Router.push('/admin/accounts')
        break;
    case CONSTANTS.ROLE.ROLE_TEACHER :
        Router.push('/exercise-list')
        break;
    case CONSTANTS.ROLE.ROLE_STUDENT :
        Router.push('/problem')
        break        
  }
}

export const validateDisplayName = (value) => {
   if(value.length > 25 ) {
      value = value.substring(0,22) + '...';
   }

   return value;

}

export const getCookie = (name) => {
  let matches = undefined;
  if (typeof window !== "undefined") {
     matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
   }
 
  return matches ? decodeURIComponent(matches[1]) : undefined;
}