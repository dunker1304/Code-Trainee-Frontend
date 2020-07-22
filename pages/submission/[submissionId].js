import Header from "../../components/Header"
import composedAuthHOC from 'hocs';
import AceEditor from 'react-ace'
import Footer from "../../components/Footer"
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
const SubmissionDetail = (props)=> {
  return (
    <div>
    <Header/>
    <div className="submit_wrapper">
      <div className="container-content container">
        <div className="row">
          <div className="col-md-12">
            <h4 className="inline-wrap_title" >
              <a className="inline-wrap" href="/problems/additive-number/">Additive Number</a>
            </h4>
          </div>
          <div className="col-md-12 submision_detail">
              <h3 className="title">Submission Detail</h3>
              <div className="wa_status">
                 <div className="status_detail">
                    <span>Status:</span> 
                    <h4>Wrong Answer</h4>
                 </div>
                 <div className="status_time">
                    <span>Submitted:</span> 
                    <strong>
                      <span className ="time_sub">6 days, 8 hours ago</span>
                    </strong>
                 </div>
              </div>
          </div>
          <div className="col-md-12 submision_code">
               <h4>Submitted Code:
                      <span >6&nbsp;days, 8&nbsp;hours ago</span>
               </h4>
               <div className = "language">
                 <span>Language : </span>
                 <span>Java</span>
               </div>
               <div className="sub_code">
                   <AceEditor
                    mode="java"
                    theme="github"
                    name="UNIQUE_ID_OF_DIV"
                    editorProps={{ $blockScrolling: true }}
                    style={{width:"100%"}}
                  />,
               </div>
          </div>
        </div>

      </div>
    <Footer/>
    </div>
    </div>
  )
}

SubmissionDetail.getInitialProps = async (ctx) => {
 return {}
}



export default composedAuthHOC(SubmissionDetail);