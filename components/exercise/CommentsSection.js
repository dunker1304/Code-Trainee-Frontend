import {
  Empty,
  Descriptions,
  Collapse,
  Row,
  Col,
  Tooltip,
  Divider,
  Card,
} from 'antd';
import { CloseCircleTwoTone, CaretRightOutlined } from '@ant-design/icons';
import { useRef } from 'react';

const { Panel } = Collapse;

const CommentsSection = ({
  reviewInfos = {
    details: [],
    isSelfReview: false,
    selfComment: '',
    updatedAt: '',
  },
  approved,
  userInfo = {},
}) => {
  console.log({ commentInfos: reviewInfos });
  let totalComments = reviewInfos.details.length;
  let acceptedComments = reviewInfos.details.filter(
    (t) => t.isAccepted === 'accepted'
  ).length;
  let rejectedComments = reviewInfos.details.filter(
    (t) => t.isAccepted === 'rejected'
  ).length;
  let waitingComments = reviewInfos.details.filter(
    (t) => t.isAccepted === 'waiting'
  ).length;
  let isSelfReview = reviewInfos.isSelfReview;

  return (
    <div>
      <Descriptions size='small' column={4}>
        <Descriptions.Item label='Total' style={{ width: 130 }}>
          {totalComments}
        </Descriptions.Item>
        <Descriptions.Item label='Accepted' style={{ width: 130 }}>
          {acceptedComments}
        </Descriptions.Item>
        <Descriptions.Item label='Rejected' style={{ width: 130 }}>
          {rejectedComments}
        </Descriptions.Item>
        <Descriptions.Item label='Waiting' style={{ width: 130 }}>
          {waitingComments}
        </Descriptions.Item>
      </Descriptions>
      <h2
        style={{
          marginTop: 2,
        }}>
        {`Status:  `}
        {approved === 'waiting' && <>Waiting</>}
        {approved === 'accepted' && isSelfReview && (
          <>
            <span style={{ color: 'green' }}>Accepted</span> (by Self-Review)
          </>
        )}
        {approved === 'accepted' && !isSelfReview && (
          <>
            <span style={{ color: 'green' }}>Accepted</span>
          </>
        )}
        {approved === 'rejected' && isSelfReview && (
          <>
            <span style={{ color: 'red' }}>Rejected</span> (by Self-Review)
          </>
        )}
        {approved === 'rejected' && !isSelfReview && (
          <>
            <span style={{ color: 'red' }}>Rejected</span>
          </>
        )}
      </h2>
      <h2
        style={{
          marginTop: 10,
        }}>
        Details:
      </h2>
      <div
        style={{
          maxHeight: 270,
          overflow: 'hidden',
          overflowY: 'scroll',
        }}>
        <Collapse
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}>
          {isSelfReview && (
            <Panel header={`Reviewer: You (${userInfo.email})`} key=''>
              <Descriptions size='small' column={1}>
                <Descriptions.Item label='Type'>Self-Review</Descriptions.Item>
                <Descriptions.Item
                  label='Status'
                  style={{
                    textTransform: 'capitalize',
                  }}>
                  {reviewInfos.isAccepted}
                </Descriptions.Item>
                <Descriptions.Item label='ReviewedAt'>
                  {reviewInfos.updatedAt}
                </Descriptions.Item>
                <Descriptions.Item label='Content'>
                  {reviewInfos.selfComment}
                </Descriptions.Item>
              </Descriptions>
            </Panel>
          )}
          {reviewInfos.details.map((t) => {
            let reviewer = t.reviewer;
            let header =
              userInfo.email === reviewer.email
                ? `Reviewer: You (${userInfo.email})`
                : `Reviewer: ${reviewer.email}`;
            return (
              <Panel header={header} key=''>
                <Descriptions size='small' column={1}>
                  <Descriptions.Item label='Type'>
                    Requested Review
                  </Descriptions.Item>
                  <Descriptions.Item
                    label='Status'
                    style={{
                      textTransform: 'capitalize',
                    }}>
                    {t.isAccepted}
                  </Descriptions.Item>
                  {t.isAccepted !== 'waiting' && (
                    <>
                      <Descriptions.Item label='ReviewedAt'>
                        {t.updatedAt}
                      </Descriptions.Item>
                      <Descriptions.Item label='Content'>
                        {t.comment}
                      </Descriptions.Item>
                    </>
                  )}
                </Descriptions>
              </Panel>
            );
          })}
        </Collapse>
      </div>
    </div>
  );
};
export default CommentsSection;
