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
import moment from 'moment';
import { formatDate } from '../../helpers/utils';

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
        <Descriptions.Item
          label={<span style={{ fontSize: 17 }}>Total</span>}
          style={{ width: 130 }}>
          <span style={{ fontSize: 17 }}>{totalComments}</span>
        </Descriptions.Item>
        <Descriptions.Item
          label={<span style={{ fontSize: 17 }}>Accepted</span>}
          style={{ width: 130 }}>
          <span style={{ fontSize: 17 }}>{acceptedComments}</span>
        </Descriptions.Item>
        <Descriptions.Item
          label={<span style={{ fontSize: 17 }}>Rejected</span>}
          style={{ width: 130 }}>
          <span style={{ fontSize: 17 }}>{rejectedComments}</span>
        </Descriptions.Item>
        <Descriptions.Item
          label={<span style={{ fontSize: 17 }}>Waiting</span>}
          style={{ width: 130 }}>
          <span style={{ fontSize: 17 }}>{waitingComments}</span>
        </Descriptions.Item>
      </Descriptions>
      <h4
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
      </h4>
      <h4
        style={{
          marginTop: 10,
        }}>
        Details:
      </h4>
      <div
        style={{
          maxHeight: 260,
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
                  {reviewInfos.isAccepted === 'rejected' && (
                    <span style={{ color: 'red' }}>Rejected</span>
                  )}
                  {reviewInfos.isAccepted === 'accepted' && (
                    <span style={{ color: 'green' }}>Accepted</span>
                  )}
                  {reviewInfos.isAccepted === 'waiting' && <span>Waiting</span>}
                </Descriptions.Item>
                <Descriptions.Item label='ReviewedAt'>
                  {formatDate(moment(reviewInfos.updatedAt).toDate())}
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
                    {t.isAccepted === 'rejected' && (
                      <span style={{ color: 'red' }}>Rejected</span>
                    )}
                    {t.isAccepted === 'accepted' && (
                      <span style={{ color: 'green' }}>Accepted</span>
                    )}
                    {t.isAccepted === 'waiting' && <span>Waiting</span>}
                  </Descriptions.Item>
                  {t.isAccepted !== 'waiting' && (
                    <>
                      <Descriptions.Item label='ReviewedAt'>
                        {formatDate(moment(t.updatedAt).toDate())}
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
