import {
  Modal,
  Button,
  Form,
  Input,
  Radio,
  Upload,
  notification,
  Checkbox,
} from 'antd';
import React, { useState, useEffect, Row } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';

const TestCaseModal = ({
  input = '',
  output = '',
  isHidden = false,
  title = 'Title',
  cancelText = 'Cancel',
  okText = 'Save',
  visible = false,
  onCancelX = () => {},
  onCancel = () => {},
  onOK = async (value) => {},
}) => {
  let [loading, setLoading] = useState(false);
  let [form] = Form.useForm();
  const handleOK = async () => {
    try {
      await form.validateFields();
    } catch (e) {
      notification.warning({
        message: 'Warning',
        description: <p>Check your input again.</p>,
      });
      return;
    }
    setLoading(true);
    await onOK(form.getFieldsValue());
    setLoading(false);
  };
  return (
    <React.Fragment>
      <Modal
        className='add-test-case-model'
        title={title}
        visible={visible}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={onCancelX}
        footer={
          <React.Fragment>
            <Button type='primary' danger onClick={onCancel} disabled={loading}>
              {cancelText}
            </Button>
            <Button type='primary' onClick={handleOK} loading={loading}>
              {okText}
            </Button>
          </React.Fragment>
        }>
        <Form form={form} layout='vertical'>
          <Form.Item
            name='input'
            label={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                <div>Data Input</div>
                <Radio.Group defaultValue='editor'>
                  <Radio.Button value='editor'>editor</Radio.Button>
                  <Radio.Button value='upload'>upload</Radio.Button>
                </Radio.Group>
              </div>
            }
            initialValue={input}
            rules={[{ required: true, message: "'Data Input' is required!" }]}>
            <Input.TextArea rows='3' />
          </Form.Item>
          <Form.Item
            name='output'
            label={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                <div>Expected Output</div>
                <Radio.Group defaultValue='editor'>
                  <Radio.Button value='editor'>editor</Radio.Button>
                  <Radio.Button value='upload'>upload</Radio.Button>
                </Radio.Group>
              </div>
            }
            initialValue={output}
            rules={[
              { required: true, message: "'Expected Output' is required!" },
            ]}>
            <Input.TextArea rows='3' />
          </Form.Item>
          <Form.Item
            name='isHidden'
            valuePropName='checked'
            initialValue={isHidden}>
            <Checkbox>Hide Test Case</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  );
};
export default TestCaseModal;
