

const TestCase = props => {
  const testCase = props.testCaseProps
  return (
    <div className="test-case-wrapper">
      <div>Status: {testCase.status.description}</div>
      <div>Output: {testCase.stdout}</div>
      <div>Expected Output: {testCase.expected_output}</div>
    </div>
  )
}

export default TestCase