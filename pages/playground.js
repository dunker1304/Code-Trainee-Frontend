import React, { Component, useState, useEffect } from 'react'
import { render } from 'react-dom'
import AceEditor from 'react-ace'
import { Row, Col, Button, Select, Tabs } from 'antd'
import axios from 'axios'
import TestCase from '../components/TestCase'

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools"

const { Option } = Select
const { TabPane } = Tabs

const Playground = props => { 
  const [code, setCode] = useState("")
  const [languageID, setLanguageID] = useState(63)
  const [testCaseProps, setTestCaseProps] = useState()

  const onChange = (newValue) => {
    setCode(newValue)
  }

  const handleRunCode = () => {
    console.log(code, 'run code thoi')
    let data = {
      language_id: languageID,
      source_code: code,
      question_id: '1'
    }
    axios.post('http://localhost:1337/api/test', data)
      .then(res => {
        console.log(res, 'dunker alo')
        setTestCaseProps(res.data)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const handleChangeLanguage = (value) => {
    setLanguageID(value)
  }

  const handleChangeTab = (key) => {

  }

  return (
    <>
      <Row>
        <Col className="content-right" span={10}>
          <Tabs defaultActiveKey="1" type="card" onChange={handleChangeTab}>
            <TabPane tab="Description" key="1">
              Description here
            </TabPane>
            <TabPane tab="Solutions" key="2">
              Solution here
            </TabPane>
            <TabPane tab="Submissions" key="3">
              Submissions here
            </TabPane>
          </Tabs>
        </Col>
        <Col className="content-left playground-wrapper" span={14}>
          <div className="playground-action">
            <Button type='primary' onClick={handleRunCode}>Run Code</Button>
            <Select defaultValue="Javascript" style={{ width: 120 }} onChange={handleChangeLanguage}>
              <Option value="48">C</Option>
              <Option value="62">Java</Option>
              <Option value="63">Javascript</Option>
            </Select>
          </div>
          <AceEditor
            className='playground'
            mode="java"
            theme="monokai"
            value={code}
            onChange={onChange}
            name="playground"
            editorProps={{ $blockScrolling: true }}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true
            }}
          />

          {
            Array.isArray(testCaseProps) ?
            <Tabs defaultActiveKey="1" type="card" tabPosition="left" onChange={handleChangeTab}>
              {console.log(testCaseProps, 'test case props')}
              {testCaseProps.map((testCase, key) => (
                <TabPane tab={`Test Case ` + (key + 1)} key={key}>
                  <TestCase testCaseProps={testCase.data}/>
                </TabPane>
              ))}
            </Tabs>
            :
            <div>
              <div>Status: {testCaseProps && testCaseProps.data.status.description}</div>
              <div style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{__html: testCaseProps && testCaseProps.data.compile_output.toString()}}></div>
            </div>
          }
        </Col>
      </Row>
      
    </>
  );
}

export default Playground