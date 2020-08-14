import  Google  from "../../static/images/icon-google.png"
import { Modal } from "antd";
const CONSTANTS = require('../../utils/constants')
import  {openNotificationWithIcon } from "../../components/Notification"
var popupTools = require('popup-tools');
import React, { useState , useEffect} from 'react';
import {connect} from 'react-redux'
import Background from "../../static/images/background.jpg"
import composedAuthHOC from '../../hocs';
import { signIn } from "../../store/auth/action"

const Login = (props)=> {

  const [ email , setEmail ] = useState('');
  const [ password , setPassword ] = useState('');
  const [ role , setRole ] = useState(3);
  const [ username, setUsername ] = useState('');

  const changeEmail = function(value){
    setEmail(value)
  }
  const changePassword = function(value){
    setPassword(value)
  }

  const submitSignIn = function(e) {
    e.preventDefault();
   
    props.signIn(email,password, role)

  }
  useEffect(()=>{
    if(props.isAuthenticated) {
      window.location.reload();
    }

  },[props.isAuthenticated])


 return (
   <div className='login_admin_wrapper' style={{backgroundImage:"url(" + `${Background}` + ")"}}>
       <Modal
          centered = {true}
          closable = {false}
          visible={true}
          footer = {null}
          wrapClassName = 'login-modal'
          className="my-modal-class login_admin"
        >

     <div>
      <div className="tab-content">
      <div className="limiter">
        <div className="container-login100" >
          <div className="wrap-login100 ">
            {/* Login */}
            <form  onSubmit = {(e)=> submitSignIn(e)} className="login100-form validate-form" >
              <span className="login100-form-title p-b-20">
                Login Admin Account
              </span>
              <div className="p-t-20 p-b-9">
                <span className="txt1"> 
                  Username or Email
                </span>
              </div>
              <div className="wrap-input100 validate-input" data-validate="Username is required">
                <input className="input100" type="text" required name="email" onChange = {(e)=>changeEmail(e.target.value)} value={email}/>
                <span className="focus-input100" />
              </div>
              <div className="p-t-13 p-b-9">
                <span className="txt1">
                  Password
                </span>
                {/* <a href="#" className="txt2 bo1 m-l-5">
                  Forgot?
                </a> */}
              </div>
              <div className="wrap-input100 validate-input" data-validate="Password is required">
                <input className="input100" type="password"  required name="password"  onChange = {(e)=>changePassword(e.target.value)} value={password}/>
                <span className="focus-input100" />
              </div>
            
              <div className="container-login100-form-btn m-t-17">
                <button type="submit" className="login100-form-btn" >
                  Sign In
                </button>
              </div>
            </form>
            {/* End Login */}

        
          </div>
        </div>
      </div>

      </div>
    </div>
                
              
               
        </Modal>
    
   </div>
 )
}


function mapStateToProps(state,ownProps) {
  return {
    authMessage: state.auth.authMessage,
    isAuthenticated : state.auth.isAuthenticated,
  }
}


export default connect(mapStateToProps, {signIn})(composedAuthHOC(Login));