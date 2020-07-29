import { Result, Button } from 'antd';
import Header from "../components/Header"
import composedAuthHOC from 'hocs';
const accessDeny = (props)=> {
  return (
    <div>
      <Header/>
      <div className="container-content">
       <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
      />,
    </div>
    </div>
  )
}

export default composedAuthHOC(accessDeny);