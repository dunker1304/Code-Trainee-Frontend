import { Result, Button } from 'antd';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const Notfound404 = () => {
  return (
    <>
      <Header />
      <Result
        status='404'
        title='404'
        subTitle='Sorry, the page you visited does not exist.'
      />
      <Footer />
    </>
  );
};
export default Notfound404;
