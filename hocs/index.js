import { Component } from 'react';
import { connect } from 'react-redux'
import { LocaleProvider } from 'antd'
import cookies from 'next-cookies'
import Router , { useRouter} from 'next/router';
import { loadUserInfo } from '../store/auth/action'
import {getCookieFromReq} from '../helpers/utils'
import { compose} from "redux"
const CONSTANTS  = require('../utils/constants')

 
const AuthHOC = Page => {
  
  class Hocs extends Component {
    
    static getInitialProps = async contextType => {
      const {store : {dispatch ,getState}, pathname, req, res,as } = contextType
      const isServer = !!req;
  
      const accessToken = isServer ? getCookieFromReq(req,'access_token') : null
      contextType.accessToken = accessToken;
      if (isServer) {
        if (accessToken) {
          await dispatch(loadUserInfo(accessToken))
          let isAuthenticated = getState().auth.isAuthenticated
          let result = ignoreRouter(pathname,isAuthenticated,getState().auth.userInfo);
            if(!result['isIgnore'] && result['code']  == 1) {
                 res.writeHead(302, { Location: '/' });
                 res.end();
                 return {}
            }

            if(!result['isIgnore'] && result['code']  == 2) {
              res.writeHead(302, { Location: '/accessDeny' });
              res.end();
              return {}
         }


        } else {
          let isAuthenticated = getState().auth.isAuthenticated
          let result = ignoreRouter(pathname,isAuthenticated,getState().auth.userInfo);
            if(!result['isIgnore'] && result['code']  == 1) {
                 res.writeHead(302, { Location: '/' });
                 res.end();
                 return {}
            }

            if(!result['isIgnore'] && result['code']  == 2) {
              res.writeHead(302, { Location: '/accessDeny' });
              res.end();
              return {}
        }
      } 
    }
     

     return  Page.getInitialProps 
     ? await Page.getInitialProps(contextType)
     : {}
    } 

    constructor(props) {
      super(props)
    }



    render() {
      return (
        <Page {...this.props} />
      )
    }
  }

  return Hocs
 
}

const     ignoreRouter = (pathname , isAuthenticated ,userInfo) =>{

  // ignore router
  const routerIgnore = [ '/problem' , '/playground', '/accessDeny','/exercise/[exerciseId]/discuss']
  
  for(let i= 0 ; i < routerIgnore.length ; i++) {
     if(pathname.includes(routerIgnore[i])){
       return {
         isIgnore: true
       }
     } 
  }

  if(!isAuthenticated)
     return {
      isIgnore: false,
      code :1
    }

  //if user and teacher -> access admin router -> return false
   if(userInfo && userInfo['role'] && 
       ( userInfo['role']['id'] == CONSTANTS.ROLE.ROLE_STUDENT || 
       userInfo['role']['id'] == CONSTANTS.ROLE.ROLE_STUDENT) && pathname.includes('/admin')
     )
     {
       return  {
        isIgnore: false,
        code :2
        }
     }

   // if user -> access teacher router -> return false;

    const privateTeacherRouter = ['/exercise', '/exercise-list'];
    if(userInfo && userInfo['role'] && userInfo['role']['id'] == CONSTANTS.ROLE.ROLE_STUDENT ){
       let filterList = privateTeacherRouter.filter(ele=> {
         return pathname !== (ele.toString())
       })
       if(filterList.length == privateTeacherRouter.length) 
          return   { isIgnore: true }
       else 
          return  {
              isIgnore: false,
              code :2
           }
    }

    return  {
      isIgnore: true,
      
   }

}

const mapStateToProps = store => ({
  userInfo: store.auth.userInfo,
  isAuthenticated : store.auth.isAuthenticated
})


const composedAuthHOC = compose(
  connect(mapStateToProps,null), AuthHOC
  )
export default composedAuthHOC;


// return connect(mapStateToProps)(Hocs)