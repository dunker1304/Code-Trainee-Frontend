import { DislikeFilled , LikeFilled ,DeleteFilled, LikeOutlined, DislikeOutlined   } from "@ant-design/icons"
import hljs from 'highlight.js';
import { Modal, Button, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useState } from 'react';  
import moment from "moment"
var md = require('markdown-it')({html: false , highlight : function (str, lang) {
     try {
      return hljs.highlightAuto(str).value 
     } catch (__) {}

    return ''; 
 
 }});

const markDown = (value)=> {
  return {__html : md.render(value)}
}
const { confirm } = Modal;

const CommentDetailItem = (props)=> {

  const handleVoteComment = async (statusVote)=> {
    let commentId = props.discussDetail['id']
    await props.voteAComment(commentId,statusVote);
  } 

  const handleDeleteAcomment = async ()=> {
    let commentId = props.discussDetail['id'] 
    let data = { commentId : commentId }
    await props.deleteAComment(data)
  }

  const showConfirm = () => {
    confirm({
      title: 'Do you Want to delete these comment?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk() {
        handleDeleteAcomment()
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  return (
    <div className="inner_content">
    <div className="author_post">
         <img src = {props.discussDetail.senderId.imageLink ? props.discussDetail.senderId.imageLink :"https://kenh14cdn.com/zoom/460_289/2020/6/26/landscape-avatar-1593167946440982942769-crop-15931679693791808157553.png"} className = "__avatar"/>
         <div className = "user_info">{props.discussDetail.senderId.displayName}</div>
         <div className="post_info">
             <div className ="action_vote">
                <span >{props.discussDetail.like} {props.discussDetail.statusVote == 1 ? <LikeFilled onClick= {()=> handleVoteComment(0)}/> : <LikeOutlined onClick= {()=> handleVoteComment(1)}/>}</span>
                <span >{props.discussDetail.dislike} {props.discussDetail.statusVote == -1 ? <DislikeFilled onClick= {()=> handleVoteComment(0)}/> :<DislikeOutlined onClick= {()=> handleVoteComment(-1)}/>}</span>
             </div>
          
             <div className = "time_created">{moment(props.discussDetail.createdAt).fromNow()}</div>
            <div className = "action_comment">
               {props.discussDetail.isYourComment ? <span> <DeleteFilled onClick= {()=>showConfirm()}/> Delete </span> : ''}
            </div>
         </div>
    </div>
    <div className="content_area" dangerouslySetInnerHTML={ markDown(props.discussDetail.content)} >
      
    </div>

  </div>
  )
}

export default CommentDetailItem ;