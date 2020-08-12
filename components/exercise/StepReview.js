import {
  Button,
  Typography,
  Input,
  AutoComplete,
  Avatar,
  notification,
} from 'antd';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Form from 'antd/lib/form/Form';
import {
  SmileOutlined,
  UserOutlined,
  CloseSquareOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const StepReview = ({
  exerciseId = 0,
  prev = () => {},
  listTeachers = [],
  reviewers = [],
  setReviewers = () => {},
}) => {
  let [loading, setLoading] = useState(false);
  let router = useRouter();
  let [options, setOptions] = useState([]);
  let [searchInput, setSearchInput] = useState('');

  const handleNext = async () => {
    setLoading(true);
    try {
      let reviewerIds = [...listTeachers]
        .filter((t) => reviewers.indexOf(t.email) !== -1)
        .map((t) => t.id);
      console.log({ reviewerIds });
      const res = await axios.post(`${process.env.API}/api/review/request`, {
        exerciseId,
        reviewerIds,
      });
      const res1 = await axios.post(
        `${process.env.API}/api/notification/push`,
        {
          reviewerIds,
          content: 'You have requested to review a exercise.',
          linkAction: `/review?id=${exerciseId}`,
        }
      );
      setLoading(false);
      if (res.data.success) {
        router.push({
          pathname: '/exercise-list',
          query: {},
        });
      } else {
        throw new Error('');
      }
    } catch (e) {
      notification.error({
        message: 'Notification',
        description: 'Something get wrong!',
      });
      console.log(e);
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    prev();
  };

  const onSelectReviewer = (value) => {
    if (value && reviewers.indexOf(value) === -1) {
      setReviewers([...reviewers, value]);
    }
  };

  const onSearchReviewer = (value) => {
    let suggestedValues = [...listTeachers]
      .map((t) => t.email)
      .filter((t) => t.includes(value))
      .filter((t) => reviewers.indexOf(value) === -1)
      .map((t) => ({ value: t }));
    setOptions([...suggestedValues]);
  };

  const onChangeSearch = (value) => {
    setSearchInput(value);
  };

  const removeReviewer = (removedReviewer) => {
    console.log(removedReviewer);
    let filtered = [...reviewers].filter((r) => r !== removedReviewer);
    setReviewers(filtered);
  };

  useEffect(() => {
    let convertOptions = [...listTeachers]
      .map((t) => t.emaiḷ)
      .filter((t) => reviewers.indexOf(t) === -1)
      .map((t) => ({ value: t }));
    setOptions(convertOptions);
  }, []);

  return (
    <>
      <div style={{ minHeight: '360px' }}>
        <Form labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
          <Form.Item name='availableReviewer' label='Find Reviewer'>
            <AutoComplete
              bordered
              style={{
                maxWidth: 350,
              }}
              options={options}
              placeholder='Type here ...'
              onFocus={(e) => onSearchReviewer(searchInput)}
              onSearch={onSearchReviewer}
              onSelect={onSelectReviewer}
              onChange={onChangeSearch}
            />
          </Form.Item>
          <Form.Item label='Chosen Reviewers'>
            {reviewers.length ? (
              <ul>
                {reviewers.map((reviewer, index) => (
                  <li
                    key={index}
                    className='user'
                    style={{
                      marginBottom: 20,
                    }}>
                    <Button
                      type='link'
                      onClick={() => removeReviewer(reviewer)}>
                      <CloseOutlined />
                    </Button>
                    <Avatar
                      icon={<UserOutlined />}
                      style={{
                        marginRight: 10,
                      }}
                    />
                    {reviewer}
                  </li>
                ))}
              </ul>
            ) : (
              <Typography.Text className='ant-form-text' type='secondary'>
                ( <SmileOutlined /> No reviewer yet. )
              </Typography.Text>
            )}
          </Form.Item>
        </Form>
      </div>
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
      <style jsx>
        {`
          ul {
            list-style-type: none;
            padding-left: 0;
          }
        `}
      </style>
    </>
  );
};

export default StepReview;
