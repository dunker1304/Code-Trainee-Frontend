import {
  Form,
  Input,
  Button,
  Select,
  notification,
  AutoComplete,
  Tag,
  Tooltip,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ConfirmModal from '../ConfirmModal';
import ExerciseTags from './ExerciseTags';
import ExerciseLOC from './ExerciseLOC';

const StepBasic = ({
  exerciseId = {
    value,
    setValue: () => {},
  },
  checkDirtyBeforeLeaving = {
    value,
    setValue: () => {},
  },
  dirty = {
    value,
    setValue: () => {},
  },
  nextStep = () => {},
}) => {
  let [visibleConfirm, setVisibleConfirm] = useState(false);
  let [buttonLoading, setButtonLoading] = useState(false);
  let [formRef] = Form.useForm();
  let [initFormValues, setInitFormValues] = useState({
    title: '',
    content: '',
    points: 0,
    level: 'easy',
    tags: ['#'],
  });
  let [allTags, setAllTags] = useState([]);
  let [minSliderValue, setMinSliderValue] = useState(0);
  let [maxSliderValue, setMaxSliderValue] = useState(100);

  // run only one when component mounted
  useEffect(() => {
    (async () => {
      // get old information to update
      if (exerciseId.value) {
        try {
          const res = await axios.get(
            `${process.env.API}/api/exercise/basic-info/${exerciseId.value}`
          );
          if (res.data.success) {
            let tags = res.data.data.tags.map((e) => e.name);
            setInitFormValues({
              title: res.data.data.title,
              content: res.data.data.content,
              points: res.data.data.points,
              level: res.data.data.level,
              tags: tags,
            });
          } else {
            console.log('get basic-info data fail');
          }
        } catch (e) {
          console.log(e);
        }
      }
    })();
    (async () => {
      // get all tags
      try {
        const res = await axios.get(`${process.env.API}/api/tags/all`);
        if (res.data.success) {
          setAllTags([...res.data.data.map((e) => e.name)]);
        } else {
          console.log('get tags data fail');
        }
      } catch (e) {
        console.log(e);
      }
    })();

    return () => {
      // run when component dis-mounted
      dirty.setValue(false);
      checkDirtyBeforeLeaving.setValue(false);
    };
  }, []);

  useEffect(() => {
    // init value for form
    setRangeSlider(initFormValues.level);
    formRef.setFieldsValue(initFormValues);
  }, [initFormValues]);

  useEffect(() => {
    if (dirty.value && checkDirtyBeforeLeaving.value) {
      setVisibleConfirm(true);
    }
  }, [checkDirtyBeforeLeaving.value]);

  const arraysEqual = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };
  const checkDirty = (oldValue, currValue) => {
    console.log('checkDirty', { oldValue, currValue });
    if (
      oldValue.title !== currValue.title ||
      oldValue.content !== currValue.content ||
      oldValue.points !== currValue.points ||
      oldValue.level !== currValue.level ||
      !arraysEqual(oldValue.tags, currValue.tags)
    ) {
      dirty.setValue(true);
    } else {
      dirty.setValue(false);
    }
  };

  const handleCreate = async () => {
    try {
      setButtonLoading(true);
      await formRef.validateFields();
      let { content, title, points, level, tags } = formRef.getFieldsValue();
      const res = await axios.post(`${process.env.API}/api/exercise/create`, {
        content: content,
        title: title,
        points: Number(points),
        level: level,
        tags: tags,
      });
      setButtonLoading(false);
      if (res.data.success) {
        notification.info({
          message: 'Notification',
          description: 'Success!',
        });
        exerciseId.setValue(res.data.data.id);
        dirty.setValue(false);
        checkDirtyBeforeLeaving.setValue(false);
        nextStep();
      } else {
        notification.error({
          message: 'Notification',
          description: 'Failed!',
        });
      }
    } catch (e) {
      setButtonLoading(false);
      notification.warning({
        message: 'Notification',
        description: 'Check your input again!',
      });
    }
  };

  const handleUpdate = async (onSuccess = () => {}) => {
    try {
      setButtonLoading(true);
      await formRef.validateFields();
      let { content, title, points, level, tags } = formRef.getFieldsValue();
      const res = await axios.post(`${process.env.API}/api/exercise/update`, {
        id: exerciseId.value,
        content: content,
        title: title,
        points: Number(points),
        level: level,
        tags: tags,
      });
      setButtonLoading(false);
      if (res.data.success) {
        notification.info({
          message: 'Notification',
          description: 'Success!',
        });
        onSuccess();
      } else {
        notification.error({
          message: 'Notification',
          description: 'Fail!',
        });
      }
    } catch (e) {
      setButtonLoading(false);
      notification.warning({
        message: 'Notification',
        description: 'Check your input again!',
      });
    }
  };

  const onOkConfirm = async () => {
    handleUpdate(() => {
      checkDirtyBeforeLeaving.setValue(false);
      dirty.setValue(false);
      setVisibleConfirm(false);
      nextStep();
    });
  };

  const onCancelConfirm = async () => {
    setVisibleConfirm(false);
    checkDirtyBeforeLeaving.setValue(false);
    dirty.setValue(false);
    nextStep();
  };

  const onCancelXConfirm = async () => {
    checkDirtyBeforeLeaving.setValue(false);
    setVisibleConfirm(false);
  };

  const setRangeSlider = (value) => {
    if (value === 'easy') {
      setMinSliderValue(0);
      setMaxSliderValue(100);
      formRef.setFieldsValue({
        points: '100',
      });
    } else if (value === 'medium') {
      setMinSliderValue(101);
      setMaxSliderValue(200);
      formRef.setFieldsValue({
        points: '200',
      });
    } else {
      // hard
      setMinSliderValue(201);
      setMaxSliderValue(300);
      formRef.setFieldsValue({
        points: '300',
      });
    }
  };

  return (
    <>
      <Form
        form={formRef}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        validateMessages={{
          required: "'${label}' is required!",
        }}
        scrollToFirstError={true}
        initialValues={initFormValues}
        onValuesChange={(changedValue, allValues) =>
          checkDirty(initFormValues, allValues)
        }>
        <Form.Item name='title' label='Title' rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name='content'
          label='Content'
          rules={[{ required: true }]}
          trigger='onEditorChange'
          validateTrigger='onEditorChange'>
          <Editor
            id='exercise-content'
            init={{
              height: 300,
              menubar: false,
              plugins: [
                'advlist autolink lists link preview',
                'searchreplace visualblocks fullscreen codesample',
                'table paste code',
              ],
              toolbar:
                'undo redo | fontselect fontsizeselect formatselect | bold italic underline strikethrough | \
forecolor backcolor | alignleft aligncenter alignright alignjustify | \
 bullist numlist outdent indent | table link  codesample | code | fullscreen preview',
              content_css: '//www.tiny.cloud/css/codepen.min.css',
              importcss_append: true,
              quickbars_selection_toolbar:
                'bold italic | quicklink h2 h3 blockquote quicktable',
              toolbar_mode: 'sliding',
              contextmenu: 'link table configurepermanentpen',
            }}
          />
        </Form.Item>
        <Form.Item name='level' label='Level' rules={[{ required: true }]}>
          <Select onChange={setRangeSlider}>
            <Select.Option value='easy'>Easy</Select.Option>
            <Select.Option value='medium'>Medium</Select.Option>
            <Select.Option value='hard'>Hard</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name='points' label='LOC' rules={[{ required: true }]}>
          <ExerciseLOC minValue={minSliderValue} maxValue={maxSliderValue} />
        </Form.Item>
        <Form.Item
          name='tags'
          label='Tags'
          valuePropName='tags'
          trigger='setTags'>
          <ExerciseTags allTags={allTags} />
        </Form.Item>
        <Form.Item>
          {!exerciseId.value ? (
            <Button
              type='primary'
              size='large'
              loading={buttonLoading}
              onClick={handleCreate}>
              Save and Next
            </Button>
          ) : (
            <Button
              type='primary'
              size='large'
              loading={buttonLoading}
              onClick={() =>
                handleUpdate(() => {
                  dirty.setValue(false);
                  checkDirtyBeforeLeaving.setValue(false);
                  nextStep();
                })
              }>
              Update and Next
            </Button>
          )}
        </Form.Item>
      </Form>
      <ConfirmModal
        okText='Save'
        cancelText='Discard'
        visible={visibleConfirm}
        title='Save Changes?'
        content='You have unsaved changes. Would you like to save them before leaving this page?'
        onCancelX={onCancelXConfirm}
        onOk={onOkConfirm}
        onCancel={onCancelConfirm}
      />
    </>
  );
};

export default StepBasic;
