import { Button } from "antd";
const list = [1,2,3,4,5]
import CommentListItem from "../components/CommentListItem"
import CommentInput from "../components/CommentInput"
import React, { useState } from 'react';
import { connect } from 'react-redux'
import { getDiscussByQuestionId } from "../store/discuss/action";
const ListComment = (props) => {
  const [isShow, setIsShow] = useState(false);
  const [filterBy , setFilterBy ] = useState(0) /* 0 : DESC - 1 : ASC */

  const handelClickShow = ()=> {
        setIsShow(!isShow)
  }

  const handleClickFilter = (value)=> {
       setFilterBy(value)
       console.log(props)
       let exerciseId = props.questionId;
       let page = 1;
       let sortBy = value
       props.getDiscussByQuestionId(exerciseId,page,sortBy)
  }
  
  return (
    <div className = "discuss-container">
      <div className = "topic-container">
        <div className = "header-wrapper">
          <a className = "link_title">
            <div className = "title-wrapper">
                1480. Running Sum of 1d Array
            </div>
          </a>
        </div>
        <div className ="sub_header-wrapper">
           <div className ="sub_header">
              <div  className ="sub_header_left">
                 <span onClick= {()=> handleClickFilter(0)} className = {`${filterBy == 0 ? 'filter_active' :''}`} >Newest to Oldest</span>
                 <span onClick= {()=> handleClickFilter(1)} className = {`${filterBy == 1 ? 'filter_active' :''}`} >Oldest to Newest</span>
              </div>
              <div className = "sub_header_right">
                 <Button onClick = {()=>handelClickShow()}>New + </Button>
              </div>
           </div>
        </div>
        <div className = "list-container">

          {
            props.discuss.map((value,key) => (
              <CommentListItem key= {value['id']} comment={value}/>
            ))
          }

        </div>
      </div>

     <CommentInput handelClickShow= {()=> handelClickShow()} isShow = {isShow} questionId = {props.questionId}/>
    </div>
  )
}



export default connect(null, {getDiscussByQuestionId})(ListComment);