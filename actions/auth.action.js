import axios from 'axios';

export const loadUserInfo = () => {
  const url = `http://localhost:1337/api/test`;
  return dispatch => {
    let promise = new Promise((resolve, reject) => {
      axios
        .get(url)
        .then( res => {
          console.log(res.data.get[0], 'ressponese')
          dispatch({
            type: 'LOADED_USER_INFO',
            payload: res.data.get[0]
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