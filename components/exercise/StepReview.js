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
  listTeachers = [],
  selectedReviewers = [],
  setSelectedReviewers,
}) => {
  let [loading, setLoading] = useState(false);
  let [options, setOptions] = useState(() => {
    return [...listTeachers]
      .map((t) => t.emaiḷ)
      .filter((t) => selectedReviewers.indexOf(t) === -1)
      .map((t) => ({ value: t }));
  });
  let [searchInput, setSearchInput] = useState('');

  const onSelectReviewer = (value) => {
    if (value && selectedReviewers.indexOf(value) === -1) {
      setSelectedReviewers([...selectedReviewers, value]);
    }
  };

  const onSearchReviewer = (value) => {
    let suggestedValues = [...listTeachers]
      .map((t) => t.email)
      .filter((t) => t.includes(value))
      .map((t) => ({ value: t }));
    setOptions([...suggestedValues]);
  };

  const onChangeSearch = (value) => {
    setSearchInput(value);
  };

  const removeReviewer = (removedReviewer) => {
    let filtered = [...selectedReviewers].filter((r) => r !== removedReviewer);
    setSelectedReviewers(filtered);
  };

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
            {selectedReviewers.length ? (
              <ul>
                {selectedReviewers.map((reviewer, index) => (
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
