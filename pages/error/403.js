import { Result, Button } from 'antd';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const AccessDenied = () => {
  return (
    <>
      <Header />
      <Result
        status='403'
        title='403'
        subTitle='Sorry, you are not authorized to access this page.'
      />
      <Footer />
    </>
  );
};
export default AccessDenied;
