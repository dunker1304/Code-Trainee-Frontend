import Header from '../components/Header';
import Footer from '../components/Footer';

const Preview = ({ content }) => {
  return (
    <>
      <Header />
      <div
        style={{
          width: '90%',
          minHeight: '400px',
          margin: '100 auto 0',
          marginTop: '100px',
        }}>
        <div style={{}}>{content}</div>
      </div>
      <Footer />
    </>
  );
};
Preview.getInitialProps = (ctx) => {
  let { content } = ctx.query;
  return { content: content };
};
export default Preview;
