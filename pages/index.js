import React, { Component } from 'react'
import Head from 'next/head'
import { connect } from 'react-redux'
import { Button, Upload, message, Modal } from 'antd'
import { useEffect } from "react"
import { UpCircleOutlined } from '@ant-design/icons'
import CodeTrainee from 'hocs';
import * as action from "../store/auth/action"
import Login from "../components/Login"
import Register from "../components/Register"
const CONSTANTS = require('../utils/constants')
import { redirectRouter } from "../helpers/utils"
import composedAuthHOC from 'hocs';
import Router from "next/router"


class Index extends Component {
  constructor(props) {
    super(props);
  }

  UNSAFE_componentWillReceiveProps(nextProps){
    if(this.props.isAuthenticated != nextProps.isAuthenticated) {
      if(nextProps.isAuthenticated == true) {
        console.log(nextProps)
        let url = redirectRouter(nextProps.userInfo['role']['id'])
        Router.push(url)
      }
    }
  }

  componentDidMount() {
    console.log('componentDidMount')
    document.body.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    //window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    let header = document.getElementById("header-menu")
    let scrollTop = document.body.scrollTop
    if (scrollTop > 50) {
      if (header) header.classList.add("header-sticky")
    } else {
      if (header) header.classList.remove("header-sticky")
    }
  }

  render() {
    return (
      <>
        <Head>
          <link rel="stylesheet" type="text/css" href="https://rsms.me/inter/inter-ui.css" /> 
          <link rel="stylesheet" type="text/css" href="../static/css/antd.min.css"></link>
          <script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossOrigin="anonymous"></script>
          <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossOrigin="anonymous"></link>
          <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossOrigin="anonymous"></script>
          <title>Code Trainee</title>
        </Head>
        <div className='wrapper-index-page'>
          <div className='header-menu' id='header-menu'>
            <div className='container'>
              <div className='row'>
                <div className="col-sm-6 col-12 logo-wrapper">
                  <img src='../static/images/logo.png' alt='logo' width='70px'/>
                  <span className='logo-title'>Code Trainee</span>
                </div>
                <Modal
                  style={{ top: 20 }}
                  closable = {false}
                  visible={this.props.isShowLogin.isShow}
                  footer = {null}
                  onOk={()=> this.props.displayLogin(false,1)}
                  onCancel={()=> this.props.displayLogin(false,1)}
                  wrapClassName = 'login-modal'
                  className="my-modal-class"
                >
                  {
                    this.props.isShowLogin.type == 1 ?   <Login  type = "1"></Login>
                    : <Register type = "2" ></Register>
                  }
               
                </Modal>
                <div className="col-sm-6 col-12">
                  <ul className='header-btn'>
                    <li><a className='fill-btn'  onClick={()=>this.props.displayLogin(true,1)}>Sign in</a></li>
                    <li><a className='fill-btn'  onClick={()=>this.props.displayLogin(true,2)}>Sign up</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className='preview-banner-area' style={{backgroundImage: `url('static/images/banner1.jpg')`}}>
            <img className="img-fluid animated-figure animated-figure1" src="static/images/codetrainee-figure1.png" alt="banner"/>
            <img className="img-fluid animated-figure animated-figure2" src="static/images/codetrainee-figure1.png" alt="banner"/>
            <div className="container">
              <div className="preview-banner-content">
                <h1>Code Trainee for FPT Students</h1>
                <ul className="build-with">
                  <li>
                    <img className="img-fluid" src='../static/images/html.png'></img>
                  </li>
                  <li>
                    <img className="img-fluid" src='../static/images/css.png'></img>
                  </li>
                  <li>
                    <img className="img-fluid" src='../static/images/bootstrap.png'></img>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div id='main-body' className='main-body-area position-relative'>
            <div className='container'>
              <div className='section-heading'>
                <div className='item-subtitle'>Code Trainee</div>
                <h2>Total 4 Home Page</h2>
              </div>
              <div className='row'>
                <div className="col-sm-6 col-12">
                  <div className='product-box'>
                    <div className='product-box-content'>
                      <div><a href='#'>Home 01</a></div>
                    </div>
                    <div className='product-box-img'>
                      <img className='img-responsive' src='../static/images/codetrainee1.png'></img>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-12">
                  <div className='product-box'>
                    <div className='product-box-content'>
                      <div><a href='#'>Home 02</a></div>
                    </div>
                    <div className='product-box-img'>
                      <img className='img-responsive' src='../static/images/codetrainee2.png'></img>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-12">
                  <div className='product-box'>
                    <div className='product-box-content'>
                      <div><a href='#'>Home 03</a></div>
                    </div>
                    <div className='product-box-img'>
                      <img className='img-responsive' src='../static/images/codetrainee3.png'></img>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-12">
                  <div className='product-box'>
                    <div className='product-box-content'>
                      <div><a href='#'>Home 04</a></div>
                    </div>
                    <div className='product-box-img'>
                      <img className='img-responsive' src='../static/images/codetrainee4.png'></img>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='responsive-wrap'>
            <div className='container'>
              <div className='row' style={{ width: '100%'}}>
                <div className="col-lg-5 col-12">
                  <div className='item-content'>
                    <h3><span>Playground</span> for many languages & <span>Learn</span> about architecture</h3>
                    <a className='fill-btn' href='/problem' target='_blank'>Do Exercise Now</a>
                  </div>
                </div>
                <div className='col-lg-7 col-12'>
                  <img src='../static/images/responsive.png' alt='banner'></img>
                </div>
              </div>
            </div>
          </div>

          <div className='feature-wrap'>
            <div className='section-heading-light'>
              <div className='item-subtitle'>Our website core</div>
              <h2>Feature</h2>
            </div>
            <div className='container'>
              <div className='row'>
                <div className='col-xl-3 col-lg-4 col-sm-6 col-12'>
                  <div className='feature-box'>
                    <h3>Question Diversity</h3>
                    <div className='item-subtitle'>About many categories</div>
                    <div className='item-img'>
                      <img src='../static/images/element.png'></img>
                    </div>
                  </div>
                </div>
                <div className='col-xl-3 col-lg-4 col-sm-6 col-12'>
                  <div className='feature-box'>
                    <h3>Clean Coding</h3>
                    <div className='item-subtitle'>About many categories</div>
                    <div className='item-img'>
                      <img src='../static/images/element.png'></img>
                    </div>
                  </div>
                </div>
                <div className='col-xl-3 col-lg-4 col-sm-6 col-12'>
                  <div className='feature-box'>
                    <h3>All Modern Browser</h3>
                    <div className='item-subtitle'>About many categories</div>
                    <div className='item-img'>
                      <img src='../static/images/element.png'></img>
                    </div>
                  </div>
                </div>
                <div className='col-xl-3 col-lg-4 col-sm-6 col-12'>
                  <div className='feature-box'>
                    <h3>Management Group</h3>
                    <div className='item-subtitle'>About many categories</div>
                    <div className='item-img'>
                      <img src='../static/images/element.png'></img>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer>
            <div className="footer-area">
              <div className="container">
                <div className="footer-logo">
                  <img style={{ width: "100px" }} className="img-responsive" src="../static/images/logo.png"></img>
                </div>
                <p>
                  © 2020 Code Trainee All Rights Reserved. Designed by @abc
                </p>
              </div>
            </div>
          </footer>
        </div>
      </>
    )
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.errorMessage,
    isShowLogin : state.auth.isShowLogin,
    isAuthenticated : state.auth.isAuthenticated,
    userInfo : state.auth.userInfo
  }
}

export default connect(mapStateToProps,action)(composedAuthHOC(Index))