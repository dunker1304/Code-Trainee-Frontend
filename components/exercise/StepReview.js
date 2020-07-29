import { Button } from 'antd';
import { useState } from 'react';
import { useRouter } from 'next/router';

const StepReview = ({ exerciseId = 0, prev = () => {} }) => {
  let [loading, setLoading] = useState(false);
  let router = useRouter();

  const handleNext = () => {
    setLoading(true);
    router.push({
      pathname: '/exercise-list',
      query: {},
    });
  };

  const handlePrevious = () => {
    prev();
  };

  return (
    <>
      <div style={{ minHeight: '450px' }}>Review</div>
      <div
        className='step-actions'
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '50px',
        }}>
        <Button
          onClick={handlePrevious}
          type='primary'
          size='large'
          style={{
            width: 100,
          }}>
          Previous
        </Button>
        <Button
          onClick={handleNext}
          loading={loading}
          type='primary'
          size='large'
          style={{
            width: 100,
          }}>
          Finish
        </Button>
      </div>
    </>
  );
};

export default StepReview;
