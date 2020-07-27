import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { Steps, Divider, Button, Form, notification } from 'antd';
import StepBasic from '../components/exercise/StepBasic';
import StepTestCases from '../components/exercise/StepTestCase';
import StepSnippet from '../components/exercise/StepSnippet';
import Header from '../components/Header';
import composedAuthHOC from 'hocs';
import axios from 'axios';

const Exercise = (props) => {
  let currUserId = props.userInfo ? props.userInfo.id : 0;
  let [exerciseId, setExerciseId] = useState(props.exerciseId);
  let isCreate = !props.exerciseId;
  // steps
  let [currStep, setCurrStep] = useState(0);
  // steps button action
  let [loading, setLoading] = useState(false);
  // step basic infos
  let [formRef] = Form.useForm();
  // step code stubs
  let [supportedLanguages, setSupportedLanguages] = useState([]);
  let [selectedLanguages, setSelectedLanguages] = useState([]);
  let [snippetValues, setSnippetValues] = useState({});

  const saveBasicInfos = async () => {
    setLoading(true);
    try {
      await formRef.validateFields();
    } catch (e) {
      notification.info({
        message: 'Infomation',
        description: 'Please check your input again!',
      });
      setLoading(false);
      return;
    }
    try {
      let { content, title, points, level, tags } = formRef.getFieldsValue();
      let res;
      if (!exerciseId) {
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
      if (res.data.success) {
        setExerciseId(res.data.data.id);
        setCurrStep(currStep + 1);
      } else {
        notification.error({
          message: 'Notification',
          description: 'Something get wrong!',
        });
      }
    } catch (e) {
      notification.error({
        message: 'Notification',
        description: 'Something get wrong!',
      });
      console.log(e);
    }
    setLoading(false);
  };

  const saveCodeStubs = async () => {
    setLoading(true);
    if (selectedLanguages.length === 0) {
      notification.info({
        message: 'Notification',
        description: 'At least one language must be selected.',
      });
    } else {
      let supportedLangs = [...supportedLanguages].map((e) => {
        let languageId = e.key;
        let isActive = selectedLanguages.includes(languageId);
        let sampleCode = snippetValues[languageId];
        return { languageId, isActive, sampleCode };
      });
      try {
        let res = await axios.post(`${process.env.API}/api/snippet/update`, {
          supportedLanguages: supportedLangs,
          exerciseId: exerciseId,
        });
        if (res.data.success) {
          setCurrStep(currStep + 1);
        } else {
          notification.error({
            message: 'Notification',
            description: 'Something get wrong!',
          });
        }
      } catch (e) {
        notification.error({
          message: 'Notification',
          description: 'Something get wrong!',
        });
        console.log(e);
      }
    }
    setLoading(false);
  };

  const onFinish = () => {};

  const handleNext = () => {
    currStep === 0 && saveBasicInfos();
    currStep === 1 && saveCodeStubs();
    currStep === 2 && setCurrStep(3);
    currStep === 3 && onFinish();
  };

  const handlePrevious = () => {
    currStep === 1 && setCurrStep(0);
    currStep === 2 && setCurrStep(1);
    currStep === 3 && setCurrStep(2);
  };

  const loadSupportedLanguages = async () => {
    try {
      const res = await axios.get(
        `${process.env.API}/api/language/exercise/${exerciseId}`
      );
      if (res.data.success) {
        let supportedLanguages = [];
        let selectedLanguages = [];
        let snippetValues = {};
        res.data.data.forEach((e) => {
          supportedLanguages.push({
            key: e.id,
            language: e.name,
            languageCode: e.code,
          });
          if (e.codeSnippets.length && e.codeSnippets[0].isActive) {
            selectedLanguages.push(e.id);
          }
          snippetValues[e.id] = e.codeSnippets.length
            ? e.codeSnippets[0].sampleCode
            : '';
        });
        setSupportedLanguages([...supportedLanguages]);
        setSelectedLanguages([...selectedLanguages]);
        setSnippetValues({ ...snippetValues });
      } else {
        notification.error({
          message: 'Notification',
          description: 'Something get wrong!',
        });
      }
    } catch (e) {
      notification.error({
        message: 'Notification',
        description: 'Something get wrong!',
      });
      console.log('error', e);
    }
  };

  const loadOldBasicInfos = async () => {
    try {
      const res = await axios.get(
        `${process.env.API}/api/exercise/basic-info/${exerciseId}`
      );
      if (res.data.success) {
        let tagNames = res.data.data.tags.map((e) => e.name);
        tagNames = [...tagNames].filter((e) => e !== '#');
        tagNames.unshift('#');
        formRef.setFieldsValue({
          title: res.data.data.title,
          content: res.data.data.content,
          points: res.data.data.points,
          level: res.data.data.level,
          tags: tagNames,
        });
      } else {
        throw new Error('');
      }
    } catch (e) {
      notification.error({
        message: 'Notification',
        description: 'Something get wrong!',
      });
      console.log(e);
    }
  };

  useEffect(() => {
    exerciseId && loadSupportedLanguages();
  }, [exerciseId]);

  useEffect(() => {
    !isCreate && loadOldBasicInfos();
  }, []);

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
          marginTop: '50px',
        }}>
        <Divider />
        <Steps current={currStep}>
          <Steps.Step title='Basic Information' key='0' />
          <Steps.Step title='Code Stubs' key='1' />
          <Steps.Step title='Test Cases' key='2' />
          <Steps.Step title='Review' key='3' />
        </Steps>
        <Divider />
        <div
          className='step-contents'
          style={{
            marginBottom: '50px',
          }}>
          {currStep === 0 && (
            <StepBasic formRef={formRef} isCreate={isCreate} />
          )}
          {currStep === 1 && (
            <StepSnippet
              selectedLanguages={selectedLanguages}
              supportedLanguages={supportedLanguages}
              snippetValues={snippetValues}
              setSelectedLanguages={setSelectedLanguages}
              setSupportedLanguages={setSupportedLanguages}
              setSnippetValues={setSnippetValues}
            />
          )}
          {currStep === 2 && <StepTestCases exerciseId={exerciseId} />}
          {currStep === 3 && <div> Chose Reviewer </div>}
        </div>
        <div
          className='step-actions'
          style={{
            display: 'flex',
            justifyContent: currStep === 0 ? 'flex-end' : 'space-between',
            marginBottom: '50px',
          }}>
          {currStep > 0 && (
            <Button
              onClick={handlePrevious}
              type='primary'
              size='large'
              style={{
                width: 100,
              }}>
              Previous
            </Button>
          )}
          <Button
            onClick={handleNext}
            loading={loading}
            type='primary'
            size='large'
            style={{
              width: 100,
            }}>
            {currStep === 3 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};

Exercise.getInitialProps = (ctx) => {
  let { id } = ctx.query;
  return { exerciseId: id };
};

export default composedAuthHOC(Exercise);
