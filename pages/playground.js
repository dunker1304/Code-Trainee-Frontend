import React, { Component, useState, useEffect } from 'react'
import { render } from 'react-dom'
import AceEditor from 'react-ace'
import { Row, Col, Button, Select, Tabs, Spin, message, notification, Tooltip } from 'antd'
import { SaveOutlined } from '@ant-design/icons';
import axios from 'axios'
import TestCase from '../components/TestCase'
import SettingModal from '../components/SettingModal'
import QuestionDescription from '../components/exercise/ExerciseDescription'
import ExerciseSubmissions from '../components/exercise/ExerciseSubmissions'
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
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/keybinding-vim";
import "ace-builds/src-noconflict/keybinding-emacs";
import "ace-builds/src-noconflict/keybinding-vscode";
import Router , {useRouter} from 'next/router'
import Header from "../components/Header"
import composedAuthHOC from 'hocs';

const { Option } = Select
const { TabPane } = Tabs

const Playground = props => { 
  const [code, setCode] = useState(props.language[0].codeSnippets[0]?.sampleCode || '')
  const [languageID, setLanguageID] = useState(props.language[0].code)
  const [testCaseProps, setTestCaseProps] = useState(props.question.testCases)
  const [testCasePropsRun, setTestCasePropsRun] = useState()
  const [consoleEditor, setConsoleEditor] = useState('show')
  const [fontSize, setFontSize] = useState(14)
  const [theme, setTheme] = useState('monokai')
  const [tabSize, setTabSize] = useState(2)
  const [keyboardHandler, setKeyboardHandler] = useState("")
  const [gutter, setGutter] = useState(true)
  const [indexActive , setIndexActive] = useState("1")
  const [indexLanguage , setIndexLanguage] = useState(0)
  const router = useRouter()

  useEffect(() => {
   let activeTab = router.query.tab ? router.query.tab : "1"
   setCode(props.tempCode?.temp?.answer || props.language[indexLanguage].codeSnippets[0]?.sampleCode || "")
   setTestCaseProps(props.question.testCases)
   if(activeTab == 4) {
    let questionId = router.query.questionID
    Router.push(`/exercise/[exerciseId]/discuss`,`/exercise/${questionId}/discuss`)
   }
   else
    setIndexActive(activeTab)
  },[props.language, props.question]);
  const [runCode, setRunCode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingAllPage, setLoadingAllPage] = useState(false)

  const onChange = (newValue) => {
    setCode(newValue)
    setRunCode(false)
  }
  const handleResetTemplateCode = () => {
    setCode(props.language[indexLanguage].codeSnippets[0]?.sampleCode || "");
    setRunCode(false);
  }

  const handleRunCode = (callback) => {
    setLoading(true);
    let data = {
      language_id: languageID,
      source_code: code,
      question_id: props.question.question.id
    }
    axios.post(`${process.env.API}/api/submissions`, data)
      .then(res => {
        for(let i = 0; i < testCaseProps.length; i++) {
          if(testCaseProps[i].isHidden && res.data[i]?.success){
            res.data[i].data.isHidden = true
          }
        }
        
        setTestCasePropsRun(res.data)
        setLoading(false)
        if (typeof callback === 'function') callback(res.data)
      })
      .catch(error => {
        setLoading(false)
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
      language: langDB,
      userID: props.userInfo.id
    }
    axios.post(`${process.env.API}/api/solution`, data)
      .then(res => {
        setLoading(false)
        if (res.data.success) {
          notification.success({
            message: "Sucessfully added solution"
          })
        } else {
          console.log(res)
          notification.error({
            message: "Failed!"
          })
        }
        
      })
      .catch(error => {
        console.log(error)
        notification.error({
          message: "Failed!"
        })
      })
  }

  const handleSaveCode = () => {
    setLoading(true)
    let langDB
    props.language.forEach(language => {
      if (language.code == languageID) {
        langDB = language.id
      }
    });
    let data = {
      question: props.question.question,
      testcases: testCaseProps,
      answer: code,
      language: langDB,
      userID: props.userInfo.id
    }
    axios.post(`${process.env.API}/api/exercise/save-code`, data)
      .then((response) => {
        setLoading(false)
        if (response.data.success) {
          notification.success({
            message: "Sucessfully save code"
          })
        } else {
          notification.error({
            message: "Failed!"
          })
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
        notification.error({
          message: "Failed!"
        })
      })
  }

  const handleSubmitCode = () => {
    setLoading(true)
    if (!runCode) {
      handleRunCode(addSolution)
    } else {
      addSolution(testCasePropsRun)
    }
  }

  const handleChangeLanguage = (value, option) => {
    setRunCode(false);
    setLanguageID(value);
    setIndexLanguage(option.key);
    let langDB
    props.language.forEach(language => {
      if (language.code == value) {
        langDB = language.id
      }
    })
    axios.get(`${process.env.API}/api/exercise/temp-code?id=${props.question.question.id}&languageID=${langDB}&userID=${props.userInfo.id}`)
      .then(res => {
        setCode(res.data?.temp?.answer || props.language[option.key].codeSnippets[0]?.sampleCode || "")
      })
      .catch(error => {
        console.log(error)
      })
    
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
    let questionId = router.query.questionID
    if(key == 4) {
      Router.push(`/exercise/[exerciseId]/discuss`,`/exercise/${questionId}/discuss`)
    }
    else {
      Router.push(`/playground?questionID=${questionId}&tab=${key}`)
      setIndexActive(key)
    }
  }

  const handleShowConsole = () => {
    if (consoleEditor == "hide") {
      let icon = document.getElementById('icon-console')
      icon.innerHTML = `<svg viewBox="0 0 24 24" width="1em" height="1em" class="icon__3Su4"><path fill-rule="evenodd" d="M7 10l5 5 5-5z"></path></svg>`
      setConsoleEditor('show')
    } else {
      let icon = document.getElementById('icon-console')
      icon.innerHTML = `<svg viewBox="0 0 24 24" width="1em" height="1em" class="icon__3Su4"><path fill-rule="evenodd" d="M7 14l5-5 5 5z"></path></svg>`
      setConsoleEditor('hide')
    }
  }

  const handlePickRandomQuestion = () => {
    setLoadingAllPage(true);
    axios.get(`${process.env.API}/api/exercise/random`)
      .then((response) => {
        setLoadingAllPage(false)
        if (response.data.success) {
          let exercise  = response.data.data
          Router.push(`/playground?questionID=${exercise['id']}`,`/playground?questionID=${exercise['id']}`)
        }
      })
      .catch((err) => {
        console.log(err)
        setLoadingAllPage(false)
      })
  }

  return (
    <>
     <Header/>
     <div className="container-content">
      <Spin spinning={loadingAllPage}>
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
        <div className="content-right" >
          <Tabs defaultActiveKey= {indexActive} activeKey = {indexActive} type="card" onChange={handleChangeTab}>
            <TabPane tab="Description" key="1">
              <QuestionDescription question={props.question.question} userInfo={props.userInfo} exerciseVote={props.exerciseVote}/>
            </TabPane>
            <TabPane tab="Submissions" key="3">
              <ExerciseSubmissions handleChangeCodeAce={onChange} exerciseID={props.question.question.id} exercise={props.question.question} userInfo={props.userInfo}></ExerciseSubmissions>
            </TabPane>
            <TabPane tab="Discussions" key="4">
              Discussion Here
            </TabPane>
          </Tabs>

          <div className="question-fast-picker" >
            <Button type='default' onClick={() => { Router.push(`/list`) }}>
              <svg viewBox="0 0 24 24" width="1em" height="1em" className="icon__3Su4"><path fillRule="evenodd" d="M7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7zM3 5h2v2H3V5zm0 6h2v2H3v-2zm0 6h2v2H3v-2z"></path></svg>
              <span>Favorite Exercises</span>
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
        <div className="content-left playground-wrapper" >
          { !props.userInfo.id ? (
            <div className="guest-confirm">
              <div>Vui lòng <a className="login-redirect">Đăng nhập</a> để tiếp tục</div>
            </div>) 
          : null}
          <div className="playground-action">
            <div>
              <Select defaultValue={props.language[0].code} style={{ width: 120 }} onSelect={handleChangeLanguage}>
                {props.language && props.language.map((lang, key) => (
                  lang.codeSnippets.length > 0 ? <Option key={key} value={lang.code}>{lang.name}</Option> : null
                ))}
              </Select>
              <Tooltip placement="bottom" title='Reset to default template code'>
                <button type="ghost" className="reset-code" onClick={handleResetTemplateCode}>
                  <span className='indicator'></span>
                  <span style={{ color: 'rgb(176, 190, 197)'}}>Reset</span>
                </button>
              </Tooltip>

            </div>
            
            <SaveOutlined onClick={handleSaveCode} style={{ display: 'flex', alignItems: 'center' }}/>
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
            autoScrollEditorIntoView={false}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true
            }}
          />

          {
            testCasePropsRun ?
            (testCasePropsRun.length == 1 && testCasePropsRun[0].success == false) ?
            <Spin spinning={loading}>
              <div className="console-status" style={ (consoleEditor == 'hide') ? {display: 'none'} : null }>
                <div>Status: {testCasePropsRun[0].data ? testCasePropsRun[0].data.status.description : "Code - 400"}</div>
                <div style={{ whiteSpace: 'pre-wrap' }} 
                  dangerouslySetInnerHTML={{ __html: testCasePropsRun[0].data ? testCasePropsRun[0].data.compile_output ? testCasePropsRun[0].data.compile_output.toString() : testCastestCasePropsRuneProps[0].data.stderr.toString() 
                                          :  (testCasePropsRun[0]?.message?.source_code ? ("Source Code: " + testCasePropsRun[0]?.message?.source_code[0]) : "Something went wrong") }}>                            
              </div>
              </div>
            </Spin>
            :
            <Spin spinning={loading}>
              <Tabs tabPosition="left" type="line"
                style={ (consoleEditor == 'hide') ? {display: 'none'} : null } className="console-status">
                {testCasePropsRun.map((testCase, key) => (
                  <TabPane tab={`Test Case ` + (key + 1)} key={key}>
                    <TestCase testCaseProps={testCase.data || testCase}/>
                  </TabPane>
                ))}
              </Tabs>
            </Spin> 
            :
            (testCaseProps.length == 1 && testCaseProps[0].success == false) ?
            <Spin spinning={loading}>
              <div className="console-status" style={ (consoleEditor == 'hide') ? {display: 'none'} : null }>
                <div>Status: {testCaseProps[0].data ? testCaseProps[0].data.status.description : "Code - 400"}</div>
                <div style={{ whiteSpace: 'pre-wrap' }} 
                  dangerouslySetInnerHTML={{ __html: testCaseProps[0].data ? testCaseProps[0].data.compile_output ? testCaseProps[0].data.compile_output.toString() : testCaseProps[0].data.stderr.toString() 
                                          :  (testCaseProps[0]?.message?.source_code ? ("Source Code: " + testCaseProps[0]?.message?.source_code[0]) : "Something went wrong") }}>                            
              </div>
              </div>
            </Spin>
            :
            <Spin spinning={loading}>
              <Tabs tabPosition="left" type="line"
                style={ (consoleEditor == 'hide') ? {display: 'none'} : null } className="console-status">
                {testCaseProps.map((testCase, key) => (
                  <TabPane tab={`Test Case ` + (key + 1)} key={key}>
                    <TestCase testCaseProps={testCase.data || testCase}/>
                  </TabPane>
                ))}
              </Tabs>
            </Spin> 
          }

          <div className="action-code-editor">
            <Button className="show-console" onClick={handleShowConsole}>
              <span>Console</span>
              <span id='icon-console'>
                <svg viewBox="0 0 24 24" width="1em" height="1em" className="icon__3Su4"><path fillRule="evenodd" d="M7 14l5-5 5 5z"></path></svg>
              </span>
            </Button>
            <div className="action">
              <Button type='primary' onClick={handleRunCode}>Run Code</Button>
              <Button className="submit-code" onClick={handleSubmitCode}>Submit</Button>
            </div>
          </div>
        </div>
      </Split>
      </Spin>
      </div>
    </>
  );
}

Playground.getInitialProps = async function(ctx) {
  let userInfo = ctx.store.getState().auth.userInfo
  let id = ctx.query.questionID
  let urlExercise = `${process.env.API}/api/exercise?id=${id}`
  let urlLanguage = `${process.env.API}/api/language/exercise/${id}`
  let urlVote = `${process.env.API}/api/exercise/vote?userID=${userInfo.id}&questionID=${id}`
  const questionResponse = await axios.get(urlExercise)
  const languageResponse = await axios.get(urlLanguage)
  const exerciseVote = await axios.get(urlVote)

  let tempCode = `${process.env.API}/api/exercise/temp-code?id=${id}&languageID=${languageResponse.data.data[0].id}&userID=${userInfo.id}`
  const temp = await axios.get(tempCode)
  return { 
    question: questionResponse.data, 
    language: languageResponse.data.data,
    exerciseVote: exerciseVote.data.exerciseVote,
    tempCode: temp.data
  }
}

function mapStateToProps(state, ownProps) {
  return {
    userInfo: state.auth.userInfo
  }
}

export default connect(mapStateToProps)(composedAuthHOC(Playground))