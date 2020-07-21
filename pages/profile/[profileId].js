import  { ContactsOutlined ,PhoneOutlined , EnvironmentOutlined  ,ScheduleOutlined ,SketchOutlined } from '@ant-design/icons'
import { Menu } from "antd"
import CalendarHeatmap from 'react-calendar-heatmap';
import { Table, Tag, Space } from 'antd';
import ReactTooltip from 'react-tooltip';
import axios from "axios"
import { useEffect } from "react"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
const Profile = (props)=> {
  const today = new Date();
  const columns = [
    {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
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
      render: text => <span className="status-submission">{text}</span>,
    }
  
  ]
  
 const shiftDate = (date, numDays)=> {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
 }

useEffect(()=>{
 console.log(props)
},[])

const randomValues = [ { date: '2020-06-20', count: 1 }, { date: '2020-07-07', count: 2 } ]
  return (
    <div>
    <Header/>
    <div className="container container-content profile-container">
      <div className = "main-content-profile row">
        <div className = "cv-left col-md-3 col-sm-12 white">
          <div className="user-info">
            <div className="user-avatar">
               <img src ={props.profile.imageLink}/>
            </div>
            <span className="user-display-name">
              {props.profile.displayName}
            </span>
            <span className = "user-point">
              Points : 3000 <SketchOutlined className = "customer-icon"/>
            </span>

          </div>
          <div className="break-line">
             <div className="separator-op"></div>
          </div>
          <div className="information">
              <h3>Information</h3>
              <Menu mode="vertical-right">
                <Menu.Item key="exercises">
  <span> <ContactsOutlined className = "customer-icon"/> {props.profile.email}</span>
                </Menu.Item>
                <Menu.Item key="profile">
                  <span> <PhoneOutlined className = "customer-icon"/> {props.profile.phone ? props.profile.phone :"-" } </span>
                </Menu.Item>
                <Menu.Item key="address">
                  <span ><EnvironmentOutlined className = "customer-icon" /> {props.profile.address ? props.profile.address :"-" } </span>
                </Menu.Item>
                <Menu.Item key="dob">
                  <span ><ScheduleOutlined className = "customer-icon"/> {props.profile.dob ? props.profile.dob :"12 - 01 - 1998" } </span>
                </Menu.Item>
              </Menu>
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
            <Table columns={columns} dataSource={props.listSubmisions} pagination={false}/>
          </div>
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
   return { profile: userRes.data.data , listSubmisions :submiss.data.data, listActivity: activity.data.data  }

}



export default Profile;