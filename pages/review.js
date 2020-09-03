import Header from '../components/Header';
import Footer from '../components/Footer';
import ConfirmModal from '../components/ConfirmModal';
import {
  Form,
  Input,
  Button,
  Tabs,
  Descriptions,
  Row,
  Collapse,
  notification,
} from 'antd';
import { useForm } from 'antd/lib/form/util';
import { useReducer, useRef, useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import TinymceTextArea from '../components/TinymceTextArea';
import ReviewStepBasic from '../components/review/ReviewStepBasic';
import ReviewStepSnippet from '../components/review/ReviewStepSnippet';
import ReviewStepTestcase from '../components/review/ReviewStepTestcase';
import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head';
import composedAuthHOC from 'hocs';
import Error404 from './error/404';
import Error500 from './error/500';
import Error403 from './error/403';

const ReviewExercise = ({
  exerciseId,
  userInfo,
  isSelfReview,
  exerciseInfos,
  requestId,
  errorCode,
}) => {
  let currUserId = userInfo ? userInfo.id : 0;
  let [exercise, setExercise] = useState(exerciseInfos);
  let router = useRouter();
  // show confirm modal
  let [confirm, setConfirm] = useState(false);
  // modal attribute
  let [modal, setModal] = useState({
    title: '',
    okText: '',
    cancelText: '',
    onOk: () => {},
  });
  // comment of reviewer
  let [form] = useForm();

  if (errorCode === 404) {
    return <Error404 />;
  } else if (errorCode === 500) {
    return <Error500 />;
  } else if (errorCode === 403) {
    return <Error403 />;
  }

  // click on button reject
  const onReject = () => {
    setModal({
      title: 'Reject this exercise?',
      okText: 'Reject',
      cancelText: 'Cancel',
      onOk: onOkReject,
    });
    setConfirm(true);
  };

  // click on button accept
  const onAccept = () => {
    setModal({
      title: 'Accept this exercise?',
      okText: 'Accept',
      cancelText: 'Cancel',
      onOk: onOkAccept,
    });
    setConfirm(true);
  };

  const onOkReject = async () => {
    if (isSelfReview) {
      await onSelfReview(false);
    } else {
      await onNormalReview(false);
    }
  };

  const onOkAccept = async () => {
    if (isSelfReview) {
      await onSelfReview(true);
    } else {
      await onNormalReview(true);
    }
  };

  const onNormalReview = async (isAccepted = false) => {
    let comment = form.getFieldValue('comment');
    try {
      const res = await axios.post(`${process.env.API}/api/review`, {
        comment: comment,
        isAccepted: isAccepted,
        userId: currUserId,
        requestId: requestId,
      });
      if (res.data.success) {
        router.push('/exercise-list');
      } else {
        if (res.data.code === 1) {
          let isAccepted = res.data.data.isAccepted;
          let color =
            isAccepted === 'accepted'
              ? 'green'
              : isAccepted === 'rejected'
              ? 'red'
              : 'unset';
          notification.warn({
            message: (
              <>
                {`This exercise already `}
                <span style={{ textTransform: 'capitalize', color: color }}>
                  {isAccepted}
                </span>
                {` by Self-Review.`}
              </>
            ),
          });
        } else if (res.data.code === 3) {
          notification.warn({
            message: 'Exercise already deleted.',
          });
        } else {
          throw new Error();
        }
      }
    } catch (e) {
      notification.warn({
        message: 'Something went wrong.',
      });
      console.log(e);
    }
  };

  const onSelfReview = async (isAccepted = false) => {
    let comment = form.getFieldValue('comment');
    try {
      const res = await axios.post(`${process.env.API}/api/self-review`, {
        comment: comment,
        isAccepted: isAccepted,
        exerciseId: exerciseId,
        userId: currUserId,
      });
      if (res.data.success) {
        router.push('/exercise-list');
      } else {
        if (res.data.code === 1) {
          let isAccepted = res.data.data.isAccepted;
          let color =
            isAccepted === 'accepted'
              ? 'green'
              : isAccepted === 'rejected'
              ? 'red'
              : 'unset';
          notification.warn({
            message: (
              <>
                {`This exercise already `}
                <span style={{ textTransform: 'capitalize', color: color }}>
                  {isAccepted}
                </span>
                {` by other teachers.`}
              </>
            ),
          });
        } else if (res.data.code === 3) {
          notification.warn({
            message: 'Exercise already deleted.',
          });
        } else {
          throw new Error();
        }
      }
    } catch (e) {
      notification.warn({
        message: 'Something went wrong.',
      });
      console.log(e);
    }
  };

  useEffect(() => {
    confirm && form.setFieldsValue({ comment: '' });
  }, [confirm]);

  return (
    <>
      <Head>
        <title>{isSelfReview ? 'Self-Review' : 'Review'}</title>
      </Head>
      <Header />
      <div
        style={{
          margin: '0 auto',
          width: '90%',
          marginTop: 50,
        }}>
        <h1>Review</h1>
        <Tabs
          style={{
            minHeight: 400,
          }}
          tabBarExtraContent={
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: 270,
              }}>
              <Button
                danger
                type='dashed'
                size='large'
                style={{
                  width: 125,
                }}
                onClick={onReject}>
                {isSelfReview ? 'Self-Reject' : 'Reject'}
              </Button>
              <Button
                type='primary'
                size='large'
                style={{
                  width: 125,
                }}
                onClick={onAccept}>
                {isSelfReview ? 'Self-Accept' : 'Accept'}
              </Button>
            </div>
          }>
          <Tabs.TabPane tab='Basic Information' key='1'>
            <ReviewStepBasic
              content={exercise.content}
              title={exercise.title}
              dislike={exercise.dislike}
              like={exercise.like}
              level={exercise.level}
              points={exercise.points}
              tags={exercise.tags}
              createdAt={exercise.createdAt}
              updatedAt={exercise.updatedAt}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab='Code Stubs' key='2'>
            <ReviewStepSnippet snippets={exercise.codeSnippets} />
          </Tabs.TabPane>
          <Tabs.TabPane tab='Testcases' key='3'>
            <ReviewStepTestcase data={exercise.testCases} />
          </Tabs.TabPane>
        </Tabs>
      </div>
      <ConfirmModal
        visible={confirm}
        content={
          <Form layout='vertical' form={form} initialValues={{ comment: '' }}>
            <Form.Item
              required={false}
              name='comment'
              label='Leave a comment'
              rules={[
                {
                  type: 'string',
                  max: 500,
                  message: `'Comment' cannot be longer than 500 characters.`,
                },
              ]}>
              <Input.TextArea rows={3} style={{ whiteSpace: 'nowrap' }} />
            </Form.Item>
          </Form>
        }
        onCancelX={() => setConfirm(false)}
        onCancel={() => setConfirm(false)}
        onOk={modal.onOk}
        title={modal.title}
        okText={modal.okText}
        cancelText={modal.cancelText}
      />
      <Footer />
    </>
  );
};

ReviewExercise.getInitialProps = async ({ query, store }) => {
  let { request: requestId, exerciseId } = query;
  let errorCode;
  if (
    (requestId !== undefined && exerciseId !== undefined) ||
    (requestId === undefined && exerciseId === undefined)
  ) {
    errorCode = 500;
  }
  if (
    requestId === '' ||
    (requestId !== undefined && Number.isNaN(Number(requestId)))
  ) {
    errorCode = 404;
    id = null;
  }
  if (
    exerciseId === '' ||
    (exerciseId !== undefined && Number.isNaN(Number(exerciseId)))
  ) {
    errorCode = 404;
    id = null;
  }
  if (errorCode) {
    return {
      errorCode: errorCode,
    };
  }
  const isSelfReview = !!exerciseId;
  let exerciseInfos = {
    tags: [],
    codeSnippets: [],
    testCases: [],
    createdAt: '',
    updatedAt: '',
    points: 1,
    level: '',
    like: 0,
    dislike: 0,
    content: '',
    title: '',
  };
  let userId = store.getState().auth.userInfo.id;
  userId = userId ? userId : 0;
  if (isSelfReview) {
    const res = await axios.get(
      `${process.env.API}/api/review/exercise/${exerciseId}?userId=${userId}`
    );
    if (res.data.success) {
      let tags = res.data.data.tags.map((t) => t.name);
      let testCases = res.data.data.testCases.map((t) => ({
        ...t,
        output: t.expectedOutput,
        key: t.id,
      }));
      let codeSnippets = res.data.data.codeSnippets.map((t) => ({
        ...t,
        key: t.id,
      }));
      exerciseInfos = {
        ...res.data.data,
        tags,
        testCases,
        codeSnippets,
      };
    } else {
      if (res.data.code === 500) {
        errorCode = 500;
      } else if (res.data.code === 403) {
        errorCode = 403;
      } else if (res.data.code === 404) {
        errorCode = 404;
      }
    }
  } else {
    const res = await axios.get(
      `${process.env.API}/api/review/request/${requestId}?userId=${userId}`
    );
    if (res.data.success) {
      let tags = res.data.data.exerciseInfos.tags.map((t) => t.name);
      let testCases = res.data.data.exerciseInfos.testCases.map((t) => ({
        ...t,
        output: t.expectedOutput,
        key: t.id,
      }));
      let codeSnippets = res.data.data.exerciseInfos.codeSnippets.map((t) => ({
        ...t,
        key: t.id,
      }));
      exerciseInfos = {
        ...res.data.data.exerciseInfos,
        tags,
        testCases,
        codeSnippets,
      };
    } else {
      if (res.data.code === 500) {
        errorCode = 500;
      } else if (res.data.code === 403) {
        errorCode = 403;
      } else if (res.data.code === 404) {
        errorCode = 404;
      }
    }
  }
  return {
    exerciseId: exerciseId,
    isSelfReview: isSelfReview,
    exerciseInfos: exerciseInfos,
    requestId: requestId,
    errorCode: errorCode,
  };
};

export default composedAuthHOC(ReviewExercise);
