import { BellFilled , UserOutlined ,HeartOutlined,CheckOutlined,DeleteOutlined ,
  FileProtectOutlined,PieChartOutlined,UndoOutlined,EllipsisOutlined,LogoutOutlined,TeamOutlined ,SnippetsOutlined ,ContainerOutlined  ,CommentOutlined} from "@ant-design/icons"
import Logo from "../static/images/codetrainee.png"
import { Menu , Empty,Popover,Avatar ,Button , Modal,Badge} from 'antd';
import Link from 'next/link'
import axios from "axios"
import Router from "next/router"
import { openNotificationWithIcon } from "../components/Notification"
import { connect } from "react-redux"
import { useEffect ,useState } from "react"
import  moment from "moment"
import classnames from "classnames"
import  { displayLogin ,signOut } from "../store/auth/action"
import Login from "../components/Login"
import Register from "../components/Register"
import  { isEmptyObject} from "../helpers/utils"
const CONSTANTS = require("../utils/constants")


const Header = (props) => {

  const [listNoti , setListNoti] = useState([])
  const [notRead , setNotRead] = useState(0)

  useEffect(()=>{
     fetchData()
  },[])

  const fetchData = async ()=>{
    if(isEmptyObject(props.userInfo)) {
      return ;
    }
    let url = `${process.env.API}/api/get-most-notification/${props.userInfo['id']}`
    let resData = await axios.get(url)
    if(resData.data.success) {
         setListNoti(resData.data.data.listNoti)
         setNotRead(resData.data.data.notRead);
    }
    else {
      openNotificationWithIcon('error','','Load Data Fail!');
    }
    return;
  }

  const hanleSignOut = async ()=> {
    let url = `${process.env.API}/signout`
    let res = await  axios({
      method: 'get',
      withCredentials : true,
      url: url,
      //headers : { Authorization: `Bearer ${accessToken}` }
    }) 
    if(res.data.success) {
      props.signOut()
      Router.push('/')
    }
    else {
      openNotificationWithIcon('error','','The system has encountered an error!')
    }

    return ;
  }
  const text = 
    <span style={{padding : "10px 0px", display : "inline-block"}}>
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
              <Link href="/list" as={`/list`}>
               <a href="">My List</a>
              </Link>
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
              <Link href="/exercise-list" as={`/exercise-list`}>
               <a href="">My Created Exercise</a>
              </Link>
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
          
            {/* <li> <UndoOutlined style={{color : "#ffdf00" ,fontSize :"20px"}} className="icon_prover_header"/> Change Password</li> */}
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

  const text2 = <h1 className="title_noti">Notifications</h1>;
  const contentAtionComment = (isRead,notiId)=>{
    return(
      <div className="action_comment" style={{width:"150px"}}>
        <div style={{display:"flex"}}>
         <CheckOutlined style={{position:"relative", top:"8px",height:"fit-content",fontSize:"18px"}}/>
         <p onClick= {()=> markAsRead(notiId,isRead)}> {isRead ? 'Mark As Read' : 'Mark As Don\'t Read'} </p>
         </div>
         <div style={{display:"flex"}}>
         <DeleteOutlined style={{position:"relative", top:"8px",height:"fit-content",fontSize:"18px"}} />
          <p onClick = {()=>removeNoti(notiId)}>Remove </p>
          </div>
    </div>
    )
  }

  const markAsRead = async (notiId, isRead)=> {
     let url = `${process.env.API}/api/mark-as-read`
     let data = {
      notificationId : notiId,
      isRead : isRead,
      userId : props.userInfo['id'] ? props.userInfo['id']:null
     }

     let resResult = await axios.post(url,data);
     if(resResult.data.success) {
        if(isRead) {
          if(notRead > 0) setNotRead(notRead -1);
        }
        else 
          setNotRead(notRead +1)
       let tmp = [...listNoti];
       tmp.forEach(element => {
         if(element['id'] == notiId){
           element['isRead'] = isRead
         }
       });
       setListNoti(tmp);
     }
     else {
      openNotificationWithIcon('error','','Sorry, an error occured')
     }
  }

  const removeNoti = async ( notiId)=> {
    let url = `${process.env.API}/api/remove-notification`
    let data = {
      notificationId : notiId,
      userId : props.userInfo['id'] ? props.userInfo['id']:null
    }

    let resResult = await axios.post(url,data);
    if(resResult.data.success) {
      let tmp = [...listNoti];
      let tmpArray = tmp.filter(element => {
        return element['id'] != notiId
      });
      setListNoti(tmpArray);
    }
    else {
      openNotificationWithIcon('error','','Sorry, an error occured')
     }
  }
  
  const content = (
    <div>
      <div className="noti-content">
         {listNoti.length > 0 ? listNoti.map((value,index)=> (
           <div className="noti_wrapper">
            <div className = {classnames('item_noti', value.isRead ? 'item-noti-readed':'')}
             key={index} onClick = {()=> { markAsRead(value['id'],!value.isRead);Router.push(value['linkAction'])}}
             >
              <div className="item_left">
                <CommentOutlined />
              </div>
              <div className="item_right">
                    <div className="notification-main-content" dangerouslySetInnerHTML = {{__html : value['content']}}>
                    
                    </div>
                    <div className="time_comemnt">
                      <span>{moment(value.createdAt).fromNow()}</span>
    
                    </div>
                 
              </div>
           </div>
           <div className="layer_2">
           <div style={{ position: 'relative' }} id= {`area_${index}`}>
           <Popover placement="bottomRight" 
                    title={''} 
                    trigger="['click']"
                    content={()=>contentAtionComment(!value.isRead,value.id)} 
                    getPopupContainer={() => document.getElementById(`area_${index}`)}
            >
             <EllipsisOutlined />
           </Popover>
           </div>
           </div>
           </div>
         )) : <Empty/>}
     
      </div>
      <div className="noti-footer">
       <Link href="/notification">
        <a>See all notifications</a>
        </Link>
      </div>
    </div>
  );
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
           <div className="header-right" style= {{ display : props.isAuthenticated ? 'flex' : 'none'}}>
              <div className="header-ring">
              <div style={{ position: 'relative' }} id="area_noti">
               
                <Popover placement="bottomRight" 
                  title={text2} content={content} 
                  trigger="click"  
                  overlayClassName="popover_noti"
                  getPopupContainer={() => document.getElementById('area_noti')}
                  >
                  <Badge count={notRead}>
                   <BellFilled/>
                   </Badge>
                </Popover>
                </div>
              </div>
              <div className="header-user">
                 <Popover placement="bottomRight" title={text} content={props.userInfo && props.userInfo.role ? renderProverForRole(props.userInfo.role['id']): []} trigger="click" className="header_proper">
                    <UserOutlined/>
                  </Popover>
                
              </div>
           </div>
      
            <div className="header-right" style= {{ display : props.isAuthenticated ? 'none' : 'flex'}}>
               <Button className ="header_button" onClick={()=>props.displayLogin(true,1)}>Sign In</Button>
               <Button className ="header_button" onClick={()=>props.displayLogin(true,2)}>Sign Up</Button>
               <Modal
                  style={{ top: 20 }}
                  closable = {false}
                  visible={props.isShowLogin.isShow}
                  footer = {null}
                  onOk={()=> props.displayLogin(false,1)}
                  onCancel={()=> props.displayLogin(false,1)}
                  wrapClassName = 'login-modal'
                  className="my-modal-class"
                >
                  {
                    props.isShowLogin.type == 1 ?   <Login  type = "1"></Login>
                    : <Register type = "2" ></Register>
                  }
               
                </Modal>
            </div> 
        </div>
      </div>

    </div>
  )
}

function mapStateToProps(state, ownProps) {
  return {
    userInfo : state.auth.userInfo,
    isAuthenticated : state.auth.isAuthenticated,
    isShowLogin : state.auth.isShowLogin
  }
}

export default connect(mapStateToProps, {displayLogin,signOut})(Header)