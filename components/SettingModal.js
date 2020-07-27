import React, { useState, useEffect } from 'react'
import { Modal, Button, Row, Col, Select } from 'antd'

const { Option } = Select

const SettingModal = props => {
  const [visible, setVisible] = useState(false)
  const showModal = () => {
    setVisible(true)
  }

  const handleOk = () => {
    setVisible(false)
  }

  const handleCancel = () => {
    setVisible(false)
  }

  const onChangeFontSize = (fontSize) => {
    props.handleChangeSettingFontSize(fontSize)
  }

  const onChangeTheme = (theme) => {
    props.handleChangeSettingTheme(theme)
  }

  const onChangeTabSize = (tabSize) => {
    props.handleChangeSettingTabSize(tabSize)
  }

  const onChangeKeyboardHandler = (handler) => {
    props.handleChangeSettingKeyboardHandler(handler)
  }

  const onChangeShowGutter = (gutter) => {
    props.handleChangeSettingGutter(gutter)
  }

  return (
    <>
      <Button type="primary" onClick={showModal} style={{'display': 'flex', 'alignItems': 'center'}}>
        <span className="icon iconfont" style={{'marginRight': '5px'}}>&#xe600;</span>
        Setting
      </Button>
      <Modal
        title="Editor Settings"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        className='settings-editor-modal'
      >
        <Row>
          <Col span={16}>
            <div className="setting-title">Font Size</div>
            <div className="setting-description">Choose your preferred font size for the code editor.</div>
          </Col>
          <Col span={8}>
            <div className="setting-select">
            <Select defaultValue="14" style={{ width: 120 }} onChange={onChangeFontSize}>
              <Option value="12">12px</Option>
              <Option value="13">13px</Option>
              <Option value="14">14px</Option>
              <Option value="15">15px</Option>
              <Option value="16">16px</Option>
            </Select>
            </div>
          </Col>
        </Row>

        <Row>
          <Col span={16}>
            <div className="setting-title">Theme</div>
            <div className="setting-description">Tired of the white background? Try different styles and syntax highlighting.</div>
          </Col>
          <Col span={8}>
            <div className="setting-select">
            <Select defaultValue="monokai" style={{ width: 120 }} onChange={onChangeTheme}>
              <Option value="monokai">Monokai</Option>
              <Option value="github">Github</Option>
              <Option value="tomorrow">Tomorrow</Option>
              <Option value="kuroir">Kuroir</Option>
              <Option value="twilight">Twilight</Option>
              <Option value="xcode">Xcode</Option>
              <Option value="textmate">Textmate</Option>
              <Option value="solarized_dark">Solarized Dark</Option>
              <Option value="solarized_light">Solarized Light</Option>
              <Option value="terminal">Terminal</Option>
            </Select>
            </div>
          </Col>
        </Row>

        <Row>
          <Col span={16}>
            <div className="setting-title">Tab Size</div>
            <div className="setting-description">Choose the width of a tab character.</div>
          </Col>
          <Col span={8}>
            <div className="setting-select">
            <Select defaultValue="2" style={{ width: 120 }} onChange={onChangeTabSize}>
              <Option value="2">2 spaces</Option>
              <Option value="4">4 spaces</Option>
              <Option value="8">8 spaces</Option>
            </Select>
            </div>
          </Col>
        </Row>

        <Row>
          <Col span={16}>
            <div className="setting-title">Key Binding</div>
            <div className="setting-description">Want to practice Vim or Emacs? We have these key binding options available for you.</div>
          </Col>
          <Col span={8}>
            <div className="setting-select">
            <Select defaultValue="default" style={{ width: 120 }} onChange={onChangeKeyboardHandler}>
              <Option value="default">Default</Option>
              <Option value="vim">Vim</Option>
              <Option value="emacs">Emacs</Option>
            </Select>
            </div>
          </Col>
        </Row>

        <Row>
          <Col span={16}>
            <div className="setting-title">Show Gutter</div>
            <div className="setting-description">Want to practice Vim or Emacs? We have these key binding options available for you.</div>
          </Col>
          <Col span={8}>
            <div className="setting-select">
            <Select defaultValue="true" style={{ width: 120 }} onChange={onChangeShowGutter}>
              <Option value="true">Yes</Option>
              <Option value="false">No</Option>
            </Select>
            </div>
          </Col>
        </Row>
      </Modal>
    </>
  )
}

export default SettingModal