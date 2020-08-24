import { Row, Col, Button, Select, Tabs } from 'antd'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Router , {useRouter} from 'next/router'
import DetailComment from "../components/DetailComment"
import ListComment from "../components/ListComment"
import Header from "../components/Header"
import Footer from "../components/Footer"


const QuestionLayout = (props)=> {
  const { TabPane } = Tabs
  const router = useRouter()
  const [indexActive , setIndexActive] = useState("1")
  const [isDetail , setIsDetail ] = useState(false)

  const style = {
    width: router.asPath.includes('/discuss') ? '100%' : 'auto',
  }
  const handleChangeTab = (key) => {
     Router.push(`/playground?questionID=${props.questionId}&tab=${key}`)
  }

  useEffect(() => {
     if(router.asPath.includes('/discuss')) {
       setIndexActive("4")
       if(router.query.discussId) {
          setIsDetail(true)
       }
     }
  },[]);

  return (
  <>
        <Header/>
        <div className=" container-content" style = {{width :  indexActive != 4 ? 'auto':'100%'}}>
          <Tabs defaultActiveKey= {indexActive} activeKey = {indexActive} type="card" onChange={handleChangeTab}>
            <TabPane tab="Description" key="1">
              {/* <QuestionDescription question={props.question.question}/> */}
            </TabPane>
            <TabPane tab="Submissions" key="3">
              Submissions here
            </TabPane>
            <TabPane tab="Discussions" key="4">
               <div style={{backgroundColor:"#f5f5f5"}}>
                  {isDetail ?  <DetailComment questionId = {props.questionId} discussDetail = {props.discussDetail} discussId={props.discussDetail ? props.discussDetail['id'] : null}/> : <ListComment questionId = {props.questionId} discuss = {props.discuss} totalDiscuss = {props.totalDiscuss} totalPage = {props.totalPage} question={props.question}/>}
                
                  <Footer/>
               </div>
            </TabPane>
          </Tabs>

        </div>
    </>
  )
}

export default QuestionLayout