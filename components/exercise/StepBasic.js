import { Form, Input, Button, notification, Select, message } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import { useState, useEffect, ReactNode, useReducer, useRef } from 'react';
import ExerciseTags from './ExerciseTags';
import ExerciseLOC from './ExerciseLOC';
import TinymceTextArea from '../TinymceTextArea';
import axios from 'axios';

const StepBasicInfos = ({
  isCreate,
  allTags = [],
  formRef,
  initialValues,
  setBasicInfos,
}) => {
  // min, max LOC slider value
  let [rangeValue, setRangeValue] = useState([1, 100]);

  const setRangePoints = (level) => {
    switch (level) {
      case 'easy':
        setRangeValue([1, 100]);
        break;
      case 'medium':
        setRangeValue([101, 200]);
        break;
      case 'hard':
        setRangeValue([201, 300]);
        break;
    }
  };

  const setDefaultPoints = (level) => {
    switch (level) {
      case 'easy':
        formRef.setFieldsValue({
          points: 1,
        });
        break;
      case 'medium':
        formRef.setFieldsValue({
          points: 101,
        });
        break;
      case 'hard':
        formRef.setFieldsValue({
          points: 201,
        });
        break;
    }
  };

  const onFormValuesChange = (changedValue) => {
    const propName = Object.getOwnPropertyNames(changedValue)[0];
    const propValue = changedValue[propName];
    if (propName === 'level') {
      setRangePoints(propValue);
    }
    setBasicInfos({ ...formRef.getFieldsValue() });
  };

  useEffect(() => {
    setRangePoints(formRef.getFieldValue('level'));
  }, []);

  return (
    <div>
      <Form
        initialValues={initialValues}
        form={formRef}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        scrollToFirstError={true}
        onValuesChange={onFormValuesChange}>
        <Form.Item
          required={isCreate}
          name='title'
          label='Title'
          rules={[
            { required: true, message: `'Title' is required!` },
            {
              type: 'string',
              max: 150,
              message: `'Title' cannot be longer than 150 characters.`,
            },
            {
              type: 'string',
              min: 3,
              message: `'Title' must be at least 3 characters.`,
            },
          ]}>
          <Input />
        </Form.Item>
        <Form.Item
          required={isCreate}
          label='Content'
          name='content'
          rules={[
            { required: true, message: `'Content' is required!` },
            {
              type: 'string',
              max: 5000,
              message: `'Content' cannot be longer than 5000 characters.`,
            },
          ]}>
          <TinymceTextArea />
        </Form.Item>
        <Form.Item name='level' label='Level'>
          <Select
            style={{
              width: '200px',
            }}>
            <Select.Option value='easy'>Easy</Select.Option>
            <Select.Option value='medium'>Medium</Select.Option>
            <Select.Option value='hard'>Hard</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name='points' label='LOC'>
          <ExerciseLOC min={rangeValue[0]} max={rangeValue[1]} />
        </Form.Item>
        <Form.Item name='tags' label='Tags'>
          <ExerciseTags allTags={allTags} />
        </Form.Item>
      </Form>
    </div>
  );
};

export default StepBasicInfos;
