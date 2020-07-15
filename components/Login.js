import React, { Component } from 'react';
import classNames from 'classnames'
import {connect} from 'react-redux'
import * as action from "../store/auth/action"
import { Radio } from 'antd'
import {openNotificationWithIcon} from '../components/Notification'
class Login extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      email:'',
      password:'',
      role:'',
      username:'',
     // isLogin : props.type == 1
    }
    
  }

  //state = { isLogin: true, email:'',password:'',role:'',username:'' };

  changeTab = function(type) {
    this.props.displayLogin(true,type)
  }
  changeEmail = function(value){
    this.setState({email : value})
  }
  changePassword = function(value){
    this.setState({password:value})
  }
  changeUsername = function(value){
    this.setState({username:value})
  }
  changeRole = function(value){
    this.setState({role:value})
  }

  submitSignIn = function(e) {
    e.preventDefault();
   
    this.props.signIn(this.state.email,this.state.password)

  }

  submitSignUp = function(e) {
     e.preventDefault();
     let data = {
       'email' : this.state.email,
       'username': this.state.username,
       'role':this.state.role,
       'password': this.state.password
     }
     this.props.signUp(data);
  }

  onClickATag = function(e){
    if(!this.state.role) {
      e.preventDefault()
      openNotificationWithIcon('warning','Warning','Please choose your role')
    } 
  }
  render() {
    return (
      <div>
      <ul className="nav nav-tabs nav-fill" role="tablist">
        <li role="presentation" className = {classNames('nav-item',{'active': this.props.type == 1})} onClick= {()=>this.changeTab(1)}>
          <a className="nav-link" data-target="#login" aria-controls="login" role="tab" data-toggle="tab" aria-expanded="false">Login</a>
        </li>
        <li role="presentation" className = {classNames('nav-item',{'active': this.props.type  == 2})} onClick= {()=>this.changeTab(2)}>
          <a className="nav-link" data-target="#signup" aria-controls="signup" role="tab" data-toggle="tab"  aria-expanded="true">Register</a>
        </li>
      </ul>
      <div className="tab-content">
      <div className="limiter">
        <div className="container-login100" >
          <div className="wrap-login100 ">
            {/* Login */}
            <form  onSubmit = {(e)=> this.submitSignIn(e)} className="login100-form validate-form" style={{display: this.props.type == 1 ? 'block' : 'none' }}>
              <span className="login100-form-title p-b-20">
                Login your account
              </span>
              <a href={`${process.env.API}/oauth/google`} className="btn-google m-b-20">
                <img src="../static/images/icon-google.png" alt="GOOGLE" />
                Google
              </a>
              <p className='label-or'>OR</p>
              <div className="p-t-20 p-b-9">
                <span className="txt1"> 
                  Username or Email
                </span>
              </div>
              <div className="wrap-input100 validate-input" data-validate="Username is required">
                <input className="input100" type="text" required name="email" onChange = {(e)=>this.changeEmail(e.target.value)}/>
                <span className="focus-input100" />
              </div>
              <div className="p-t-13 p-b-9">
                <span className="txt1">
                  Password
                </span>
                <a href="#" className="txt2 bo1 m-l-5">
                  Forgot?
                </a>
              </div>
              <div className="wrap-input100 validate-input" data-validate="Password is required">
                <input className="input100" type="password"  required name="password"  onChange = {(e)=>this.changePassword(e.target.value)} />
                <span className="focus-input100" />
              </div>
              {/* <div className='login_error'>
                {this.props.loginError}
              </div> */}

              <div className="container-login100-form-btn m-t-17">
                <button type="submit" className="login100-form-btn" >
                  Sign In
                </button>
              </div>
              <div className="w-full text-center p-t-55">
                <span className="txt2">
                  Not a member?
                </span>
                <a href="#" className="txt2 bo1">
                  Sign up now
                </a>
              </div>
            </form>
            {/* End Login */}

            {/* Register */}
            <form onSubmit = {(e)=> this.submitSignUp(e)} className="login100-form validate-form" style={{display: this.props.type == 2 ? 'block' : 'none' }}>
              <span className="login100-form-title p-b-20">
                Register new account
              </span>
              <a href={`${process.env.API}/oauth/google?role=1`} onClick = {(e)=>this.onClickATag(e)}className="btn-google m-b-20">
                <img src="../static/images/icon-google.png" alt="GOOGLE" />
                Google
              </a>
              <p className='label-or'>OR</p>
              <div className="p-t-20 p-b-9">
                <span className="txt1">
                  Username
                </span>
              </div>
              <div className="wrap-input100 validate-input" data-validate="Username is required">
                <input className="input100" type="text" name="username" onChange= {(e)=>this.changeUsername(e.target.value)} required />
                <span className="focus-input100" />
              </div>
              <div className="p-t-13 p-b-9">
                <span className="txt1">
                  Email
                </span>
              </div>
              <div className="wrap-input100 validate-input" data-validate="Email is required">
                <input className="input100" type="email" name="email" aria-required="true"  onChange= {(e)=>this.changeEmail(e.target.value)} required/>
                <span className="focus-input100" />
              </div>
              <div className="p-t-13 p-b-9">
                <span className="txt1">
                  Password
                </span>
              </div>
              <div className="wrap-input100 validate-input"  onChange= {(e)=>this.changePassword(e.target.value)}>
                <input className="input100" type="password" name="password" required   />
                <span className="focus-input100" />
              </div>
              <Radio.Group name="role"  className ="role_radio"  onChange= {(e)=>this.changeRole(e.target.value)} >
                <Radio value={1} required>Teacher</Radio>
                <Radio value={2}>Student</Radio>
              </Radio.Group>
              {/* <div className='login_error'>
                {this.props.signUpError}
              </div> */}
              <div className="container-login100-form-btn m-t-17">
                <button type="submit" className="login100-form-btn">
                  Sign Up
                </button>
              </div>
              <div className="w-full text-center p-t-55">
                <span className="txt2">
                  Already Registered ? 
                </span>
                <a href="#" className="txt2 bo1">
                 Login now
                </a>
              </div>
            </form>
            {/* End Register */}
          </div>
        </div>
      </div>

      </div>
    </div>
    );
  }
}

function mapStateToProps(state,ownProps) {
  return {
    authMessage: state.auth.authMessage,
  
  }
}


export default connect(mapStateToProps,action)(Login);