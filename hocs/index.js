import { Component } from 'react';
import { connect } from 'react-redux'
import { LocaleProvider } from 'antd'
import cookies from 'next-cookies'
import Router from 'next/router';
import { loadUserInfo } from '../store/auth/action'
import {getCookieFromReq} from '../helpers/utils'
import { compose} from "redux"

 
const AuthHOC = Page => {
  
  class Hocs extends Component {
    
    static getInitialProps = async contextType => {
      const {store : {dispatch ,getState}, pathname, req, res, } = contextType
      const isServer = !!req;
  
      const accessToken = isServer ? getCookieFromReq(req,'access_token') : null
      contextType.accessToken = accessToken;
      if (isServer) {
        if (accessToken) {
          await dispatch(loadUserInfo(accessToken))
          let isAuthenticated = getState().auth.isAuthenticated
          if(!isAuthenticated)  {
            res.writeHead(302, { Location: '/' });
            res.end();
          }
        } else {
          res.writeHead(302, { Location: '/' });
          res.end();
        }
      } 
     // }
      //  else {
      //   console.log(cookies(contextType))
      //   if (accessToken) {
      //     await dispatch(loadUserInfo())
      //     //console.log(getState())
      //   } else {
      //     Router.replace(login);
      //   }
      // }

     return  Page.getInitialProps(contextType)
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

const mapStateToProps = store => ({
  userInfo: store.auth.userInfo,
  isAuthenticated : store.auth.isAuthenticated
})


const composedAuthHOC = compose(
  connect(mapStateToProps,null), AuthHOC
  )
export default composedAuthHOC;


// return connect(mapStateToProps)(Hocs)