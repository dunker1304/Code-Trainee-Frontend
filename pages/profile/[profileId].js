import  { ContactsOutlined ,PhoneOutlined , EnvironmentOutlined  ,ScheduleOutlined ,SketchOutlined,EditOutlined } from '@ant-design/icons'
import { Menu, Empty  } from "antd"
import CalendarHeatmap from 'react-calendar-heatmap';
import { Table, Tag, Button , Drawer, Form, Col, Row, Input,DatePicker,Tooltip} from 'antd';
import ReactTooltip from 'react-tooltip';
import axios from "axios"
import { useEffect,useState } from "react"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import composedAuthHOC from 'hocs';
import moment from "moment"
import { disabledDate } from "../../helpers/utils"
import { openNotificationWithIcon } from "../../components/Notification"
import Link from "next/link"
import classnames from "classnames"
const Profile = (props)=> {

  const [visible, setVisible] = useState(false)
  const [editUsername , setEditUsername] = useState('')
  const [editEmail , setEditEmail] = useState('')
  const [editDisplayName , setEditDisplayName] = useState('')
  const [editPhone , setEditPhone] = useState('')
  const [editDOB , setEditDOB] = useState('')
  const [isChange , setIsChange] = useState(false)
  const formatDate = 'DD/MM/YYYY'
  const today = new Date();
  const columns = [
    {
      title: 'No.',
      dataIndex: 'index',
      key: 'index',
      },
    {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text,record) => <Link  href={{pathname : '/playground', query : { questionID : record['exerciseId']} }} as={`/playground?questionID=${record['exerciseId'] }`}>
      <Tooltip title='View detail exercise'>
      <span className="link_title" >{text}</span>
      </Tooltip>
      </Link>,
    },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'language',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text,record) => <Link href="/submission/[submissionId]" as={`/submission/${record['id']}`} >
        <Tooltip title='View detail submission'>
         <span  className = {classnames('status-submisson',record.status == 'Accepted' ? 'status-success':'status-wrong')} >{text}</span>
         </Tooltip>
        </Link>,
    }
  
  ]
  
 const shiftDate = (date, numDays)=> {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
 }

 const showDrawer = () => {
  setVisible(true)
};

const onClose = () => {
  setVisible(false)
};

const submitEditAccount = async ()=> {
  let data = {
    userId : props.profile['id'],
    phone : editPhone ,
    dateOfBirth : editDOB,
    displayName : editDisplayName,
    role : 4,
    key : 'self-edit'
  }
 
  let urlUser = `${process.env.API}/api/admin/edit-an-account`
  const resUser = await axios.post(urlUser,data)
  if(resUser.data.success) {
   
    openNotificationWithIcon('success', '', 'Change information Successfully!')
    onClose()
    window.location.reload();
  }
  else {
    openNotificationWithIcon('error', '', resUser.data.message ?  resUser.data.message : 'Change information fail!')
  }

}


useEffect(()=>{ 
 if(!props.fetchDataRes.success){
   openNotificationWithIcon('error','',props.fetchDataRes.message ? props.fetchDataRes.message :'Load Data Fail!' )
 }
 else {
  setEditEmail(props.profile['email'])
  setEditUsername(props.profile['username'])
  setEditPhone(props.profile['phone'])
  setEditDisplayName(props.profile['displayName'])
  setEditDOB( props.profile['dateOfBirth'] ? moment(props.profile['dateOfBirth']).format(formatDate) : null)
 }
},[])

  return (
    <div>
    <Header/>
    <div className="container container-content profile-container">
      <div className = "main-content-profile row" style={{display : !props.fetchDataRes.success ? 'none':'flex'}}>
        <div className = "cv-left col-md-3 col-sm-12 white">
          <div className="user-info">
            <div className="user-avatar">
               <img src ={props.profile.imageLink}/>
            </div>
            <span className="user-display-name">
              {props.profile.displayName}
            </span>
            <span className = "user-point">
              Points : {props.profile && props.profile.points ? props.profile.points : 0} <SketchOutlined className = "customer-icon"/>
            </span>

          </div>
          <div className="break-line">
             <div className="separator-op"></div>
          </div>
          <div className="information">
            <div style={{display : "flex" , justifyContent:"space-between"}}>
            <h3>Information </h3>
            <Tooltip title={'Change your information'}>
            <EditOutlined style={{cursor : "pointer"}} onClick={()=> showDrawer()}/>
            </Tooltip>
            </div>
              <Menu mode="vertical-right">
                <Menu.Item key="exercises">
  <span> <ContactsOutlined className = "customer-icon"/> {props.profile.email}</span>
                </Menu.Item>
                <Menu.Item key="profile">
                  <span> <PhoneOutlined className = "customer-icon"/> {editPhone ? editPhone :"-" } </span>
                </Menu.Item>
                {/* <Menu.Item key="address">
                  <span ><EnvironmentOutlined className = "customer-icon" /> {props.profile.address ? props.profile.address :"-" } </span>
                </Menu.Item> */}
                <Menu.Item key="dob">
                  <span ><ScheduleOutlined className = "customer-icon"/> {editDOB ? editDOB :"12 - 01 - 1998" } </span>
                </Menu.Item>
              </Menu>

              <Drawer
        title="Change Your Information"
        width={520}
        onClose={()=>onClose()}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              Cancel
                      </Button>
            <Button  type="primary" onClick={submitEditAccount} disabled = {!isChange}>
              Submit
                      </Button>
          </div>
        }
      >
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true, message: 'Please enter user name' }]}
              > <Input   value={editUsername}  disabled/>              
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>

            <Col span={16}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: 'Please enter email' }]}
              > <Input   value={editEmail} disabled />
                
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="displayName"
                label="Display Name"
                rules={[{ required: true, message: 'Please enter your display name' }]}
              > <Input placeholder="Please enter your display name" value={editDisplayName} onChange= {(e)=> {setIsChange(true) ;setEditDisplayName(e.target.value)}}/>

              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="dob"
                label="DOB"
              > {
                editDOB ?   <DatePicker value = {moment(editDOB, formatDate) } format={formatDate} allowClear = {false} onChange={(date,dateString)=> setEditDOB(dateString)} disabledDate = { disabledDate} /> :
                <DatePicker  format={formatDate} allowClear = {false}onChange={(date,dateString)=> { setIsChange(true) ; setEditDOB(dateString) }}  disabledDate = { disabledDate}/> 
              }
            
            

              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="phone"
                label="Phone"
              > <Input placeholder="Please enter phone" value={editPhone}  onChange= {(e)=> {setIsChange(true) ;setEditPhone(e.target.value)}}/>
              </Form.Item>
            </Col>
          </Row>
              
        </Form>
      </Drawer>
          </div>
         
         
        </div>  {/*  end cv-left*/}
        <div className = "cv-right col-md-9 col-sm-12">
          <div className="heap-map-activity">
          <div className = "cus-heap-map">

        
          <CalendarHeatmap
              startDate={shiftDate(today, -270)}
              endDate={today}
              values={props.listActivity}
              className="code-activity"
              classForValue={value => {
                if (!value) {
                  return 'color-empty';
                }
                return `color-github-${value.count}`;
              }}
              tooltipDataAttrs={value => {
                return {
                  'data-tip': `${new Date(value.date).toLocaleDateString()} has submisions: ${
                    value.count
                  }`,
                };
              }}
              showWeekdayLabels={true}
            //  onClick={value => alert(`Clicked on value with count: ${randomValues.length}`)}
          />
          <ReactTooltip/>

          </div>
          </div>
          <div className="last-submmition">
            <h3 className="title">Most recent submissions</h3>
            <Table rowKey='index' columns={columns} dataSource={props.listSubmisions} pagination={false}/>
          </div>
        </div>
      </div>
      
      <div  className = "main-content-profile row" style={{display : props.fetchDataRes.success ? 'none':'block'}}>
        <div style={{margin : "0 auto"}} >
           <Empty/>
        </div>
        
      </div>
    </div>
    <Footer/>
    </div>
  )
}

Profile.getInitialProps = async (ctx) => {
  const { store: { dispatch }, pathname, req, res ,query} = ctx

   //get user info
   let userId = query.profileId ? query.profileId : null;
   let url = `${process.env.API}/api/profile/${userId}`
   const userRes = await axios.get(url)

   //get- most recent submitssion
   let urlMostSubmit = `${process.env.API}/api/get-most-recent-sub/${userId}`
   const submiss = await axios.get(urlMostSubmit)

   //get activity submit
   let urlActivity = `${process.env.API}/api/get-activity-calendar/${userId}`
   const activity = await axios.get(urlActivity)
   return { profile: userRes.data.data , listSubmisions :submiss.data.data, listActivity: activity.data.data ,fetchDataRes: userRes.data }

}



export default composedAuthHOC(Profile);