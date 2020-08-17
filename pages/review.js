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

  // if (errorCode) {
  //   console.log({
  //     pathName: router.pathname,
  //     rout: router.route,
  //     query: router.query,
  //   });
  //   router.push('/error/404', '/review');
  //   return null;
  // }

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
    let comment = form.getFieldValue('comment');
    try {
      const res = await axios.post(`${process.env.API}/api/review`, {
        comment: comment,
        isAccepted: false,
        exerciseId: exerciseId,
        userId: currUserId,
        requestId: requestId,
      });
      if (res.data.success) {
        router.push('/exercise-list');
      } else {
        throw new Error();
      }
    } catch (e) {
      notification.warn({
        message: 'Something is wrong.',
      });
      console.log(e);
    }
  };

  const onOkAccept = async () => {
    let comment = form.getFieldValue('comment');
    try {
      const res = await axios.post(`${process.env.API}/api/review`, {
        comment: comment,
        isAccepted: true,
        exerciseId: exerciseId,
        userId: currUserId,
        requestId: requestId,
      });
      if (res.data.success) {
        router.push('/exercise-list');
      } else {
        throw new Error();
      }
    } catch (e) {
      notification.warn({
        message: 'Something is wrong.',
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
        <title>Review</title>
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
          <Tabs.TabPane tab='Basic Informations' key='1'>
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
              <Input.TextArea rows={3} />
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

ReviewExercise.getInitialProps = async ({ query }) => {
  let { request: requestId, exerciseId } = query;
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
  if (isSelfReview) {
    const res = await axios.get(
      `${process.env.API}/api/review/exercise/${exerciseId}`
    );
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
    const res = await axios.get(
      `${process.env.API}/api/review/request/${requestId}`
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
      // redirect to error page here
    }
  }
  return {
    exerciseId: exerciseId,
    isSelfReview: isSelfReview,
    exerciseInfos: exerciseInfos,
    requestId: requestId,
  };
};

export default composedAuthHOC(ReviewExercise);
