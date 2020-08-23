import { Row, Button, Tag, Modal, Col } from 'antd';
import ExercisePreviewModal from '../exercise/ExercisePreviewModal';
import { useState } from 'react';
import PreviewSection from '../exercise/PreviewSection';
import moment from 'moment';
import { formatDate } from '../../helpers/utils';
import Highlight, { defaultProps } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/github';

const ReviewStepBasic = ({
  title = '',
  level = '',
  points = 1,
  tags = ['#'],
  content = '',
  like = 0,
  dislike = 0,
  updatedAt = new Date(),
  createdAt = new Date(),
}) => {
  const [visiblePreview, setVisiblePreview] = useState(false);

  const onCancelPreview = () => {
    setVisiblePreview(false);
  };

  const onOpenPreview = () => {
    setVisiblePreview(true);
  };

  return (
    <>
      <Row style={{ marginBottom: 10 }}>
        <Button type='primary' onClick={onOpenPreview}>
          Preview
        </Button>
      </Row>
      <Row
        style={{
          padding: '10px 24px',
          display: 'flex',
        }}>
        <Col style={{ width: 90, color: '#000000D9' }}>Title:</Col>
        <Col style={{ flexGrow: 1 }}>{title}</Col>
      </Row>
      <Row
        style={{
          padding: '10px 24px',
          display: 'flex',
        }}>
        <Col style={{ width: 90, color: '#000000D9' }}>Level:</Col>
        <Col style={{ flexGrow: 1 }}>{level}</Col>
      </Row>
      <Row
        style={{
          padding: '10px 24px',
          display: 'flex',
        }}>
        <Col style={{ width: 90, color: '#000000D9' }}>LOC:</Col>
        <Col style={{ flexGrow: 1 }}>{points}</Col>
      </Row>
      <Row
        style={{
          padding: '10px 24px',
          display: 'flex',
        }}>
        <Col style={{ width: 90, color: '#000000D9' }}>Tags:</Col>
        <Col style={{ flexGrow: 1 }}>
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
              <>{tagElem}</>
            );
          })}
        </Col>
      </Row>
      <Row
        style={{
          padding: '10px 24px',
          display: 'flex',
        }}>
        <Col style={{ width: 90, color: '#000000D9' }}>Content:</Col>
        <Col style={{ flexGrow: 1 }}>
          <div>
            <Highlight
              {...defaultProps}
              theme={theme}
              code={content}
              language='markup'>
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre
                  className={className}
                  style={{
                    textAlign: 'left',
                    margin: 0,
                    padding: '0.5em',
                    overflow: 'scroll',
                    maxHeight: 300,
                    ...style,
                  }}>
                  {tokens.map((line, i) => (
                    <div {...getLineProps({ line, key: i })}>
                      {line.map((token, key) => (
                        <span {...getTokenProps({ token, key })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </div>
        </Col>
      </Row>
      <Row
        style={{
          padding: '10px 24px',
          display: 'flex',
        }}>
        <Col style={{ width: 90, color: '#000000D9' }}>CreatedAt:</Col>
        <Col style={{ flexGrow: 1 }}>
          {formatDate(moment(createdAt).toDate())}
        </Col>
      </Row>
      <Row
        style={{
          padding: '10px 24px',
          display: 'flex',
        }}>
        <Col style={{ width: 90, color: '#000000D9' }}>UpdatedAt:</Col>
        <Col style={{ flexGrow: 1, display: 'flex', flexWrap: 'wrap' }}>
          {formatDate(moment(updatedAt).toDate())}
        </Col>
      </Row>
      <Modal
        className='preview-exercise-modal'
        title='Preview Exercise'
        visible={visiblePreview}
        width={700}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={onCancelPreview}
        footer={
          <div>
            <Button
              style={{
                width: '100px',
              }}
              type='primary'
              size='large'
              danger
              onClick={onCancelPreview}>
              Cancel
            </Button>
          </div>
        }>
        <div
          style={{
            height: 340,
          }}>
          <PreviewSection
            exerciseInfos={{ content, like, dislike, level, points, title }}
          />
        </div>
      </Modal>
    </>
  );
};
export default ReviewStepBasic;
