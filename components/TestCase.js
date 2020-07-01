

const TestCase = props => {
  const testCase = props.testCaseProps
  return (
    <div className="test-case-wrapper">
      <div className="status">Status: {testCase.status ? testCase.status.description : ""}</div>
      <div className="input">Input: {testCase.input || testCase.stdin}</div>
      <div className="output">Output: {testCase.stdout}</div>
      <div className="expected-output">Expected Output: {testCase.expected_output || testCase.expectedOutput}</div>
    </div>
  )
}

export default TestCase