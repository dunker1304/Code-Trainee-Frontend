import { Row, Col } from 'antd'

const TestCase = props => {
  const testCase = props.testCaseProps
  return (
    testCase.isHidden ? 
    (<div className='test-case-wrapper hidden'> <img src="https://img.icons8.com/ios-glyphs/30/000000/lock.png" style={{marginRight: '5px', width: '18px'}}/> Hidden </div>)
    :
    (<div className="test-case-wrapper">
      <Row>
        <Col className="title" span={6}>
          <div className="status">Status:</div>
        </Col>
        <Col className="info" span={18}>
          <div className='status'>{testCase.status ? testCase.status.description : "Not Compile"}</div>
        </Col>
      </Row>

      <Row>
        <Col className="title" span={6}>
          <div className="input">Input:</div>
        </Col>
        <Col className="info" span={18}>
          <div className='input'>{testCase.input || testCase.stdin}</div>
        </Col>
      </Row>

      <Row>
        <Col className="title" span={6}> 
          <div className="output">Output:</div>
        </Col>
        <Col className="info" span={18}>
          <div className='output'>{testCase.stdout}</div>
        </Col>
      </Row>

      <Row>
        <Col className="title" span={6}> 
          <div className="expected-output">Expected Output:</div>
        </Col>
        <Col className="info" span={18}>
          <div className='expected-output'>{testCase.expected_output || testCase.expectedOutput}</div>
        </Col>
      </Row>

    </div>) 
  )
}

export default TestCase