import Header from '../components/Header'
import Footer from '../components/Footer'
function Error({ statusCode }) {
  return (
    <>
    <Header/>
      <img src='../static/images/500.jpg' className="error-page"></img>
    <Footer/>
   </>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error