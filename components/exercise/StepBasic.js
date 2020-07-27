import { Form, Input, Button, Select } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import { useState, useEffect, ReactNode, useReducer, useRef } from 'react';
import ExerciseTags from './ExerciseTags';
import ExerciseLOC from './ExerciseLOC';
import ExerciseContent from './ExerciseContent';

const StepBasicInfos = ({ formRef, isCreate = true }) => {
  let initialValues = {
    title: '',
    content: '',
    level: 'easy',
    points: 0,
    tags: ['#'],
  };
  // min, max LOC slider value
  let [minValue, setMinValue] = useState(0);
  let [maxValue, setMaxValue] = useState(100);

  const setRangePoints = (level) => {
    if (level === 'easy') {
      setMinValue(0);
      setMaxValue(100);
      formRef.setFieldsValue({
        points: 0,
      });
    } else if (level === 'medium') {
      setMinValue(101);
      setMaxValue(200);
      formRef.setFieldsValue({
        points: 101,
      });
    } else {
      // level 'hard' case
      setMinValue(201);
      setMaxValue(300);
      formRef.setFieldsValue({
        points: 201,
      });
    }
  };
  const onFormValuesChange = (changedValue) => {
    const propName = Object.getOwnPropertyNames(changedValue)[0];
    const propValue = changedValue[propName];
    if (propName === 'level') {
      setRangePoints(propValue);
    }
  };

  const validateRequire = (label) => ({
    transform: (value) => {
      return value === null ? '' : value + '';
    },
    validator(rule, value) {
      return !value
        ? Promise.reject(`'${label}' is required!`)
        : Promise.resolve();
    },
  });

  return (
    <div>
      <Form
        form={formRef}
        initialValues={initialValues}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        scrollToFirstError={true}
        onValuesChange={onFormValuesChange}>
        <Form.Item
          required={isCreate}
          name='title'
          label='Title'
          rules={[validateRequire('Title')]}>
          <Input />
        </Form.Item>
        <Form.Item
          required={isCreate}
          label='Content'
          name='content'
          rules={[validateRequire('Content')]}>
          <ExerciseContent />
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
        <Form.Item
          name='points'
          label='LOC'
          required={isCreate}
          rules={[validateRequire('LOC')]}>
          <ExerciseLOC min={minValue} max={maxValue} />
        </Form.Item>
        <Form.Item name='tags' label='Tags'>
          <ExerciseTags />
        </Form.Item>
      </Form>
    </div>
  );
};

export default StepBasicInfos;
