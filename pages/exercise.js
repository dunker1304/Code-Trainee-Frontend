import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Steps, Divider, notification } from 'antd';
import StepBasic from '../components/exercise/StepBasic';
import StepTestCases from '../components/exercise/StepTestCase';
import StepSnippet from '../components/exercise/StepSnippet';
import StepReview from '../components/exercise/StepReview';
import Header from '../components/Header';
import Footer from '../components/Footer';
import composedAuthHOC from 'hocs';
import axios from 'axios';

const Exercise = (props) => {
  let currUserId = props.userInfo.id || 0;
  let [exerciseId, setExerciseId] = useState(props.exerciseId);
  let isCreate = !props.exerciseId;
  // steps
  let [currStep, setCurrStep] = useState(0);
  // step basic infos
  let [basicInfos, setBasicInfos] = useState({
    title: '',
    content: '',
    level: 'easy',
    points: 1,
    tags: ['#'],
  });
  let [isDoneLoadOldInfos, setDoneLoadOldInfos] = useState(false);
  // step code stubs
  let [supportedLanguages, setSupportedLanguages] = useState([]);
  let [selectedLanguages, setSelectedLanguages] = useState([]);
  let [snippetValues, setSnippetValues] = useState({});
  // step reivew

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

  const loadOldBasicInfos = async () => {
    try {
      const res = await axios.get(
        `${process.env.API}/api/exercise/basic-info/${exerciseId}`
      );
      if (res.data.success) {
        let tagNames = res.data.data.tags.map((e) => e.name);
        tagNames = [...tagNames].filter((e) => e !== '#');
        tagNames.unshift('#');
        setBasicInfos({
          title: res.data.data.title,
          content: res.data.data.content,
          points: res.data.data.points,
          level: res.data.data.level,
          tags: tagNames,
        });
        setDoneLoadOldInfos(true);
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
          <Steps.Step title='Testcases' key='2' />
          <Steps.Step title='Review' key='3' />
        </Steps>
        <Divider />
        <div
          className='step-contents'
          style={{
            marginBottom: '50px',
          }}>
          {currStep === 0 && (
            <StepBasic
              basicInfos={basicInfos}
              setBasicInfos={setBasicInfos}
              exerciseId={exerciseId}
              setExerciseId={setExerciseId}
              isCreate={isCreate}
              currUserId={currUserId}
              isDoneLoadOldInfos={isDoneLoadOldInfos}
              next={() => setCurrStep(1)}
            />
          )}
          {currStep === 1 && (
            <StepSnippet
              exerciseId={exerciseId}
              selectedLanguages={selectedLanguages}
              supportedLanguages={supportedLanguages}
              snippetValues={snippetValues}
              setSelectedLanguages={setSelectedLanguages}
              setSupportedLanguages={setSupportedLanguages}
              setSnippetValues={setSnippetValues}
              next={() => setCurrStep(2)}
              prev={() => setCurrStep(0)}
            />
          )}
          {currStep === 2 && (
            <StepTestCases
              exerciseId={exerciseId}
              next={() => setCurrStep(3)}
              prev={() => setCurrStep(1)}
            />
          )}
          {currStep === 3 && (
            <StepReview prev={() => setCurrStep(2)} exerciseId={exerciseId} />
          )}
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

Exercise.getInitialProps = (ctx) => {
  let { id } = ctx.query;
  return { exerciseId: id };
};

export default composedAuthHOC(Exercise);
