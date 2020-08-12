import axios from 'axios';
import {getCookie} from "../../utils/cookies"
export const searchQuestion = (data)=> {
  const url = `${process.env.API}/api/search-exercise`;
  return dispatch => {
    let promise = new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: url,
        data : data ,
   //     headers : { Authorization: `Bearer ${getCookie('access_token')}` }
      }) .then( res => {
        dispatch({
          type: 'SEARCH_QUESTION',
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

export const chooseTags = (index) => {

  return dispatch => {
    dispatch({
      type: 'UPDATE_CATEGORY',
      payload: index
    })
   }
 }

export const dropdownFilter = (value) => {
  return dispatch => {
    dispatch({
      type: 'DROP_DOWN_FILTER',
      payload: value
    })
   }
}

export const getCategory = ()=> {
  ///api/get-category
  const url = `${process.env.API}/api/get-tag`;
  return dispatch => {
    let promise = new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: url,
        //headers : { Authorization: `Bearer ${accessToken}` }
      }) .then( res => {
        dispatch({
          type: 'GET_ALL_CATEGORY',
          payload: res.data.data
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

export const addToWishList = (questionId) => {
  const url = `${process.env.API}/api/add-wishList`;
  return dispatch => {
    let promise = new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: url,
        data: {questionId : questionId},
        headers : { Authorization: `Bearer ${getCookie('access_token')}` }
      }) .then( res => {
        dispatch({
          type: 'ADD_TO_WISHLIST',
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

export const removeToWishList = (questionId ,typeWishList) => {
  const url = `${process.env.API}/api/remove-wishList`;
  return dispatch => {
    let promise = new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: url,
        data: {exerciseId : questionId , typeWishList :typeWishList },
        headers : { Authorization: `Bearer ${getCookie('access_token')}` }
      }) .then( res => {
        dispatch({
          type: 'REMOVE_TO_WISHLIST',
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

export const getWishList = () => {
  const url = `${process.env.API}/api/wish-list`;
  return dispatch => {
    let promise = new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: url,
        headers : { Authorization: `Bearer ${getCookie('access_token')}` }
      }) .then( res => {
        dispatch({
          type: 'GET_TYPE_WISHLIST',
          payload: res.data.data
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

export const addTypeWishList = (name)=> {
  const url = `${process.env.API}/api/add-type-wish-list`;
  return dispatch => {
    let promise = new Promise((resolve, reject) => {
      axios({
        method: 'post',
        data : { name : name},
        url: url,
        //headers : { Authorization: `Bearer ${accessToken}` }
      }) .then( res => {
        dispatch({
          type: 'ADD_TYPE_WISHLIST',
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


export const getWishListByType = (type) => {
  const url = `${process.env.API}/api/wish-list/${type}`;
  return dispatch => {
    let promise = new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: url,
        //headers : { Authorization: `Bearer ${accessToken}` }
      }) .then( res => {
        dispatch({
          type: 'GET_WISHLIST_BY_TYPE',
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

export const getExerciseOfUser = (userId)=> {
  const url = `${process.env.API}/api/user/exercise/${userId}`;
  return dispatch => {
    let promise = new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: url,
        //headers : { Authorization: `Bearer ${accessToken}` }
      }) .then( res => {
        dispatch({
          type: 'GET_EXERCISE_OF_USER',
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
