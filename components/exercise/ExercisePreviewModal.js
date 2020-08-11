import { useEffect, useRef } from 'react';
import { Modal, Button } from 'antd';
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons';

const ExercisePreviewModal = ({
  data = { title: '', level: '', like: 0, dislike: 0, content: '', points: 1 },
  raw = false,
  visible = false,
  onCancel = () => {},
  title = '',
}) => {
  return (
    <>
      <Modal
        className='preview-exercise-modal'
        title={title}
        visible={visible}
        width={700}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={onCancel}
        footer={
          <div>
            <Button
              style={{
                width: '100px',
              }}
              type='primary'
              size='large'
              danger
              onClick={onCancel}>
              Cancel
            </Button>
          </div>
        }>
        <div
          className='question-desc-wrapper'
          style={{ margin: 0, padding: 0 }}>
          <h4 className='question-title'>Title: {data.title}</h4>
          <div className='question-info'>
            <div
              className='question-level'
              style={{
                display: 'inline-block',
              }}>
              {data.level}
            </div>
            <button className='question-reaction' disabled>
              <LikeOutlined />
              <span>{data.like}</span>
            </button>
            <button className='question-reaction' disabled>
              <DislikeOutlined />
              <span>{data.dislike}</span>
            </button>
            <div
              className='question-point'
              style={{
                display: 'inline-block',
              }}>
              LOC: {data.points}
            </div>
          </div>
          <div
            className='question-description'
            dangerouslySetInnerHTML={{ __html: data.content }}
            style={{
              overflow: 'auto',
              maxHeight: '280px',
            }}></div>
        </div>
      </Modal>
    </>
  );
};
export default ExercisePreviewModal;
