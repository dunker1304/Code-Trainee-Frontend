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
  Tooltip,
} from 'antd';
import React, { useState, useEffect, Row, useRef } from 'react';
import {
  InboxOutlined,
  UploadOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const FileItemContent = ({ type = 'editor', value, onChange }) => {
  return (
    <>
      {type === 'editor' && (
        <Input.TextArea rows='3' value={value} onChange={onChange} />
      )}
      {type === 'upload' && <UploadSection onChange={onChange} value={value} />}
    </>
  );
};

const UploadSection = ({ value, onChange }) => {
  const [files, setFiles] = useState([]);

  const handleChange = ({ file, fileList }) => {
    if (file.status === 'removed') {
      setFiles([]);
      onChange('');
    } else {
      const isTxt = file.type === 'text/plain';
      const isLessThan3M = file.size / 1024 / 1024 < 3;
      if (files.length !== 0) {
        notification.error({ message: 'You can upload ONE file only!' });
      } else if (file.size === 0) {
        notification.error({ message: 'File cannot be empty!' });
      } else if (!isTxt) {
        notification.error({ message: 'You can only upload .txt file!' });
      } else if (!isLessThan3M) {
        notification.error({ message: 'File must smaller than 3MB!' });
      } else {
        setFiles(fileList);
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          onChange(reader.result);
        });
        reader.readAsText(file, 'utf-8');
      }
    }
  };
  const beforeUpload = (file) => {
    // return false mean 'file' will be read at client only
    return false;
  };
  useEffect(() => {
    if (value === '') {
      setFiles([]);
    }
  }, [value]);
  return (
    <Upload
      accept={`.txt`}
      multiple={false}
      fileList={files}
      beforeUpload={beforeUpload}
      onChange={handleChange}>
      <Button icon={<UploadOutlined />}>Click to Upload</Button>
      <Tooltip title={`Only accept .txt file`}>
        <QuestionCircleOutlined style={{ fontSize: 16, marginLeft: 16 }} />
      </Tooltip>
    </Upload>
  );
};

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
    if (inputType === 'editor') {
      form.setFieldsValue({
        input: input,
      });
    } else {
      form.setFieldsValue({
        input: '',
      });
    }
    if (outputType === 'editor') {
      form.setFieldsValue({
        output: output,
      });
    } else {
      form.setFieldsValue({
        output: '',
      });
    }
    form.setFieldsValue({
      isHidden: isHidden,
    });
  };

  const changeInputMethod = (item, type) => {
    if (item === 'input') {
      setInputType(type);
      form.setFieldsValue({
        input: '',
      });
    }
    if (item === 'output') {
      setOutputType(type);
      form.setFieldsValue({
        output: '',
      });
    }
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
    !visible && setInputType('editor');
    !visible && setOutputType('editor');
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
        style={{ marginTop: -40 }}
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
                <Radio.Group
                  defaultValue='editor'
                  onChange={(e) => changeInputMethod('input', e.target.value)}>
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
            <FileItemContent type={inputType} />
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
                <Radio.Group
                  defaultValue='editor'
                  onChange={(e) => changeInputMethod('output', e.target.value)}>
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
            <FileItemContent type={outputType} />
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
