import Header from "../../components/Header"
import composedAuthHOC from 'hocs';
import AceEditor from 'react-ace'
import Footer from "../../components/Footer"
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import axios from "axios"
import { Empty } from "antd"
import Link from "next/link"

const SubmissionDetail = (props)=> {
  return (
    <div>
    <Header/>
    <div className="submit_wrapper">
      <div className="container-content container" style={{display : props.submission ? 'block' : 'none'}}>
        <div className="row">
          <div className="col-md-12">
            <h4 className="inline-wrap_title" >
            <Link href={{pathname : '/playground', query : { questionID : props.submission.exercise ? props.submission.exercise['id']:1}}} as={`/playground?questionID=${props.submission.exercise ?props.submission.exercise['id']:1 }`}>
               <a className="inline-wrap" >
                  {props.submission.exercise ? props.submission.exercise['title'] : ''}
               </a>
               </Link>
  {/* <a className="inline-wrap" href="/problems/additive-number/">{props.submission ?props.submission.exercise.title : '' }</a> */}
            </h4>
          </div>
          <div className="col-md-12 submision_detail">
              <h3 className="title">Submitted Codes in Detail</h3>
              <div className="wa_status">
                 <div className="status_detail">
                    <span>Status:</span> 
                    <h4>{props.submission ? props.submission.status : ''}</h4>
                 </div>
                 <div className="status_time">
                    <span>Submitted:</span> 
                    <strong>
                      <span className ="time_sub">{props.submission ? props.submission.createdAt : ''}</span>
                    </strong>
                 </div>
              </div>
          </div>
          <div className="col-md-12 submision_code">
               <h4>Submitted Code:
                      <span >{props.submission ? props.submission.createdAt : ''}</span>
               </h4>
               <div className = "language">
                 <span>Language : </span>
                 <span>{props.submission ? props.submission.language.name : ''}</span>
               </div>
               <div className="sub_code">
                   <AceEditor
                    mode="java"
                    theme="github"
                    name="UNIQUE_ID_OF_DIV"
                    editorProps={{ $blockScrolling: true }}
                    style={{width:"100%"}}
                    value = {props.submission ? props.submission.answer : ''}
                  />,
               </div>
          </div>
        </div>

      </div>
      <div className="container-content container" style={{display : !props.submission ? 'block' : 'none'}}>
         <Empty/>
      </div>
    <Footer/>
    </div>
    </div>
  )
}

SubmissionDetail.getInitialProps = async (ctx) => {
  let id = ctx.query.submissionId
  let urlExercise = `${process.env.API}/api/submission/${id}`
  const subRes = await axios.get(urlExercise)
  
  return {  submission : subRes.data.data}
}



export default composedAuthHOC(SubmissionDetail);