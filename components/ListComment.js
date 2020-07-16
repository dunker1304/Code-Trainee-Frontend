import { Button ,Pagination, Empty} from "antd";
import CommentListItem from "../components/CommentListItem"
import CommentInput from "../components/CommentInput"
import React, { useState } from 'react';
import { connect } from 'react-redux'
import { getDiscussByQuestionId } from "../store/discuss/action";
const ListComment = (props) => {
  const [isShow, setIsShow] = useState(false);
  const [filterBy , setFilterBy ] = useState(0) /* 0 : DESC - 1 : ASC */
  const [currentPage , setCurrentPage ] = useState(1)

  const handelClickShow = ()=> {
        setIsShow(!isShow)
  }

  const handleClickFilter = (value)=> {
       setFilterBy(value)
       console.log(props)
       let exerciseId = props.questionId;
       let page = currentPage;
       let sortBy = value
       props.getDiscussByQuestionId(exerciseId,page,sortBy)
  }

  const pagingQuestion = (currentPage,pageSize)=> {
      let exerciseId = props.questionId;
      setCurrentPage(currentPage);
      props.getDiscussByQuestionId(exerciseId,currentPage,filterBy)

  }
  
  return (
    <div className = "discuss-container">
      <div className = "topic-container">
        <div className = "header-wrapper">
          <a className = "link_title">
            <div className = "title-wrapper">
                {props.question.title}
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

          { props.discuss.length > 0 ?
            props.discuss.map((value,key) => (
              <CommentListItem key= {value['id']} comment={value}/>
            )) : <Empty/>
          }
           {
             props.discuss.length > 0 ? 
             <div className="topic-item-wrap" style={{textAlign:"center"}}>
                <Pagination
                defaultCurrent={currentPage}
                current= {currentPage}
                total={props.totalDiscuss}
                showSizeChanger={false}
                pageSize={2}
                defaultPageSize={2}
                onChange= {(pageNumber,pageSize)=> {pagingQuestion(pageNumber,pageSize)}}
                />
            </div>
               :''
           }

        </div>
      </div>

     <CommentInput handelClickShow= {()=> handelClickShow()} isShow = {isShow} questionId = {props.questionId}/>
    </div>
  )
}



export default connect(null, {getDiscussByQuestionId})(ListComment);