import { Component } from 'react';
import { connect } from 'react-redux'
import { LocaleProvider } from 'antd'
import Cookies from 'universal-cookie'
import Router from 'next-router'
import { loadUserInfo } from '../store/auth/action'
import {getCookieFromReq} from '../helpers/utils'
const cookies = new Cookies();

export default Page => {
  
  class Hocs extends Component {
    
    static getInitialProps = async contextType => {
      const {store : {dispatch}, pathname, req, res} = contextType
      const isServer = !!req;
    
      const accessToken = isServer ? getCookieFromReq(req,'access_token') : cookies.get('access_token')
      contextType.accessToken = accessToken;
      if (isServer) {
        if (accessToken) {
          await dispatch(loadUserInfo(accessToken))
        } else {
         // res.redirect('/signin')
        }
      } else {
        if (accessToken) {
          await dispatch(loadUserInfo())
        } else {
          //window.location.href = "http://localhost:3000/playground";
        }
      }

     return {  };
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
  const mapStateToProps = store => ({
    userInfo: store.auth.userInfo
  })

  return connect(mapStateToProps)(Hocs)
}