import ReviewExercise from '../../pages/review';
import { Collapse } from 'antd';
import Highlight, { defaultProps } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/github';

const ReviewStepSnippet = ({ snippets }) => {
  console.log({ snippets });
  return (
    <>
      <h2
        style={{
          marginTop: 10,
          marginBottom: 10,
        }}>
        {`Code template of Languages will be fed in submissions when students do exercise.`}
      </h2>
      <Collapse>
        {snippets.map((snippet, index) => {
          return (
            <Collapse.Panel header={snippet.languageName} key={index}>
              <div style={{ margin: -16 }}>
                <Highlight
                  {...defaultProps}
                  theme={theme}
                  code={snippet.sampleCode}
                  language='javascript'>
                  {({
                    className,
                    style,
                    tokens,
                    getLineProps,
                    getTokenProps,
                  }) => (
                    <pre
                      className={className}
                      style={{
                        textAlign: 'left',
                        padding: '0.5em',
                        margin: 0,
                        overflow: 'scroll',
                        maxHeight: 500,
                        ...style,
                      }}>
                      {tokens.map((line, i) => (
                        <div
                          style={{ display: 'table-row' }}
                          key={i}
                          {...getLineProps({ line, key: i })}>
                          <span
                            style={{
                              display: 'table-cell',
                              textAlign: 'right',
                              paddingRight: '1em',
                              userSelect: 'none',
                              opacity: '0.5',
                              borderRight: '1px solid gray',
                              width: 40,
                            }}>
                            {i + 1}
                          </span>
                          <span
                            style={{
                              display: 'table-cell',
                              paddingLeft: '1em',
                              paddingRight: '1em',
                            }}>
                            {line.map((token, key) => (
                              <span
                                key={key}
                                {...getTokenProps({ token, key })}
                              />
                            ))}
                          </span>
                        </div>
                      ))}
                    </pre>
                  )}
                </Highlight>
              </div>
            </Collapse.Panel>
          );
        })}
      </Collapse>
    </>
  );
};
export default ReviewStepSnippet;
