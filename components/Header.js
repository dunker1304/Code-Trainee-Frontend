import { BellFilled , UserOutlined ,HeartOutlined,
  FileProtectOutlined,PieChartOutlined,UndoOutlined,LogoutOutlined,TeamOutlined ,SnippetsOutlined ,ContainerOutlined  } from "@ant-design/icons"
import Logo from "../static/images/codetrainee.png"
import { Menu , Dropdown,Popover,Avatar} from 'antd';
import Link from 'next/link'
import axios from "axios"
import Router from "next/router"
import { openNotificationWithIcon } from "../components/Notification"
import { connect } from "react-redux"
const CONSTANTS = require("../utils/constants")

const Header = (props) => {

  const hanleSignOut = async ()=> {
    let url = `${process.env.API}/signout`
    let res = await  axios({
      method: 'get',
      withCredentials : true,
      url: url,
      //headers : { Authorization: `Bearer ${accessToken}` }
    }) 
    if(res.data.success) {
      Router.push('/')
    }
    else {
      openNotificationWithIcon('error','','The system has encountered an error!')
    }

    return ;
  }
  const text = 
    <span>
       <Avatar size="small" icon={<UserOutlined />} /><b className="user_name">{props.userInfo ? props.userInfo['displayName']: ''}</b>
    </span>;



  const renderNavForRole = (roleId) => {
     switch(roleId) {
       case CONSTANTS.ROLE.ROLE_STUDENT: 
          return (
            <Menu mode="horizontal">
            <Menu.Item key="exercises">
               <Link href="/problem" as="/problem">
                <a href="">Exercises</a>
              </Link>
            </Menu.Item>
            <Menu.Item key="profile">
              <Link href="/profile/[profileId]" as={`/profile/${props.userInfo ? props.userInfo['id']: 7}`}>
               <a href="">My Profile</a>
              </Link>
            </Menu.Item>
            <Menu.Item key="forum">
              <a href="">Forum</a>
            </Menu.Item>
          </Menu>
          )
        case CONSTANTS.ROLE.ROLE_ADMIN : 
           return (
            <Menu mode="horizontal">
            <Menu.Item key="exercises">
               <Link href="/admin/accounts" as="/admin/accounts">
                <a href="">Accounts</a>
              </Link>
            </Menu.Item>
            <Menu.Item key="profile">
              <Link href="/admin/approve-exercise" as="/admin/approve-exercise">
               <a href="">Exercises</a>
              </Link> 
            </Menu.Item>
          </Menu>
           ) 
         case  CONSTANTS.ROLE.ROLE_TEACHER:
           return (
            <Menu mode="horizontal">
            <Menu.Item key="exercises">
               <Link href="/problem" as="/problem">
                <a href="">Exercises</a>
              </Link>
            </Menu.Item>
            <Menu.Item key="profile">
              <Link href="/profile/[profileId]" as={`/profile/${props.userInfo ? props.userInfo['id']: 7}`}>
               <a href="">My Profile</a>
              </Link>
            </Menu.Item>
            <Menu.Item key="forum">
              <a href="">Forum</a>
            </Menu.Item>
          </Menu>
           )
     }
  }

  const renderProverForRole = (roleId) => {
    switch(roleId) {
      case CONSTANTS.ROLE.ROLE_STUDENT: 
         return (
          <ul className = "prover_ul">
          <Link href="/list" as="/list">
               <li>
               <HeartOutlined style={{color : "#d05451",fontSize :"20px"}} className="icon_prover_header"/>My List
               </li>
          </Link>
          <Link href="/profile/[profileId]" as={`/profile/${props.userInfo ? props.userInfo['id'] : 7 }`}>
            <li>
              <FileProtectOutlined style={{color : "#1da09c" ,fontSize :"20px"}} className="icon_prover_header"/> My Profile
            </li>
          </Link> 
          <Link href="/processes" as="/processes" >
            <li>
              <PieChartOutlined style={{color : "#8365cd" ,fontSize :"20px"}} className="icon_prover_header"/>My Process
            </li>
          </Link>  
          <li> <UndoOutlined style={{color : "#ffdf00" ,fontSize :"20px"}} className="icon_prover_header"/> Change Password</li>
          <li  onClick= {()=>hanleSignOut()} > <LogoutOutlined style={{color : "#fea116",fontSize :"20px"}} className="icon_prover_header"/> Sign out</li>
        </ul>
         )
       case CONSTANTS.ROLE.ROLE_ADMIN : 
          return (
            <ul className = "prover_ul">
            <Link href="/list" as="/list">
                 <li>
                  <TeamOutlined style={{color : "#d05451",fontSize :"20px"}} className="icon_prover_header"/>Accounts 
                 </li>
            </Link>
            <Link href="/admin/approve-exercise" as="/admin/approve-exercise">
              <li>
                <SnippetsOutlined style={{color : "#1da09c" ,fontSize :"20px"}} className="icon_prover_header"/> Exercises 
              </li>
            </Link> 
           
            <li> <UndoOutlined style={{color : "#ffdf00" ,fontSize :"20px"}} className="icon_prover_header"/> Change Password</li>
            <li  onClick= {()=>hanleSignOut()} > <LogoutOutlined style={{color : "#fea116",fontSize :"20px"}} className="icon_prover_header"/> Sign out</li>
          </ul>
          ) 
        case  CONSTANTS.ROLE.ROLE_TEACHER:
          return (
            <ul className = "prover_ul">
            <Link href="/list" as="/list">
                 <li>
                 <HeartOutlined style={{color : "#d05451",fontSize :"20px"}} className="icon_prover_header"/>My List
                 </li>
            </Link>
            <Link href="/profile/[profileId]" as={`/profile/${props.userInfo ? props.userInfo['id'] : 7}`}>
              <li>
                <FileProtectOutlined style={{color : "#1da09c" ,fontSize :"20px"}} className="icon_prover_header"/> My Profile
              </li>
            </Link> 
            <Link href="/processes" as="/processes" >
              <li>
                <PieChartOutlined style={{color : "#8365cd" ,fontSize :"20px"}} className="icon_prover_header"/>My Process
              </li>
            </Link>  
            <Link href="/exercise-list" as="/exercise-list" >
              <li>
                <ContainerOutlined style={{color : "#8365cd" ,fontSize :"20px"}} className="icon_prover_header"/>My Created Exercises
              </li>
            </Link>  
            <li> <UndoOutlined style={{color : "#ffdf00" ,fontSize :"20px"}} className="icon_prover_header"/> Change Password</li>
            <li  onClick= {()=>hanleSignOut()} > <LogoutOutlined style={{color : "#fea116",fontSize :"20px"}} className="icon_prover_header"/> Sign out</li>
          </ul>
          )
    }
  }



  return (
    <div className="coding-header">
      <div className="container header-content">
        <div className="coding-logo">
           <img src = {Logo} style={{height : "30px"}}/>
        </div>
        <div className="conding-header-nav">
           <div className="header-left">
                {props.userInfo && props.userInfo.role ? renderNavForRole(props.userInfo.role['id']) : ''}
           </div>
           <div className="header-right">
              <div className="header-ring">
                <BellFilled/>
              </div>
              <div className="header-user">
                 <Popover placement="bottomRight" title={text} content={props.userInfo && props.userInfo.role ? renderProverForRole(props.userInfo.role['id']): []} trigger="click" className="header_proper">
                    <UserOutlined/>
                  </Popover>
                
              </div>
           </div>
        </div>
      </div>

    </div>
  )
}

function mapStateToProps(state, ownProps) {
  return {
    userInfo : state.auth.userInfo
  }
}

export default connect(mapStateToProps,null)(Header)