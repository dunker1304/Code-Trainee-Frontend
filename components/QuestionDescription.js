import React, { useEffect, useState } from 'react'
const QuestionDescription = props => {
  useEffect(() => {
    document.getElementsByClassName('question-description')[0].innerHTML = props.question.content
  })
  return (
    <div className="question-desc-wrapper">
      <h4 className='question-title'>Title: {props.question.title}</h4>
      <div className='question-info'>
        <div className='question-level'>{props.question.level}</div>
        <div className='question-point'>{props.question.points}</div>
        <button className='question-reaction'>
          <svg viewBox="0 0 24 24" width="1em" height="1em"><path fillRule="evenodd" d="M7 19v-8H4v8h3zM7 9c0-.55.22-1.05.58-1.41L14.17 1l1.06 1.05c.27.27.44.65.44 1.06l-.03.32L14.69 8H21c1.1 0 2 .9 2 2v2c0 .26-.05.5-.14.73l-3.02 7.05C19.54 20.5 18.83 21 18 21H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h3zm2 0v10h9l3-7v-2h-9l1.34-5.34L9 9z"></path></svg>
          {props.question.like}
        </button>
        <button className='question-reaction'>
          <svg viewBox="0 0 24 24" width="1em" height="1em"><path fillRule="evenodd" d="M17 3v12c0 .55-.22 1.05-.58 1.41L9.83 23l-1.06-1.05c-.27-.27-.44-.65-.44-1.06l.03-.32.95-4.57H3c-1.1 0-2-.9-2-2v-2c0-.26.05-.5.14-.73l3.02-7.05C4.46 3.5 5.17 3 6 3h11zm-2 12V5H6l-3 7v2h9l-1.34 5.34L15 15zm2-2h3V5h-3V3h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3v-2z"></path></svg>
          {props.question.dislike}
        </button>
      </div>
      <div className="question-description">
        {props.question.content}
      </div>
    </div>
  )
}

export default QuestionDescription