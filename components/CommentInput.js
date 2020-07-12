import { Input ,Button } from "antd"
import dynamic from 'next/dynamic';
import hljs from 'highlight.js';
import React, { useState, createElement } from 'react';
import classnames from 'classnames'
import Router , {useRouter} from 'next/router'
import axios from 'axios'
import { openNotificationWithIcon } from "../components/Notification"
import  { ERROR_MESSAGE_FROM_SERVER} from "../utils/constants"
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false
});


const CommentInput = (props) => {

  const [topic ,setTopic] = useState('')
  const [contentCmt , setContentCmt] = useState('')

  const handleTopicChange = (value)=> {
    setTopic(value)
  }

  const handleChange = (e)=> {
     setContentCmt(e)
  }

  const submitComment = async (e)=> {
    e.preventDefault();
    //get data
    let data = {
      title : topic,
      content : contentCmt,
      questionId : props.questionId
    }
    let url = `http://localhost:1337/api/create-comment`
    let res = await axios.post(url,data)

    if(res.data.success) {
        let createdCmt = res.data.data
        Router.push('/exercise/[exerciseId]/[discussId]',`/exercise/${props.questionId}/${`discuss_${createdCmt['id']}`}`)
    }
    else {
      openNotificationWithIcon('error','',ERROR_MESSAGE_FROM_SERVER[res.data.error])
    }
  }
   return (
     <div className = {classnames('page-drawer-base', !props.isShow ? 'cancel-class':'show-class')} style={{height :"72%"}}>
       <div className = "content-container">
         <form className = "topic-editor-base" onSubmit= {(e)=>submitComment(e)}>
           <div className = "editor-header">
              <div className = "editor-header-left">
                <span className = "title-input">
                  <Input placeholder ="Enter topic title ..." required value={topic} onChange={(e)=>handleTopicChange(e.target.value)}/>
                </span>
               
              </div>
              <div className ="editor-header-tool">
                 <Button className="btn__cancel" onClick = {()=> { props.handelClickShow()}}>Close</Button>
                 <Button className="btn_sb_cmt" htmlType="submit" >Post</Button>
              </div>

           </div>
            <div className = "content-input">
              <SimpleMDE
                    id="your-custom-id"
                    onChange={handleChange}
                    value = {contentCmt}
                    options={{
                     autofocus: true,
                     spellChecker: false,
                     status:false,
                     renderingConfig: {
                          singleLineBreaks: false,
                          codeSyntaxHighlighting: true,
                          hljs:hljs
                      },                   
                    }}
                />
            </div>
         </form>

       </div>
     </div>
   )
}

export default CommentInput