import { Descriptions, Row, Button, Tag } from 'antd';
import ExercisePreviewModal from '../exercise/ExercisePreviewModal';
import { useState } from 'react';

const ReviewStepBasic = ({
  title = '',
  level = '',
  points = 1,
  tags = ['#'],
  content = '',
  like = 0,
  dislike = 0,
  updatedAt = '',
  createdAt = '',
}) => {
  const [visiblePreview, setVisiblePreview] = useState(false);
  return (
    <>
      <Row style={{ marginBottom: 10 }}>
        <Button type='primary' onClick={() => setVisiblePreview(true)}>
          Preview
        </Button>
      </Row>
      <Descriptions bordered>
        <Descriptions.Item label='Title' span={3}>
          {title}
        </Descriptions.Item>
        <Descriptions.Item label='Level' span={3}>
          {level}
        </Descriptions.Item>
        <Descriptions.Item label='LOC' span={3}>
          {points}
        </Descriptions.Item>
        <Descriptions.Item label='Tags' span={3}>
          {tags.map((tag, index) => {
            const isLongTag = tag.length > 15;
            const handleLongTag = (tag) => tag.slice(0, 15) + '...';
            const tagElem = (
              <Tag
                color='green'
                className='edit-tag'
                key={tag}
                style={{
                  userSelect: 'none',
                }}>
                {isLongTag ? handleLongTag(tag) : tag}
              </Tag>
            );
            return isLongTag ? (
              <Tooltip title={tag} key={tag}>
                {tagElem}
              </Tooltip>
            ) : (
              tagElem
            );
          })}
        </Descriptions.Item>
        <Descriptions.Item label='Content' span={3}>
          {content}
        </Descriptions.Item>
        <Descriptions.Item label='CreatedAt' span={3}>
          {createdAt}
        </Descriptions.Item>
        <Descriptions.Item label='UpdatedAt' span={3}>
          {updatedAt}
        </Descriptions.Item>
      </Descriptions>
      <ExercisePreviewModal
        title='Preview Exercise'
        data={{ content, like, dislike, level, points, title }}
        raw={false}
        visible={visiblePreview}
        onCancel={() => setVisiblePreview(false)}
      />
    </>
  );
};
export default ReviewStepBasic;
