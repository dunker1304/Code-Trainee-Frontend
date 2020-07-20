import axios from 'axios';

export const getDiscussByQuestionId = (questionId,page,sortBy)=> {
  const url = `http://localhost:1337/api/get-comment-question-id`;
  return dispatch => {
    let promise = new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: url,
        data: {questionId : questionId, page : page , sortBy : sortBy}
        //headers : { Authorization: `Bearer ${accessToken}` }
      }) .then( res => {
        console.log(res)
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

export const getDiscussByCommentId = (commentId)=> {
  const url = `http://localhost:1337/api/get-comment-comment-id`;
  return dispatch => {
    let promise = new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: url,
        data: {commentId : commentId}
        //headers : { Authorization: `Bearer ${accessToken}` }
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
  const url = `http://localhost:1337/api/create-vote-comment`;
  return dispatch => {
    let promise = new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: url,
        data: {commentId : commentId, statusVote :statusVote}
        //headers : { Authorization: `Bearer ${accessToken}` }
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
  const url = `http://localhost:1337/api/create-comment`;
  return dispatch => {
    let promise = new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: url,
        data: data
        //headers : { Authorization: `Bearer ${accessToken}` }
      }) .then( res => {
        dispatch({
          type: 'CREATE_A_COMMENT_CHILDREN',
          payload:  res.data.data
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
  const url = `http://localhost:1337/api/delete-a-comment`;
  return dispatch => {
    let promise = new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: url,
        data: data
        //headers : { Authorization: `Bearer ${accessToken}` }
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