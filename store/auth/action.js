import axios from 'axios';
import CONSTANTS from '../../constant'

export const loadUserInfo = () => {
  const url = `http://localhost:1337/api/test`;
  return dispatch => {
    let promise = new Promise((resolve, reject) => {
      axios
        .get(url)
        .then( res => {
          dispatch({
            type: 'LOADED_USER_INFO',
            payload: res.data.get
          })
          resolve(res)
        })
        .catch( error => {
          console.log(error, 'send eorr')
          reject(error)
        })
    })
    return promise
  }
}

export const authGoogle = (accessToken) => {
  const url = `http://localhost:1337/oauth/google/`;
  return dispatch => {
    let promise = new Promise((resolve, reject) => {
      axios
        .post(url, {'access_token':accessToken}, {headers: {'Content-Type': 'application/json',}})
        .then( res => {
          dispatch({
            type: 'GOOGLE_AUTH',
            payload: res.data.get
          })
          resolve(res)
        })
        .catch( error => {
          console.log(error, 'send eorr')
          reject(error)
        })
    })
    return promise
  }
}