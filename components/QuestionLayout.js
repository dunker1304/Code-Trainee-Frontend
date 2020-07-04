import { Row, Col, Button, Select, Tabs } from 'antd'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Router , {useRouter} from 'next/router'
import DetailComment from "../components/DetailComment"
import ListComment from "../components/ListComment"
const QuestionLayout = (props)=> {
  const { TabPane } = Tabs
  const router = useRouter()
  const [indexActive , setIndexActive] = useState("1")
  const [isDetail , setIsDetail ] = useState(false)
  const style = {
    width: router.asPath.includes('/discuss') ? '100%' : 'auto',
  }
  const handleChangeTab = (key) => {
    setIndexActive(key)
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
    <Row>
      <Col className="content-right" style= {style} >
        <Tabs defaultActiveKey= {indexActive} activeKey = {indexActive} type="card"  onChange = {handleChangeTab}>
          <TabPane tab="Description" key="1">
            Description
          </TabPane>
          <TabPane tab="Solutions" key="2">
            Solution here
          </TabPane>
          <TabPane tab="Submissions" key="3">
            Submissions here
          </TabPane>
          <TabPane tab="Discussion" key="4"  >
             {isDetail ?  <DetailComment discussDetail = {props.discussDetail} discussId={props.discussDetail['id']}/> : <ListComment questionId = {props.questionId} discuss = {props.discuss}/>}
          </TabPane>
        </Tabs>
      </Col>
    </Row>
   </>
  )
}

export default QuestionLayout