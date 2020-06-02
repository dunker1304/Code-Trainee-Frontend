import axios from 'axios';

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