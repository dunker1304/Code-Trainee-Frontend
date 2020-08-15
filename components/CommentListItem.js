import { DislikeOutlined , LikeOutlined   } from "@ant-design/icons"
import Link from 'next/link'
import Router ,{ useRouter }  from 'next/router'
import classnames from "classnames"
const CommentListItem = (props)=> {
  return (
    <Link  href="/exercise/[exerciseId]/[discussId]" as={`/exercise/${props.comment.exerciseId}/discuss_${props.comment.id}`} >
    <div title = {!props.isAuthenticated ? 'Login to view comment detail' : ''}className = {classnames('topic-item-wrap', !props.isAuthenticated ? 'isDisabled':'')} onClick = {(e)=> { !props.isAuthenticated ? e.preventDefault(): ''}}>
      <div className = "topic-item">
         <a className ="topic-info">
         <img src = {`${props.comment.senderId && props.comment.senderId.imageLink ? props.comment.senderId && props.comment.senderId.imageLink :'https://kenh14cdn.com/thumb_w/660/2020/7/1/61761189841195959583257769583587400876032n-15654119651891681651462-15936075639921955008682.jpg'} `} />
         </a>
      </div>
      <div className = "title-wrapper">
         <div className = "item-header">
           
             <a className = "title-link"> 
               {props.comment.title}
             </a>
           
         </div>
         <div className = "topic-info">
           <span>
             <span>
               <a>{props.comment.senderId.displayName}</a> 
              <span style ={{marginLeft : "5px"}}>created at : {new Date(props.comment.createdAt).toDateString()}</span>
             </span>
             <span> | {props.comment.totalReply != 0 ? `${props.comment.totalReply} Replies`  : 'No Reply Yet.' }</span>
           </span>
         </div>
      </div>
      <div className ="action-wrapper">
           <div className="vote_action">
               <LikeOutlined/> {props.comment.like}
           </div>
           <div className="vote_action">
               <DislikeOutlined/> {props.comment.dislike}
           </div>
      </div>
    </div>
    </Link>
  )
}

export default CommentListItem;