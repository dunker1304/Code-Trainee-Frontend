import React, { Component } from 'react'
import Head from 'next/head'
// import { connect } from 'react-redux'
import { Button, Upload, message } from 'antd'
import { UpCircleOutlined } from '@ant-design/icons'

class Index extends Component {
  render() {
    return (
      <div>
        <Head>
          <link rel="stylesheet" type="text/css" href="https://rsms.me/inter/inter-ui.css" /> 
          <link rel="stylesheet" type="text/css" href="../static/css/antd.min.css"></link>
          <title>Code Trainee</title>
        </Head>
        <Button type="primary">Button</Button>
        <Upload>
          <UpCircleOutlined />Click to upload
        </Upload>
      </div>
    )
  }
}

export default Index