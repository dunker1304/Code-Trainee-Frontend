import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Steps, Divider, notification, Button, Form } from 'antd';
import StepBasic from '../components/exercise/StepBasic';
import StepTestCases from '../components/exercise/StepTestCase';
import StepSnippet from '../components/exercise/StepSnippet';
import StepReview from '../components/exercise/StepReview';
import Header from '../components/Header';
import Footer from '../components/Footer';
import composedAuthHOC from 'hocs';
import axios from 'axios';
import { Router, useRouter } from 'next/router';
import ConfirmModal from '../components/ConfirmModal';

const StepTitles = [
  { key: 0, title: 'Basic Informations' },
  { key: 1, title: 'Code Stubs' },
  { key: 2, title: 'Testcases' },
  { key: 3, title: 'Review' },
];

const Exercise = ({
  id,
  userInfo,
  exerciseInfos,
  listTags,
  listLanguages,
  listTeachers,
}) => {
  let router = useRouter();
  let currUserId = userInfo ? userInfo.id : 0;
  let isCreate = !id;
  // steps
  let [currStep, setCurrStep] = useState(0);
  // step basic infos
  let [formRef] = Form.useForm();
  let [basicInfos, setBasicInfos] = useState(exerciseInfos.basicInfos);
  // step code stubs
  let [languages, setLanguages] = useState(listLanguages);
  // step testcases
  let [testcases, setTestcases] = useState(exerciseInfos.testcases);
  // step reivew
  let [selectedReviewers, setSelectedReviewers] = useState(
    exerciseInfos.selectedReviewers
  );
  // loading
  let [nextLoading, setNextLoading] = useState(false);
  let [prevLoading, setPrevLoading] = useState(false);
  let [finishLoading, setFinishLoading] = useState(false);
  // visible confirm modal
  let [confirm, setConfirm] = useState(false);

  const validateStepBasicInfos = async () => {
    try {
      await formRef.validateFields();
      return true;
    } catch (e) {
      notification.warn({
        message: 'Please check your input again.',
      });
      return false;
    }
  };

  const validateStepCodeStubs = () => {
    if (languages.filter((t) => t.isActive).length === 0) {
      notification.warn({
        message: 'Exercise must support at least ONE language.',
      });
      return false;
    }
    return true;
  };

  const validateStepTestcases = () => {
    if (testcases.length === 0) {
      notification.warn({
        message: 'Exercise must have at least ONE test case.',
      });
      return false;
    }
    return true;
  };

  const validateStepReview = () => {
    if (selectedReviewers.length === 0) {
      notification.warn({
        message: 'Exercise must have at least ONE reviewer.',
      });
      return false;
    }
    return true;
  };

  const onNext = async () => {
    setNextLoading(true);
    switch (currStep) {
      case 0:
        (await validateStepBasicInfos()) && setCurrStep(1);
        break;
      case 1:
        validateStepCodeStubs() && setCurrStep(2);
        break;
      case 2:
        validateStepTestcases() && setCurrStep(3);
        break;
    }
    setNextLoading(false);
  };

  const onPrevious = () => {
    setPrevLoading(true);
    if (isCreate) {
      setCurrStep(currStep - 1);
    } else {
      switch (currStep) {
        case 1:
          validateStepCodeStubs() && setCurrStep(0);
          break;
        case 2:
          validateStepTestcases() && setCurrStep(1);
          break;
        case 3:
          validateStepReview() && setCurrStep(2);
          break;
      }
    }
    setPrevLoading(false);
  };

  const onFinish = async () => {
    try {
      let { content, title, points, level, tags } = basicInfos;
      let res = await axios.post(
        `${process.env.API}/api/exercise/${isCreate ? 'create' : 'update'}`,
        {
          id: id,
          content: content,
          title: title,
          points: points,
          level: level,
          tags: tags,
          testcases: testcases,
          languages: languages,
          reviewerIds: listTeachers
            .filter((t) => selectedReviewers.indexOf(t.email) !== -1)
            .map((t) => t.id),
          createdBy: currUserId,
        }
      );
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

  const onBeforeFinish = async () => {
    setFinishLoading(true);
    (await validateStepBasicInfos()) &&
      validateStepCodeStubs() &&
      validateStepTestcases() &&
      validateStepReview() &&
      setConfirm(true);
    setFinishLoading(false);
  };

  return (
    <React.Fragment>
      <Head>
        <title>{isCreate ? 'Create Exercise' : 'Update Exercise'}</title>
      </Head>
      <Header />
      <div
        style={{
          width: '95%',
          margin: '0 auto',
          marginBottom: 50,
          marginTop: 50,
        }}>
        <Divider />
        <Steps current={currStep}>
          {StepTitles.map((t) => (
            <Steps.Step
              title={t.title}
              key={t.key}
              style={{
                fontSize: 17,
              }}
            />
          ))}
        </Steps>
        <Divider />
        <div
          className='step-contents'
          style={{
            marginBottom: '50px',
          }}>
          {currStep === 0 && (
            <StepBasic
              isCreate={isCreate}
              allTags={listTags}
              formRef={formRef}
              setBasicInfos={setBasicInfos}
              initialValues={exerciseInfos.basicInfos}
            />
          )}
          {currStep === 1 && (
            <StepSnippet languages={languages} setLanguages={setLanguages} />
          )}
          {currStep === 2 && (
            <StepTestCases testcases={testcases} setTestCases={setTestcases} />
          )}
          {currStep === 3 && (
            <StepReview
              listTeachers={listTeachers}
              selectedReviewers={selectedReviewers}
              setSelectedReviewers={setSelectedReviewers}
            />
          )}
        </div>
        <div
          className='step-actions'
          style={{
            display: 'flex',
            justifyContent: currStep === 0 ? 'flex-end' : 'space-between',
            marginBottom: '50px',
          }}>
          {currStep !== 0 && (
            <Button
              loading={prevLoading}
              onClick={onPrevious}
              type='primary'
              size='large'
              style={{
                width: 100,
              }}>
              Previous
            </Button>
          )}
          <div
            style={{
              display: 'flex',
              width: 210,
              justifyContent: 'flex-end',
            }}>
            {currStep !== StepTitles.length - 1 && (
              <Button
                loading={nextLoading}
                onClick={onNext}
                type='primary'
                size='large'
                style={{
                  width: 100,
                }}>
                Next
              </Button>
            )}
            {(!isCreate || currStep === StepTitles.length - 1) && (
              <Button
                disabled={nextLoading || prevLoading}
                loading={finishLoading}
                onClick={onBeforeFinish}
                type='primary'
                size='large'
                style={{
                  width: 100,
                  marginLeft: 10,
                }}>
                Finish
              </Button>
            )}
          </div>
        </div>
      </div>
      <ConfirmModal
        visible={confirm}
        content={
          <>
            <p>This exercise will be reviewed by other teachers.</p>
            <p>
              After 24h, you can self-review this exercise if it was not
              reviewed yet.
            </p>
          </>
        }
        onCancelX={() => setConfirm(false)}
        onCancel={() => setConfirm(false)}
        title='Notification'
        onOk={onFinish}
        okText='OK'
        cancelText='Cancel'
      />
      <Footer />
    </React.Fragment>
  );
};

Exercise.getInitialProps = async ({ query, store }) => {
  let { id } = query;
  let exerciseInfos = {
    basicInfos: {
      title: '',
      content: '',
      level: 'easy',
      points: 1,
      tags: ['#'],
    },
    testcases: [],
    selectedReviewers: [],
  };
  let listTags = (
    await axios.get(`${process.env.API}/api/tags/all`)
  ).data.data.map((t) => t.name);
  let listLanguages = [];
  let listTeachers = (
    await axios.get(`${process.env.API}/api/user/teacher/all`)
  ).data.data;
  // have 'id' mean edit page is access, get old data
  if (id) {
    let basicInfos = (
      await axios.get(`${process.env.API}/api/exercise/basic-info/${id}`)
    ).data.data;
    exerciseInfos.basicInfos = {
      ...basicInfos,
      tags: [
        '#',
        ...basicInfos.tags.map((t) => t.name).filter((t) => t !== '#'),
      ],
    };
    exerciseInfos.testcases = (
      await axios.get(`${process.env.API}/api/testcase/exercise/${id}`)
    ).data.data.result.map((t) => ({
      key: t.id,
      id: t.id,
      input: t.input,
      output: t.expectedOutput,
      isHidden: t.isHidden,
    }));
    listLanguages = (
      await axios.get(`${process.env.API}/api/language/exercise/${id}`)
    ).data.data.map((t) => ({
      key: t.id,
      id: t.id,
      language: t.name,
      isActive: t.codeSnippets.length ? t.codeSnippets[0].isActive : false,
      sampleCode: t.codeSnippets.length ? t.codeSnippets[0].sampleCode : '',
    }));
    let selectedReviewerIds = (
      await axios.get(`${process.env.API}/api/review/reviewers/${id}`)
    ).data.data[0].details.map((t) => t.reviewer);
    exerciseInfos.selectedReviewers = [...listTeachers]
      .filter((t) => selectedReviewerIds.indexOf(t.id) !== -1)
      .map((t) => t.email);
  } else {
    listLanguages = (
      await axios.get(`${process.env.API}/api/language/all`)
    ).data.data.map((t, index) => ({
      key: t.id,
      id: t.id,
      language: t.name,
      isActive: index === 0 ? true : false,
      sampleCode: '',
    }));
  }
  return {
    id: id,
    exerciseInfos,
    listTags,
    listLanguages,
    listTeachers,
  };
};

export default composedAuthHOC(Exercise);
