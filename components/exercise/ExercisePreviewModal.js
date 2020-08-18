import { useEffect, useRef, useState } from 'react';
import { Modal, Button, Radio } from 'antd';
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import PreviewSection from './PreviewSection';
import CommentsSection from './CommentsSection';

const ExercisePreviewModal = ({
  exerciseInfos = {
    title: '',
    level: '',
    like: 0,
    dislike: 0,
    content: '',
    points: 1,
    approved: 'waiting',
    lastRequestReview: {},
  },
  visible = false,
  onCancel,
  userInfo,
}) => {
  let [curTab, setCurTab] = useState(0);
  const onTabChange = (e) => {
    setCurTab(e.target.value);
  };
  useEffect(() => {
    visible && setCurTab(0);
  }, [visible]);

  return (
    <>
      <Modal
        className='preview-exercise-modal'
        title={
          <Radio.Group
            onChange={onTabChange}
            value={curTab}
            buttonStyle='solid'
            size='large'>
            <Radio.Button value={0} style={{ width: 120, textAlign: 'center' }}>
              Preview
            </Radio.Button>
            <Radio.Button value={1} style={{ width: 120, textAlign: 'center' }}>
              Comments
            </Radio.Button>
          </Radio.Group>
        }
        visible={visible}
        width={700}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={onCancel}
        bodyStyle={{
          marginTop: -15,
        }}
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
          style={{
            height: 340,
          }}>
          {curTab === 0 && <PreviewSection exerciseInfos={exerciseInfos} />}
          {curTab === 1 && (
            <CommentsSection
              approved={exerciseInfos.approved}
              reviewInfos={exerciseInfos.lastRequestReview}
              userInfo={userInfo}
            />
          )}
        </div>
      </Modal>
    </>
  );
};
export default ExercisePreviewModal;
