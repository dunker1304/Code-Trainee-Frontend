import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Steps, Divider } from 'antd';
import StepBasic from '../components/exercise/StepBasic';
import StepTestCases from '../components/exercise/StepTestCase';
import StepSnippet from '../components/exercise/StepSnippet';
import Header from '../components/Header';
import composedAuthHOC from 'hocs';
const Exercise = (props) => {
  let [exerciseId, setExerciseId] = useState(props.id);
  let [currStep, setCurrStep] = useState(0);
  let [wishStep, setWishStep] = useState(currStep + 1);
  let [checkDirtyBeforeLeaving, setCheckDirtyBeforeLeaving] = useState(false);
  let [dirty, setDirty] = useState(false);

  // state save step 2: snippet
  let [alreadySave, setAlreadySave] = useState(false);

  const onChangeStep = (stepIndex) => {
    if (dirty) {
      console.log('step have dirty check');
      setWishStep(stepIndex);
      setCheckDirtyBeforeLeaving(true);
    } else {
      console.log('step not have dirty check');
      setCurrStep(stepIndex);
      setWishStep(stepIndex + 1);
    }
  };

  useEffect(() => {
    setWishStep(currStep + 1);
    console.log('user', props.userInfo);
  }, [currStep]);

  return (
    <React.Fragment>
      <Head>
        <title>{!exerciseId ? 'Create Exercise' : 'Update Exercise'}</title>
      </Head>
      <Header />
      <div
        className='exercise-page'
        style={{
          width: '90%',
          margin: '0 auto',
          marginTop: '50px',
        }}>
        <Divider />
        <Steps current={currStep} onChange={onChangeStep} size='default'>
          <Steps.Step title='Basic Information' key='0' />
          <Steps.Step title='Code Stubs' key='1' disabled={!exerciseId} />
          <Steps.Step title='Test Cases' key='2' disabled={!exerciseId} />
        </Steps>
        <Divider />
        {currStep === 0 && (
          <StepBasic
            currUserId={props.userInfo?.id || 0}
            exerciseId={exerciseId}
            setExerciseId={setExerciseId}
            checkDirtyBeforeLeaving={checkDirtyBeforeLeaving}
            setCheckDirtyBeforeLeaving={setCheckDirtyBeforeLeaving}
            dirty={dirty}
            setDirty={setDirty}
            nextStep={() => setCurrStep(wishStep)}
          />
        )}
        {currStep === 1 && (
          <StepSnippet
            alreadySave={alreadySave}
            exerciseId={exerciseId}
            nextStep={() => {
              setCurrStep(wishStep);
              setAlreadySave(true);
            }}
          />
        )}
        {currStep === 2 && <StepTestCases exerciseId={exerciseId} />}
      </div>
    </React.Fragment>
  );
};
Exercise.getInitialProps = async (ctx) => {
  let id = ctx.query?.id;
  return { id };
};

export default composedAuthHOC(Exercise);
