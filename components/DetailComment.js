import {LeftOutlined , DislikeFilled , LikeFilled ,MessageOutlined ,DeleteFilled, LikeOutlined, DislikeOutlined   } from "@ant-design/icons"
import hljs from 'highlight.js';
import dynamic from 'next/dynamic';
import { Button } from "antd";
import React, { useState ,useEffect } from 'react';  
import {voteAComment , createACommentChildren , deleteAComment} from "../store/discuss/action"
import { connect } from 'react-redux'
import CommentDetailItem from "../components/CommentDetailItem"
import Router , {useRouter} from 'next/router'
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
   ssr: false
 });

const DetailComment = (props) => {

    const voteAComment = (commentId , statusVote)=> {
       props.voteAComment(commentId , statusVote)
    }
    const [contentCmt , setContentCmt ] = useState('')

    const handleChangeCmt = (value)=> {
      setContentCmt(value)
    }

    const submitChildrenCmt = async (e)=>{
      e.preventDefault();
      let data = {
         parentId : props.discussDetail['id'],
         content : contentCmt,
         questionId : props.discussDetail['questionId']
      }
      props.createACommentChildren(data)
      setContentCmt('')
      
    }

  return (
    <div className ="discuss-container">
       <div className="topic-container">
         <div className="title-comment">
            <div className = "button-back right-border" onClick = {()=> {Router.push('/exercise/[exerciseId]/discuss',`/exercise/${props.discussDetail['questionId']}/discuss`)}}>
               <LeftOutlined className="back_icon" /> Back
            </div>
            <div className = "___title">
               <h5 style = {{margin : "0px"}}>{props.discussDetail.title}</h5>
            </div>
         </div>
         <div className = "main_content"> 
             <CommentDetailItem 
             discussDetail={props.discussDetail} 
             voteAComment={(commentId,statusVote) => voteAComment(commentId,statusVote)} 
             deleteAComment = {(data)=> props.deleteAComment(data)}
             />
           
            <div className="editor_comment">
              <div className="editor__up">
                 <span><MessageOutlined/> Comments</span>
              </div>

              <form className="editor__down" onSubmit= {(e)=> submitChildrenCmt(e)}>
                 <div className="input_comment">
                 <SimpleMDE
                  id="your-custom-id"
                  
                  onChange={handleChangeCmt}
                  value={contentCmt}
                  options={{
                     status:false,
                     spellChecker: false,
                     renderingConfig: {
                        singleLineBreaks: false,
                        codeSyntaxHighlighting: true,
                        hljs:hljs
                     },
                  }}
                  />
                 </div>
                 <div className="input_action">
                     <Button className="post-btn" htmlType="submit" >Post</Button>

                 </div>
              </form>
            </div>
            <div className="comment_children">
                {props.discussDetail.children.map((value,index)=> (
                    <CommentDetailItem
                     key ={index} 
                     voteAComment={(commentId,statusVote) => voteAComment(commentId,statusVote)} 
                     discussDetail={value} 
                     deleteAComment = {(data)=> props.deleteAComment(data)}
                     />
                ))}
             
            </div>
         </div>
       </div>
    </div>
  )
}
function mapStateToProps(state, ownProps) {
   return {
     discussDetail : state.discuss.discussDetail,
     discuss : state.discuss.discuss
   }
 }

export default connect(mapStateToProps,{voteAComment,createACommentChildren,deleteAComment})(DetailComment) ;