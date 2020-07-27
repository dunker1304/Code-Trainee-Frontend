import {
  Modal,
  Button,
  Form,
  Input,
  Radio,
  Upload,
  notification,
  Checkbox,
  Popconfirm,
} from 'antd';
import React, { useState, useEffect, Row, useRef } from 'react';
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
  isCreate = true,
}) => {
  let [loading, setLoading] = useState(false);
  let [form] = Form.useForm();
  let firstRun = useRef(true);

  const runValidate = async () => {
    try {
      await form.validateFields();
      return true;
    } catch (e) {
      notification.info({
        message: 'Warning',
        description: 'Check your input again!',
      });
      return false;
    }
  };

  const handleOK = async () => {
    setLoading(true);
    if (await runValidate()) {
      await onOK(form.getFieldsValue());
      onCancel();
    }
    setLoading(false);
  };

  const hanldeCancelX = () => {
    onCancelX();
  };

  const hanldeCancel = () => {
    onCancel();
  };

  const validateRequire = (label) => ({
    validator(rule, value) {
      return !value
        ? Promise.reject(`'${label}' is required!`)
        : Promise.resolve();
    },
  });

  const onReset = () => {
    form.setFieldsValue({
      input: input,
      output: output,
      isHidden: isHidden,
    });
  };

  useEffect(() => {
    visible &&
      form.setFieldsValue({
        input: input,
        output: output,
        isHidden: isHidden,
      });
    !visible &&
      form.setFieldsValue({
        input: '',
        output: '',
        isHidden: false,
      });
  }, [visible]);

  return (
    <React.Fragment>
      <Modal
        className='test-case-model'
        title={title}
        visible={visible}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={hanldeCancelX}
        footer={
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}>
            <Button
              style={{
                width: '100px',
              }}
              size='large'
              onClick={onReset}
              disabled={loading}>
              Reset
            </Button>
            <div>
              <Button
                style={{
                  width: '100px',
                }}
                type='primary'
                size='large'
                danger
                onClick={hanldeCancel}
                disabled={loading}>
                {cancelText}
              </Button>
              <Button
                style={{
                  width: '100px',
                }}
                type='primary'
                size='large'
                onClick={handleOK}
                loading={loading}>
                {okText}
              </Button>
            </div>
          </div>
        }>
        <Form form={form} layout='vertical'>
          <Form.Item
            required={isCreate}
            name='input'
            label={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                <div
                  style={{
                    display: 'flex',
                    alignSelf: 'center',
                  }}>
                  Data Input
                </div>
                <Radio.Group defaultValue='editor'>
                  <Radio.Button value='editor'>editor</Radio.Button>
                  <Radio.Button value='upload'>upload</Radio.Button>
                </Radio.Group>
              </div>
            }
            initialValue={input}
            rules={[validateRequire('Data Input')]}>
            <Input.TextArea rows='3' />
          </Form.Item>
          <Form.Item
            required={isCreate}
            name='output'
            label={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                <div
                  style={{
                    display: 'flex',
                    alignSelf: 'center',
                  }}>
                  Expected Output
                </div>
                <Radio.Group defaultValue='editor'>
                  <Radio.Button value='editor'>editor</Radio.Button>
                  <Radio.Button value='upload'>upload</Radio.Button>
                </Radio.Group>
              </div>
            }
            initialValue={output}
            rules={[validateRequire('Expected Output')]}>
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
