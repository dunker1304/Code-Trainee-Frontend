import classNames from "classnames"
import { useState  ,useEffect} from "react"
import { signUp , displayLogin } from "../store/auth/action"
import {connect} from "react-redux"
import  Google  from "../static/images/icon-google.png"
var popupTools = require('popup-tools');
import  {openNotificationWithIcon } from "../components/Notification"

const CONSTANTS  = require("../utils/constants")
const Register = (props)=> {
  const [ email , setEmail ] = useState('');
  const [ password , setPassword ] = useState('');
  const [ rePassword , setRePassword ] = useState('');
  const [ displayName , setDisplayName] = useState('');
  const [ role , setRole ] = useState(CONSTANTS.ROLE.ROLE_STUDENT);
  const [ username, setUsername ] = useState('');

  useEffect(() => {
    setEmail('')
    setUsername('');
    setPassword('')
    setRePassword('');
    setDisplayName('')

  }, [role]); 

  const changeEmail = function(value){
    setEmail(value)
  }
  const changePassword = function(value){
    setPassword(value)
  }
  const changeUsername = function(value){
    setUsername(value)
  }
  const changeRole = function(value){
    setRole(value)
  }

  const changeRePassword = function(value){
    setRePassword(value)
  }

  const changeDisplayName = function(value){
    setDisplayName(value)
  }

  const submitSignUp = function(e) {
    e.preventDefault();
    let data = {
      'email' : email,
      'username': username,
      'role':role,
      'password': password,
      'rePassword':rePassword,
      'displayName' : displayName
    }
    props.signUp(data);
 }

 const googleLogin = (e)=> {
  e.preventDefault()
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



  return  (
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
            {/* Register */}
            <form onSubmit = {(e)=> submitSignUp(e)} className="login100-form validate-form">
              <span className="login100-form-title p-b-20">
                 Register new { role == CONSTANTS.ROLE.ROLE_STUDENT ? 'STUDENT' : 'TEACHER'} account
              </span>
              <button onClick= {(e)=>googleLogin(e)} className="btn-google m-b-20">
                <img src={Google} alt="GOOGLE" />
                Google
              </button>
              <p className='label-or'>OR</p>
              <div className="p-t-20 p-b-9">
                <span className="txt1">
                  Username
                </span>
              </div>
              <div className="wrap-input100 validate-input" data-validate="Username is required">
                <input className="input100" type="text" name="username" onChange= {(e)=>changeUsername(e.target.value)} required value={username}/>
                <span className="focus-input100" />
              </div>
              <div className="p-t-13 p-b-9">
                <span className="txt1">
                  Email
                </span>
              </div>
              <div className="wrap-input100 validate-input" data-validate="Email is required">
                <input className="input100" type="email" name="email" aria-required="true"  onChange= {(e)=>changeEmail(e.target.value)} required value={email}/>
                <span className="focus-input100" />
              </div>

              <div className="p-t-13 p-b-9">
                <span className="txt1">
                  DisplayName
                </span>
              </div>
              <div className="wrap-input100 validate-input" data-validate="DisplayName is required">
                <input className="input100" type="text" name="displayName" aria-required="true"  onChange= {(e)=>changeDisplayName(e.target.value)} required value={displayName}/>
                <span className="focus-input100" />
              </div>

              <div className="p-t-13 p-b-9">
                <span className="txt1">
                  Password
                </span>
              </div>
              <div className="wrap-input100 validate-input"  onChange= {(e)=>changePassword(e.target.value)} value={password}>
                <input className="input100" type="password" name="password" required   />
                <span className="focus-input100" />
              </div>

              <div className="p-t-13 p-b-9">
                <span className="txt1">
                  Re-Password
                </span>
              </div>
              <div className="wrap-input100 validate-input"  onChange= {(e)=>changeRePassword(e.target.value)} value={rePassword}>
                <input className="input100" type="password" name="rePassword" required   />
                <span className="focus-input100" />
              </div>

             <div className="container-login100-form-btn m-t-17">
                <button type="submit" className="login100-form-btn">
                  Sign Up
                </button>
              </div>
              <div className="w-full text-center p-t-55">
                <a className="txt2" onClick= {()=> props.displayLogin(true,1)} style= {{cursor : "pointer", textDecoration:"underline"}}>
                  Already Registered ? 
                </a>
                {/* <a  className="txt2 bo1" onClick = {props.displayLogin(true,1)}>
                 Login now
                </a> */}
              </div>
            </form> 
            {/* End Register */}
           
          </div>
        </div>
      </div>

      </div>
    </div>
  )
}

export default connect(null , { signUp ,displayLogin})(Register);