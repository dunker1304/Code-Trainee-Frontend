import React, { Component, useState, useEffect } from 'react'
import { render } from 'react-dom'
import AceEditor from 'react-ace'
import { Row, Col, Button, Select, Tabs } from 'antd'
import axios from 'axios'
import TestCase from '../components/TestCase'
import SettingModal from '../components/SettingModal'
import QuestionDescription from '../components/QuestionDescription'
import { languageMap } from '../utils/constants'
import Split from 'react-split'
import CodeTrainee from '../hocs/index';
import { connect } from 'react-redux';

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
  const [code, setCode] = useState(props.language[0].codeSnippets[0]?.sampleCode || '')
  const [languageID, setLanguageID] = useState(props.language[0].code)
  const [testCaseProps, setTestCaseProps] = useState(props.question.testCases)
  const [consoleEditor, setConsoleEditor] = useState('show')
  const [fontSize, setFontSize] = useState(14)
  const [theme, setTheme] = useState('monokai')
  const [tabSize, setTabSize] = useState(2)
  const [keyboardHandler, setKeyboardHandler] = useState("")
  const [gutter, setGutter] = useState(true)
  const [runCode, setRunCode] = useState(false)

  const onChange = (newValue) => {
    setCode(newValue)
    setRunCode(false)
  }

  const handleRunCode = (callback) => {
    let data = {
      language_id: languageID,
      source_code: code,
      question_id: '1'
    }
    console.log(process.env.API, 'handle run code')
    axios.post(`${process.env.API}/api/submissions`, data)
      .then(res => {
        setTestCaseProps(res.data)
        if (typeof callback === 'function') callback(res.data)
      })
      .catch(error => {
        console.log(error)
      })
      setRunCode(true)
  }

  const addSolution = testCaseProps => {
    let langDB
    props.language.forEach(language => {
      if (language.code == languageID) {
        langDB = language.id
      }
    })
    let data = {
      question: props.question.question,
      testcases: testCaseProps,
      answer: code,
      language: langDB
    }
    axios.post(`${process.env.API}/api/solution`, data)
      .then(res => {
        console.log(res, 'add solution')
      })
      .catch(error => {
        console.log(error)
      })
  }

  const handleSubmitCode = () => {
    console.log(runCode, 'submit code')
    if (!runCode) {
      handleRunCode(addSolution)
    } else {
      addSolution()
    }
  }

  const handleChangeLanguage = (value, option) => {
    // get code snippet
    // axios.get(`http://localhost:1337/api/snippet-code?userID=3&exerciseID=${props.question.question.id}&languageID=${languageID}`)
    //   .then(res => {
    //     console.log(res)
    //   })
    //   .catch(error => {
    //     console.log(error)
    //   })
    setLanguageID(value)
    setCode(props.language[option.key].codeSnippets[0]?.sampleCode || "")
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

  const handlePickRandomQuestion = () => {
    axios.get(`${process.env.API}/api/exercise/random`)
      .then((response) => {
        console.log(response.data, 'random question')
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <>
      <Split
        sizes={[35, 65]}
        minSize={300}
        expandToMin={false}
        gutterSize={10}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="horizontal"
        cursor="col-resize"
        className="split-wrapper">
        <div className="content-right">
          <Tabs defaultActiveKey="1" type="card" onChange={handleChangeTab}>
            <TabPane tab="Description" key="1">
              <QuestionDescription question={props.question.question}/>
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
            <Button type='default' onClick={handlePickRandomQuestion}>
              <svg viewBox="0 0 24 24" width="1em" height="1em" className="icon__3Su4 shuffle-icon__dV27"><path fillRule="evenodd" d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"></path></svg>
              <span>Pick One</span>
            </Button>
            {/* <Button type='default'>
              <svg viewBox="0 0 24 24" width="1em" height="1em" className="icon__3Su4 handler-icon__26i5"><path fillRule="evenodd" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>
              <span>Prev</span>
            </Button>
              <span>1/{props.question.total}</span>
            <Button type='default'>
              <span>Next</span>
              <svg viewBox="0 0 24 24" width="1em" height="1em" className="icon__3Su4 handler-icon__26i5"><path fillRule="evenodd" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg>
            </Button> */}
          </div>
        </div>
        <div className="content-left playground-wrapper">
          <div className="playground-action">
            <Select defaultValue={props.language[0].code} style={{ width: 120 }} onSelect={handleChangeLanguage}>
              {props.language && props.language.map((lang, key) => (
                <Option key={key} value={lang.code}>{lang.name}</Option>
              ))}
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
            showPrintMargin={false}
            editorProps={{ $blockScrolling: true }}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true
            }}
          />

          {
            Array.isArray(testCaseProps) ?
            <Tabs defaultActiveKey="1" tabPosition="left" onChange={handleChangeTab} 
              style={ (consoleEditor == 'hide') ? {display: 'none'} : null } className="console-status">
              {testCaseProps.map((testCase, key) => (
                <TabPane tab={`Test Case ` + (key + 1)} key={key}>
                  <TestCase testCaseProps={testCase.data || testCase}/>
                </TabPane>
              ))}
            </Tabs>
            :
            <div className="console-status" style={ (consoleEditor == 'hide') ? {display: 'none'} : null }>
              <div>Status: {testCaseProps && testCaseProps.data.status.description}</div>
              <div style={{ whiteSpace: 'pre-wrap' }} 
                dangerouslySetInnerHTML={{__html: testCaseProps && testCaseProps.data.compile_output ? testCaseProps.data.compile_output.toString() : testCaseProps.data.stderr.toString()}}></div>
            </div>
          }

          <div className="action-code-editor">
            <Button className="show-console" onClick={handleShowConsole}>
              <span>Console</span>
              <svg viewBox="0 0 24 24" width="1em" height="1em" className="icon__3Su4"><path fillRule="evenodd" d="M7 14l5-5 5 5z"></path></svg>
            </Button>
            <div className="action">
              <Button type='primary' onClick={handleRunCode}>Run Code</Button>
              <Button className="submit-code" onClick={handleSubmitCode}>Submit</Button>
            </div>
          </div>
        </div>
      </Split>
    </>
  );
}

Playground.getInitialProps = async function(ctx) {
  console.log(JSON.stringify(process.env.API), 'env config')

  let id = ctx.query.questionID
  let urlExercise = `${process.env.API}/api/exercise?id=${id}`
  let urlLanguage = `${process.env.API}/api/program-language/all?exerciseId=${id}`
  const questionResponse = await axios.get(urlExercise)
  const languageResponse = await axios.get(urlLanguage)
  console.log(questionResponse.data, 'questionResponse')
  return { question: questionResponse.data, language: languageResponse.data.data.result }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.errorMessage,
    isShowLogin : state.auth.isShowLogin
  }
}

export default Playground