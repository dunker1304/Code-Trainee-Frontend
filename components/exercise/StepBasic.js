import { Form, Input, Button, Select, notification } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ConfirmModal from '../ConfirmModal';

const StepBasic = ({
  exerciseId = {
    value,
    setValue: (value) => {},
  },
  checkDirtyBeforeLeaving = {
    value,
    setValue: (value) => {},
  },
  dirty = {
    value,
    setValue: (value) => {},
  },
  nextStep = () => {},
}) => {
  let [visibleConfirm, setVisibleConfirm] = useState(false);
  let [buttonLoading, setButtonLoading] = useState(false);
  let [form] = Form.useForm();
  let [initialValues, setInitialValues] = useState({
    title: '',
    content: '',
    points: 0,
    level: 'easy',
  });

  // run only one when component mounted
  useEffect(() => {
    (async () => {
      if (exerciseId.value) {
        try {
          const res = await axios.get(
            `http://localhost:1337/api/exercise/basic-info?id=${exerciseId.value}`
          );
          if (res.data.success) {
            form.setFieldsValue({
              title: res.data.data.title,
              content: res.data.data.content,
              points: res.data.data.points,
              level: res.data.data.level,
            });
            setInitialValues({
              title: res.data.data.title,
              content: res.data.data.content,
              points: res.data.data.points,
              level: res.data.data.level,
            });
          }
        } catch (e) {
          console.log(e);
        }
      }
    })();
    return () => {};
  }, []);

  useEffect(() => {
    if (dirty.value && checkDirtyBeforeLeaving.value) {
      setVisibleConfirm(true);
    }
  }, [checkDirtyBeforeLeaving.value]);

  const checkDirty = (oldValue, currValue) => {
    if (
      oldValue.title !== currValue.title ||
      oldValue.content !== currValue.content ||
      oldValue.points !== currValue.points ||
      oldValue.level !== currValue.level
    ) {
      dirty.setValue(true);
    } else {
      dirty.setValue(false);
    }
  };

  const handleCreate = async (onSuccess = () => {}) => {
    try {
      setButtonLoading(true);
      await form.validateFields();
      let { content, title, points, level } = form.getFieldsValue();
      const res = await axios.post(
        `http://localhost:1337/api/exercise/create`,
        {
          content: content,
          title: title,
          points: Number(points),
          level: level,
        }
      );
      setButtonLoading(false);
      if (res.data.success) {
        notification.info({
          message: 'Notification',
          description: <p>Success!</p>,
        });

        onSuccess();
      } else {
        notification.error({
          message: 'Notification',
          description: <p>Failed!</p>,
        });
      }
    } catch (e) {
      setButtonLoading(false);
      notification.warning({
        message: 'Notification',
        description: <p>Check your input again!</p>,
      });
    }
  };

  const handleUpdate = async (onSuccess = () => {}) => {
    try {
      setButtonLoading(true);
      await form.validateFields();
      let { content, title, points, level } = form.getFieldsValue();
      const res = await axios.post(
        `http://localhost:1337/api/exercise/update`,
        {
          id: exerciseId.value,
          content: content,
          title: title,
          points: Number(points),
          level: level,
        }
      );
      setButtonLoading(false);
      if (res.data.success) {
        notification.info({
          message: 'Notification',
          description: <p>Success!</p>,
        });
        onSuccess();
      } else {
        notification.error({
          message: 'Notification',
          description: <p>Failed!</p>,
        });
      }
    } catch (e) {
      setButtonLoading(false);
      notification.warning({
        message: 'Notification',
        description: <p>Check your input again!</p>,
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

  return (
    <>
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        validateMessages={{
          required: "'${label}' is required!",
        }}
        scrollToFirstError={true}
        initialValues={initialValues}
        onValuesChange={(changedValue, allValues) =>
          checkDirty(initialValues, allValues)
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
                'table paste code wordcount',
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
        <Form.Item name='points' label='LOC' rules={[{ required: true }]}>
          <Input type='number' />
        </Form.Item>
        <Form.Item name='level' label='Level' rules={[{ required: true }]}>
          <Select>
            <Select.Option value='easy'>Easy</Select.Option>
            <Select.Option value='medium'>Medium</Select.Option>
            <Select.Option value='hard'>Hard</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          {!exerciseId.value ? (
            <Button
              type='primary'
              size='large'
              loading={buttonLoading}
              onClick={() =>
                handleCreate(() => {
                  exerciseId.setValue(res.data.data.id);
                  dirty.setValue(false);
                  checkDirtyBeforeLeaving.setValue(false);
                  nextStep();
                })
              }>
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
