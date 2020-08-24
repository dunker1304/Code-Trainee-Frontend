import axios from 'axios';
import {getCookie} from "../../utils/cookies"

export const getDiscussByQuestionId = (questionId,page,sortBy)=> {
  const url = `${process.env.API}/api/get-comment-question-id`;
  return dispatch => {
    let promise = new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: url,
        data: {questionId : questionId, page : page , sortBy : sortBy}
        //headers : { Authorization: `Bearer ${accessToken}` }
      }) .then( res => {
        dispatch({
          type: 'GET_COMMENT_QUESTION_ID',
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

export const getDiscussByCommentId = (commentId,req)=> {
  const url = `${process.env.API}/api/get-comment-comment-id`;
  return dispatch => {
    let promise = new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: url,
        data: {commentId : commentId},
        headers : { Authorization: `Bearer ${getCookie('access_token',req)}` }
      }) .then( res => {
        dispatch({
          type: 'GET_COMMENT_COMMENT_ID',
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

export const voteAComment = (commentId , statusVote ) => {
  const url = `${process.env.API}/api/create-vote-comment`;
  return dispatch => {
    let promise = new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: url,
        data: {commentId : commentId, statusVote :statusVote},
        headers : { Authorization: `Bearer ${getCookie('access_token',null)}` }
      }) .then( res => {
        dispatch({
          type: 'VOTE_A_COMMENT',
          payload:  {
            data :res.data.data,
            statusVote : statusVote
          }
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

export const createACommentChildren = (data) => {
  const url = `${process.env.API}/api/create-comment`;
  return dispatch => {
    let promise = new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: url,
        data: data,
        headers : { Authorization: `Bearer ${getCookie('access_token',null)}` }
      }) .then( res => {
        dispatch({
          type: 'CREATE_A_COMMENT_CHILDREN',
          payload:  res.data
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

export const deleteAComment = (data)=> {
  const url = `${process.env.API}/api/delete-a-comment`;
  return dispatch => {
    let promise = new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: url,
        data: data,
        headers : { Authorization: `Bearer ${getCookie('access_token',null)}` }
      }) .then( res => {
        dispatch({
          type: 'DELETE_A_COMMENT',
          payload:  res.data
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