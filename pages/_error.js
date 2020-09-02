import Header from '../components/Header'
import Footer from '../components/Footer'
import { Result, Button } from 'antd'
function Error({ statusCode }) {
  return (
    <>
    <Header/>
      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
      />
    <Footer/>
   </>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error