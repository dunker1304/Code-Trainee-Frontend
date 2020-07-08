import { useState } from 'react';
import Head from 'next/head';
import { Steps, Divider } from 'antd';
import StepBasic from '../components/exercise/StepBasic';
import StepTestCases from '../components/exercise/StepTestCase';
import StepSnippet from '../components/exercise/StepSnippet';

const Exercise = ({ id }) => {
  let [exerciseId, setExerciseId] = useState(id);
  let [currStep, setCurrStep] = useState(0);
  let [wishStep, setWishStep] = useState(currStep + 1);
  let [checkDirtyBeforeLeaving, setCheckDirtyBeforeLeaving] = useState(false);
  let [dirty, setDirty] = useState(false);

  const onChangeStep = (stepIndex) => {
    if (dirty) {
      console.log('a');
      setWishStep(stepIndex);
      setCheckDirtyBeforeLeaving(true);
    } else {
      console.log('b');
      setCurrStep(stepIndex);
      setWishStep(stepIndex + 1);
    }
  };

  return (
    <React.Fragment>
      <Head>
        <title>Create Exercise</title>
      </Head>
      <div
        className='exercise-page'
        style={{
          width: '90%',
          margin: '0 auto',
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
            exerciseId={{
              value: exerciseId,
              setValue: setExerciseId,
            }}
            checkDirtyBeforeLeaving={{
              value: checkDirtyBeforeLeaving,
              setValue: setCheckDirtyBeforeLeaving,
            }}
            dirty={{
              value: dirty,
              setValue: setDirty,
            }}
            nextStep={() => setCurrStep(wishStep)}
          />
        )}
        {currStep === 1 && (
          <StepSnippet
            exerciseId={{ value: exerciseId }}
            nextStep={() => setCurrStep(wishStep)}
          />
        )}
        {currStep === 2 && <StepTestCases exerciseId={exerciseId} />}
      </div>
    </React.Fragment>
  );
};

export default Exercise;
