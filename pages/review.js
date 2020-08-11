import Header from '../components/Header';
import Footer from '../components/Footer';
import ConfirmModal from '../components/ConfirmModal';
import { Form, Input, Button, Tabs, Descriptions, Row, Collapse } from 'antd';
import { useForm } from 'antd/lib/form/util';
import { useReducer, useRef, useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import TinymceTextArea from '../components/TinymceTextArea';
import ReviewStepBasic from '../components/review/ReviewStepBasic';
import ReviewStepSnippet from '../components/review/ReviewStepSnippet';
import ReviewStepTestcase from '../components/review/ReviewStepTestcase';
import axios from 'axios';
import { useRouter } from 'next/router';
import { route } from 'next/dist/next-server/server/router';
import Head from 'next/head';
import composedAuthHOC from 'hocs';

const ReviewExercise = ({ exerciseId, userInfo = {} }) => {
  let currUserId = userInfo.id || 0;
  let [exercise, setExercise] = useState({
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
  });
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
  let [comment, setComment] = useState('');

  // click on button reject
  const onReject = () => {
    setComment('');
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
    setComment('');
    setModal({
      title: 'Accept this exercise?',
      okText: 'Accept',
      cancelText: 'Cancel',
      onOk: onOkAccept,
    });
    setConfirm(true);
  };

  const onOkReject = async () => {
    try {
      const res = await axios.post(`${process.env.API}/api/review`, {
        comment: comment,
        isAccepted: false,
        exerciseId: exerciseId,
        userId: currUserId,
      });
      if (res.data.success) {
        router.push('/exercise-list', '/exercise-list');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onOkAccept = async () => {
    try {
      const res = await axios.post(`${process.env.API}/api/review`, {
        comment: comment,
        isAccepted: true,
        exerciseId: exerciseId,
        userId: currUserId,
      });
      if (res.data.success) {
        router.push('/exercise-list', '/exercise-list');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getExercise = async () => {
    try {
      const res = await axios.get(
        `${process.env.API}/api/exercise/review/${exerciseId}`
      );
      if (res.data.success) {
        if (res.data.data) {
          let tags = res.data.data.tags.map((t) => t.name);
          let testCases = res.data.data.testCases.map((t) => ({
            ...t,
            key: t.id,
          }));
          setExercise({ ...res.data.data, tags, testCases });
          console.log(exercise);
        } else {
          router.push('/error/404', router.pathname);
        }
      } else {
        throw new Error('');
      }
    } catch (e) {
      router.push('/error/500', router.pathname);
      console.log(e);
    }
  };

  useEffect(() => {
    getExercise();
  }, []);

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
                width: 210,
              }}>
              <Button
                danger
                type='dashed'
                size='large'
                style={{
                  width: 100,
                }}
                onClick={onReject}>
                Reject
              </Button>
              <Button
                type='primary'
                size='large'
                style={{
                  width: 100,
                }}
                onClick={onAccept}>
                Accept
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
          <>
            <h2>Leave a comment.</h2>
            <TinymceTextArea value={comment} onChange={setComment} />
          </>
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

ReviewExercise.getInitialProps = (ctx) => {
  let { id } = ctx.query;
  return { exerciseId: id };
};

export default composedAuthHOC(ReviewExercise);
