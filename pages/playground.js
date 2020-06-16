import React, { Component, useState, useEffect } from 'react'
import { render } from 'react-dom'
import AceEditor from 'react-ace'
import { Row, Col, Button, Select, Tabs } from 'antd'
import axios from 'axios'
import TestCase from '../components/TestCase'
import SettingModal from '../components/SettingModal'
import QuestionDescription from '../components/QuestionDescription'
import { languageMap } from '../utils/constants'

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/theme-kuroir";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/ext-language_tools"

const { Option } = Select
const { TabPane } = Tabs

const Playground = props => { 
  const [code, setCode] = useState("")
  const [languageID, setLanguageID] = useState(63)
  const [testCaseProps, setTestCaseProps] = useState()
  const [consoleEditor, setConsoleEditor] = useState('show')
  const [fontSize, setFontSize] = useState(14)
  const [theme, setTheme] = useState('monokai')
  const [tabSize, setTabSize] = useState(2)
  const [keyboardHandler, setKeyboardHandler] = useState("")
  const [gutter, setGutter] = useState(true)

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
    axios.post('http://localhost:1337/api/submissions', data)
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

  const handleChangeSettingFontSize = (fontSize) => {
    setFontSize(parseInt(fontSize))
  }

  const handleChangeSettingTheme = (theme) => {
    setTheme(theme)
  }

  const handleChangeSettingTabSize = (tabSize) => {
    setTabSize(parseInt(tabSize))
  }

  const handleChangeSettingKeyboardHandler = (handler) => {
    setKeyboardHandler(handler)
  }

  const handleChangeSettingGutter = (gutter) => {
    setGutter(gutter == 'true')
  }

  const handleChangeTab = (key) => {

  }

  const handleShowConsole = () => {
    if (consoleEditor == "hide") {
      setConsoleEditor('show')
    } else {
      setConsoleEditor('hide')
    }
  }

  return (
    <>
      <Row>
        <Col className="content-right" span={10}>
          <Tabs defaultActiveKey="1" type="card" onChange={handleChangeTab}>
            <TabPane tab="Description" key="1">
              <QuestionDescription question={props.question}/>
            </TabPane>
            <TabPane tab="Solutions" key="2">
              Solution here
            </TabPane>
            <TabPane tab="Submissions" key="3">
              Submissions here
            </TabPane>
          </Tabs>

          <div className="question-fast-picker">
            <Button type='default'>
              <svg viewBox="0 0 24 24" width="1em" height="1em" className="icon__3Su4"><path fillRule="evenodd" d="M7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7zM3 5h2v2H3V5zm0 6h2v2H3v-2zm0 6h2v2H3v-2z"></path></svg>
              <span>Problems</span>
            </Button>
            <Button type='default'>
              <svg viewBox="0 0 24 24" width="1em" height="1em" className="icon__3Su4 shuffle-icon__dV27"><path fillRule="evenodd" d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"></path></svg>
              <span>Pick One</span>
            </Button>
            <Button type='default'>
              <svg viewBox="0 0 24 24" width="1em" height="1em" className="icon__3Su4 handler-icon__26i5"><path fillRule="evenodd" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>
              <span>Prev</span>
            </Button>
            <span>1/2</span>
            <Button type='default'>
              <span>Next</span>
              <svg viewBox="0 0 24 24" width="1em" height="1em" className="icon__3Su4 handler-icon__26i5"><path fillRule="evenodd" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg>
            </Button>
          </div>
        </Col>
        <Col className="content-left playground-wrapper" span={14}>
          <div className="playground-action">
            <Select defaultValue="Javascript" style={{ width: 120 }} onChange={handleChangeLanguage}>
              <Option value="53">C</Option>
              <Option value="62">Java</Option>
              <Option value="63">Javascript</Option>
            </Select>

            <SettingModal
              handleChangeSettingFontSize={handleChangeSettingFontSize}
              handleChangeSettingTheme={handleChangeSettingTheme}
              handleChangeSettingTabSize={handleChangeSettingTabSize}
              handleChangeSettingKeyboardHandler={handleChangeSettingKeyboardHandler}
              handleChangeSettingGutter={handleChangeSettingGutter}
            />
          </div>
          <AceEditor
            className='playground'
            mode={languageMap[languageID]}
            theme={theme}
            value={code}
            onChange={onChange}
            fontSize={fontSize}
            tabSize={tabSize}
            keyboardHandler={keyboardHandler}
            name="playground"
            showGutter={gutter}
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
            <div className="console-status" style={ (consoleEditor == 'hide') ? {display: 'none'} : null }>
              <div>Status: {testCaseProps && testCaseProps.data.status.description}</div>
              <div style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{__html: testCaseProps && testCaseProps.data.compile_output.toString()}}></div>
            </div>
          }

          <div className="action-code-editor">
            <Button className="show-console" onClick={handleShowConsole}>
              <span>Console</span>
              <svg viewBox="0 0 24 24" width="1em" height="1em" className="icon__3Su4"><path fillRule="evenodd" d="M7 14l5-5 5 5z"></path></svg>
            </Button>
            <div className="action">
              <Button type='primary' onClick={handleRunCode}>Run Code</Button>
              <Button className="submit-code">Submit</Button>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}

Playground.getInitialProps = async (ctx) => {
  let id = ctx.query.questionID
  let url = `http://localhost:1337/api/question?id=${id}`
  const questionResponse = await axios.get(url)
  return { question: questionResponse.data }
}

export default Playground