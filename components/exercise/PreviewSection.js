import { prepareDestination } from 'next/dist/next-server/server/router';
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons';

const PreviewSection = ({
  exerciseInfos = {
    title: '',
    level: '',
    like: 0,
    dislike: 0,
    content: '',
    points: 1,
  },
}) => {
  return (
    <div className='question-desc-wrapper' style={{ margin: 0, padding: 0 }}>
      <h4 className='question-title'>Title: {exerciseInfos.title}</h4>
      <div className='question-info'>
        <div
          className='question-level'
          style={{
            display: 'inline-block',
          }}>
          {exerciseInfos.level}
        </div>
        <button className='question-reaction' disabled>
          <LikeOutlined />
          <span>{exerciseInfos.like}</span>
        </button>
        <button className='question-reaction' disabled>
          <DislikeOutlined />
          <span>{exerciseInfos.dislike}</span>
        </button>
        <div
          className='question-point'
          style={{
            display: 'inline-block',
          }}>
          LOC: {exerciseInfos.points}
        </div>
      </div>
      <div
        className='question-description'
        dangerouslySetInnerHTML={{ __html: exerciseInfos.content }}
        style={{
          overflow: 'auto',
          maxHeight: '250px',
        }}></div>
    </div>
  );
};
export default PreviewSection;
