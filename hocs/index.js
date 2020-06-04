import { Component } from 'react';
import { connect } from 'react-redux'
import { LocaleProvider } from 'antd'
import Cookies from 'universal-cookie'
import Router from 'next-router'
import { loadUserInfo } from '../store/auth/action'
const cookies = new Cookies();

export default Page => {
  class Hocs extends Component {
    static getInitialProps = async contextType => {
      const {
        isServer,
        req,
        res,
        store: { dispatch }
      } = contextType
      // console.log(contextType, 'content-type')
      const accessToken = isServer ? req.cookies.hc_token : cookies.get('hc_token')
      contextType.accessToken = accessToken;
      if (isServer) {
        if (accessToken) {
         // await dispatch(loadUserInfo(accessToken))
        } else {
          res.redirect('/signin')
        }
      } else {
        if (true) {
         // await dispatch(loadUserInfo())
        } else {
          window.location.href = "http://localhost:3000/signin";
        }
      }

      return {}
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