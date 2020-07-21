import { Form, Input, Button, Select, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ConfirmModal from '../ConfirmModal';
import ExerciseTags from './ExerciseTags';
import ExerciseLOC from './ExerciseLOC';
import ExerciseLevel from './ExerciseLevel';

const StepBasic = ({
  exerciseId,
  setExerciseId = () => {},
  checkDirtyBeforeLeaving = false,
  setCheckDirtyBeforeLeaving = () => {},
  dirty = false,
  setDirty = () => {},
  nextStep = () => {},
}) => {
  // visible of comfirm modal
  let [visibleConfirm, setVisibleConfirm] = useState(false);
  // loading state
  let [buttonLoading, setButtonLoading] = useState(false);
  // form instance
  let [formRef] = Form.useForm();
  // init data of form
  let [initFormValues, setInitFormValues] = useState({
    title: '',
    content: '',
    points: 0,
    level: 'easy',
    tags: ['#'],
  });
  // all tags from DB
  let [allTags, setAllTags] = useState([]);
  // min, max LOC slider
  let [minSliderValue, setMinSliderValue] = useState(0);
  let [maxSliderValue, setMaxSliderValue] = useState(100);

  // run only one when component mounted
  useEffect(() => {
    (async () => {
      // get old information to update
      if (exerciseId) {
        try {
          const res = await axios.get(
            `${process.env.API}/api/exercise/basic-info/${exerciseId}`
          );
          if (res.data.success) {
            setRangeSlider(res.data.data.level);
            let tags = res.data.data.tags.map((e) => e.name);
            setInitFormValues({
              title: res.data.data.title,
              content: res.data.data.content,
              points: res.data.data.points,
              level: res.data.data.level,
              tags: tags,
            });
            formRef.setFieldsValue({
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
      setDirty(false);
      setCheckDirtyBeforeLeaving(false);
    };
  }, []);

  useEffect(() => {
    dirty && checkDirtyBeforeLeaving && setVisibleConfirm(true);
  }, [checkDirtyBeforeLeaving]);

  const arraysEqual = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  const onValuesChange = (changedValue) => {
    console.log('changed value', changedValue);
    const prop = Object.getOwnPropertyNames(changedValue)[0];
    if (prop === 'tags') {
      setDirty(!arraysEqual(changedValue[prop], initFormValues[prop]));
    } else {
      setDirty(changedValue[prop] !== initFormValues[prop]);
    }
    if (prop === 'level') {
      setRangeSlider(changedValue[prop]);
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
        setExerciseId(res.data.data.id);
        setDirty(false);
        setCheckDirtyBeforeLeaving(false);
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
    // try {
    //   setButtonLoading(true);
    //   await formRef.validateFields();
    //   let { content, title, points, level, tags } = formRef.getFieldsValue();
    //   const res = await axios.post(`${process.env.API}/api/exercise/update`, {
    //     id: exerciseId,
    //     content: content,
    //     title: title,
    //     points: Number(points),
    //     level: level,
    //     tags: tags,
    //   });
    //   setButtonLoading(false);
    //   if (res.data.success) {
    //     notification.info({
    //       message: 'Notification',
    //       description: 'Success!',
    //     });
    //     onSuccess();
    //   } else {
    //     notification.error({
    //       message: 'Notification',
    //       description: 'Fail!',
    //     });
    //   }
    // } catch (e) {
    //   setButtonLoading(false);
    //   notification.warning({
    //     message: 'Notification',
    //     description: 'Check your input again!',
    //   });
    // }
    console.log('form', formRef.getFieldsValue().points);
  };

  const onOkConfirm = async () => {
    handleUpdate(() => {
      setCheckDirtyBeforeLeaving(false);
      setDirty(false);
      setVisibleConfirm(false);
      nextStep();
    });
  };

  const onCancelConfirm = async () => {
    setVisibleConfirm(false);
    setCheckDirtyBeforeLeaving(false);
    setDirty(false);
    nextStep();
  };

  const onCancelXConfirm = async () => {
    setCheckDirtyBeforeLeaving(false);
    setVisibleConfirm(false);
  };

  const setRangeSlider = (level) => {
    console.log('level', level);
    if (level === 'easy') {
      setMinSliderValue(0);
      setMaxSliderValue(100);
      formRef.setFieldsValue({
        points: 0,
      });
    } else if (level === 'medium') {
      setMinSliderValue(101);
      setMaxSliderValue(200);
      formRef.setFieldsValue({
        points: 101,
      });
    } else {
      setMinSliderValue(201);
      setMaxSliderValue(300);
      formRef.setFieldsValue({
        points: 201,
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
        onValuesChange={onValuesChange}>
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
          <ExerciseLevel min={minSliderValue} max={maxSliderValue} />
        </Form.Item>
        <Form.Item name='points' label='LOC' rules={[{ required: true }]}>
          <ExerciseLOC min={minSliderValue} max={maxSliderValue} />
        </Form.Item>
        <Form.Item
          name='tags'
          label='Tags'
          valuePropName='tags'
          trigger='setTags'>
          <ExerciseTags allTags={allTags} />
        </Form.Item>
        <Form.Item>
          {!exerciseId ? (
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
                  setDirty(false);
                  setCheckDirtyBeforeLeaving(false);
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
