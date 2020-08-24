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
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
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

  let [inputType, setInputType] = useState('editor');
  let [outputType, setOutputType] = useState('editor');

  const runValidate = async () => {
    try {
      await form.validateFields();
      return true;
    } catch (e) {
      notification.info({
        message: 'Check your input again!',
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

  const onReset = () => {
    form.setFieldsValue({
      input: input,
      output: output,
      isHidden: isHidden,
    });
  };

  const onUpload = (file) => {
    console.log({ file });
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
    return () => {
      form = null;
    };
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
              type='primary'
              ghost
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
            style={{
              minHeight: 120,
            }}
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
            rules={[
              { required: true, message: `'Data Input' is required!` },
              {
                type: 'string',
                max: 1000,
                message: `'Data Input' cannot be longer than 1000 characters.`,
              },
            ]}>
            <Input.TextArea rows='3' />
          </Form.Item>
          <Form.Item
            style={{
              minHeight: 120,
            }}
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
            rules={[
              { required: true, message: `'Expected Output' is required!` },
              {
                type: 'string',
                max: 1000,
                message: `'Expected Output' cannot be longer than 1000 characters.`,
              },
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
