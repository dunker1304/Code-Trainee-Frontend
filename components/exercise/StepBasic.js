import { Form, Input, Button, notification, Select } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import { useState, useEffect, ReactNode, useReducer, useRef } from 'react';
import ExerciseTags from './ExerciseTags';
import ExerciseLOC from './ExerciseLOC';
import ExerciseContent from './ExerciseContent';
import axios from 'axios';

const StepBasicInfos = ({
  basicInfos,
  setBasicInfos = () => {},
  exerciseId = 0,
  setExerciseId = () => {},
  currUserId = 0,
  isCreate = true,
  isDoneLoadOldInfos = false,
  next = () => {},
}) => {
  let [formRef] = Form.useForm();
  let [initialValues, setInitialValues] = useState({ ...basicInfos });
  // button next's loading
  let [loading, setLoading] = useState(false);
  // min, max LOC slider value
  let [rangeValue, setRangeValue] = useState([0, 100]);

  const setRangePoints = (level) => {
    switch (level) {
      case 'easy':
        setRangeValue([0, 100]);
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
          points: 0,
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

  const handleNext = async () => {
    setLoading(true);
    try {
      await formRef.validateFields();
    } catch (e) {
      notification.error({
        message: 'Infomation',
        description: 'Please check your input again!',
      });
      setLoading(false);
      return;
    }
    try {
      let { content, title, points, level, tags } = formRef.getFieldsValue();
      let res;
      if (isCreate) {
        res = await axios.post(`${process.env.API}/api/exercise/create`, {
          createdBy: currUserId,
          content: content,
          title: title,
          points: Number(points),
          level: level,
          tags: tags,
        });
      } else {
        res = await axios.post(`${process.env.API}/api/exercise/update`, {
          id: exerciseId,
          content: content,
          title: title,
          points: Number(points),
          level: level,
          tags: tags,
        });
      }
      setLoading(false);
      if (res.data.success) {
        setExerciseId(res.data.data.id);
        setBasicInfos(formRef.getFieldsValue());
        next();
      } else {
        throw new Error('');
      }
    } catch (e) {
      setLoading(false);
      notification.error({
        message: 'Notification',
        description: 'Something get wrong!',
      });
      console.log(e);
    }
  };

  useEffect(() => {
    setRangePoints(basicInfos.level);
    setInitialValues({ ...basicInfos });
    formRef.setFieldsValue({ ...basicInfos });
  }, [basicInfos]);

  useEffect(() => {
    let { level } = formRef.getFieldsValue();
    setDefaultPoints(level);
  }, [rangeValue]);

  useEffect(() => {
    formRef.resetFields(['points']);
  }, [initialValues]);

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
          <ExerciseLOC min={rangeValue[0]} max={rangeValue[1]} />
        </Form.Item>
        <Form.Item name='tags' label='Tags'>
          <ExerciseTags />
        </Form.Item>
      </Form>
      <div
        className='step-actions'
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '50px',
        }}>
        <Button
          onClick={handleNext}
          loading={loading}
          type='primary'
          size='large'
          style={{
            width: 100,
          }}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default StepBasicInfos;
