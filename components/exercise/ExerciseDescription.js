import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { DislikeFilled , LikeFilled ,DeleteFilled, LikeOutlined, DislikeOutlined   } from "@ant-design/icons";

const QuestionDescription = props => {
  useEffect(() => {
    document.getElementsByClassName('question-description')[0].innerHTML = props.question.content
  })

  const [status, setStatus] = useState(props.exerciseVote?.statusVote || 0)
  const [like, setLike] = useState(props.question.like)
  const [dislike, setDislike] = useState(props.question.dislike)

  const handleLikeQuestion = () => {
    console.log(props.userInfo)
    if (props.userInfo.id) {
      let data = {
        userID: props.userInfo.id,
        exerciseID: props.question.id,
        status: 'like'
      }
      axios.post(`${process.env.API}/api/exercise/react`, data)
        .then(res => {
          console.log(res.data, 'dunker DNDz')
          setStatus(res.data.resultVote.statusVote)
          setLike(res.data.updatedExercise.like)
          setDislike(res.data.updatedExercise.dislike)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  const handleDislikeQuestion = () => {
    if (props.userInfo.id) {
      let data = {
        userID: props.userInfo.id,
        exerciseID: props.question.id,
        status: 'dislike'
      }
      axios.post(`${process.env.API}/api/exercise/react`, data)
        .then(res => {
          console.log(res.data, 'dunker dislike')
          setStatus(res.data.resultVote.statusVote)
          setLike(res.data.updatedExercise.like)
          setDislike(res.data.updatedExercise.dislike)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  return (
    <div className="question-desc-wrapper">
      <h4 className='question-title'>Title: {props.question.title}</h4>
      <div className='question-info'>
        <div className='question-level'>{props.question.level}</div>
        <button className='question-reaction' onClick={handleLikeQuestion}>
          {status == 1 ? (<LikeFilled></LikeFilled>) : (<LikeOutlined></LikeOutlined>)}
          <span>{like}</span>
        </button>
        <button className='question-reaction' onClick={handleDislikeQuestion}>
          {status == -1 ? (<DislikeFilled></DislikeFilled>) : (<DislikeOutlined></DislikeOutlined>)}
          <span>{dislike}</span>
        </button>
        <div className='question-point'>LOC: {props.question.points}</div>
      </div>
      <div className="question-description">
        {props.question.content}
      </div>
    </div>
  )
}

QuestionDescription.getInitialProps = async function(ctx) {
  let userID = props.userInfo.id
  let questionID = props.question.id
  
  console.log(questionVote, 'quesiton Vote')
}

export default QuestionDescription