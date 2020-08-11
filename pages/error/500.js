import { Result, Button } from 'antd';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const InternalError500 = () => {
  return (
    <>
      <Header />
      <Result
        status='500'
        title='500'
        subTitle='Sorry, something went wrong.'
      />
      <Footer />
    </>
  );
};
export default InternalError500;
