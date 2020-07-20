import { DislikeOutlined , LikeOutlined   } from "@ant-design/icons"
import Link from 'next/link'
import Router ,{ useRouter }  from 'next/router'
const CommentListItem = (props)=> {
  return (
    <div className = "topic-item-wrap">
      <div className = "topic-item">
         <a className ="topic-info">
         <img src = {`${props.comment.senderId && props.comment.senderId.imageLink ? props.comment.senderId && props.comment.senderId.imageLink :'https://kenh14cdn.com/thumb_w/660/2020/7/1/61761189841195959583257769583587400876032n-15654119651891681651462-15936075639921955008682.jpg'} `} />
         </a>
      </div>
      <div className = "title-wrapper">
         <div className = "item-header">
            <Link href="/exercise/[exerciseId]/[discussId]" as={`/exercise/${props.comment.exerciseId}/discuss_${props.comment.id}`}>
             <a className = "title-link"> 
               {props.comment.title}
             </a>
             </Link>
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
  )
}

export default CommentListItem;