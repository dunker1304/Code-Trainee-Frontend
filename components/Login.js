import React, { useState , useEffect} from 'react';
import classNames from 'classnames'
import {connect} from 'react-redux'
import * as action from "../store/auth/action"
import { displayLogin } from "../store/auth/action"
import  Google  from "../static/images/icon-google.png"
const CONSTANTS = require('../utils/constants')
var popupTools = require('popup-tools');
import  {openNotificationWithIcon } from "../components/Notification"

const Login= (props) => {


  const [ email , setEmail ] = useState('');
  const [ password , setPassword ] = useState('');
  const [ role , setRole ] = useState(CONSTANTS.ROLE.ROLE_STUDENT);
  const [ username, setUsername ] = useState('');

  useEffect(() => {
    setEmail('')
    setUsername('');
    setPassword('')
    console.log("!23")
  }, [role]); // Only re-run the effect if count changes

  const changeEmail = function(value){
    setEmail(value)
  }
  const changePassword = function(value){
    setPassword(value)
  }
  const changeUsername = function(value){
    setUsername(username)
  }
  const changeRole = function(value){
    setRole(value)
  }

  const submitSignIn = function(e) {
    e.preventDefault();
   
    props.signIn(email,password, role)

  }

  const googleLogin = (e)=> {
    popupTools.popup(`${process.env.API}/oauth/google/${role}`, "Google Connect", {}, function (err, data) {
      if (err) {
        //openNotificationWithIcon('error','',err.message);
        console.log(err)
      } else {
         if(!data.success) {
           openNotificationWithIcon('error','',data.message)
         }
         else {
            if(data.message) {
              openNotificationWithIcon('success','',data.message)
            }
            window.location.reload();
         }      
      }
  });     
  }


    return (
      <div>
      <ul className="nav nav-tabs nav-fill" role="tablist">
        <li role="presentation" className = {classNames('nav-item',{'active': role == CONSTANTS.ROLE.ROLE_STUDENT})} onClick= {()=>changeRole(CONSTANTS.ROLE.ROLE_STUDENT)}>
          <a className="nav-link" data-target="#login" aria-controls="login" role="tab" data-toggle="tab" aria-expanded="false">Student</a>
        </li>
        <li role="presentation" className = {classNames('nav-item',{'active': role  == CONSTANTS.ROLE.ROLE_TEACHER})} onClick= {()=>changeRole(CONSTANTS.ROLE.ROLE_TEACHER)}>
          <a className="nav-link" data-target="#signup" aria-controls="signup" role="tab" data-toggle="tab"  aria-expanded="true">Teacher</a>
        </li>
      </ul>
      <div className="tab-content">
      <div className="limiter">
        <div className="container-login100" >
          <div className="wrap-login100 ">
            {/* Login */}
            <form  onSubmit = {(e)=> submitSignIn(e)} className="login100-form validate-form" >
              <span className="login100-form-title p-b-20">
                Login your { role == CONSTANTS.ROLE.ROLE_STUDENT ? ' STUDENT ': ' TEACHER '} account
              </span>
              {/* href={`${process.env.API}/oauth/google/${role}`} */}
              <button  className="btn-google m-b-20" onClick= {(e)=> { googleLogin(e)}}>
                <img src={Google} alt="GOOGLE" />
                Google
              </button>
              <p className='label-or'>OR</p>
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
              <div className="w-full text-center p-t-55">
                <span className="txt2">
                  Not a member?
                </span>
                <a className="txt2 bo1" onClick= {()=> props.displayLogin(true,2)}>
                  Sign up now
                </a>
              </div>
            </form>
            {/* End Login */}

        
          </div>
        </div>
      </div>

      </div>
    </div>
    );

}

function mapStateToProps(state,ownProps) {
  return {
    authMessage: state.auth.authMessage,
  
  }
}


export default connect(mapStateToProps,action)(Login);