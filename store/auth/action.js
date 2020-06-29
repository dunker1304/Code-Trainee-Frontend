import axios from 'axios';

export const loadUserInfo = (accessToken) => {
  const url = `http://localhost:1337/api/current_user`;
  return dispatch => {
    let promise = new Promise((resolve, reject) => {
      axios({
        method: 'get',
        withCredentials : true,
        url: url,
        headers : { Authorization: `Bearer ${accessToken}` }
      }) .then( res => {
        dispatch({
          type: 'LOADED_USER_INFO',
          payload: res.data.user
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


  export const signIn = (email,password)=> {
    const url = `http://localhost:1337/signin`;
    
    const config = { headers: { 'Content-Type': 'application/json' } };
    const data = {email : email , password : password}
    return dispatch => {
      let promise = new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: url,
          data:data,
          withCredentials : true
        }) .then( res => {
          dispatch({
            type: 'SIGN_IN',
            payload: res.data
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

  export const displayLogin = (isShow,type)=> {
    return dispatch => {
      dispatch({
        type: 'DISPLAY_LOGIN',
        payload: { isShow :isShow , type: type}
      })
     }
 }

 export const signUp = (data) => {
   const url = `http://localhost:1337/signup`
   return dispatch => {
    let promise = new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: url,
          data :data
        }) .then( res => {
          console.log(res)
          dispatch({
            type: 'SIGN_UP',
            payload: res.data
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




  