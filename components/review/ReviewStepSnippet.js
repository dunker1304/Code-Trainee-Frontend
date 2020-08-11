import ReviewExercise from '../../pages/review';
import { Collapse } from 'antd';

const ReviewStepSnippet = ({ snippets }) => {
  return (
    <>
      <h1
        style={{
          marginTop: 10,
          marginBottom: 10,
        }}>
        Code template of Languages will be fed in when students do exercise
      </h1>
      <Collapse accordion>
        {snippets.map((snippet, index) => {
          return (
            <Collapse.Panel header={snippet.languageName} key={index}>
              {snippet.sampleCode}
            </Collapse.Panel>
          );
        })}
      </Collapse>
    </>
  );
};
export default ReviewStepSnippet;
