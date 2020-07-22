import { Select } from 'antd';
import { InfoCircleTwoTone, InfoCircleFilled } from '@ant-design/icons';
import { useState, useEffect } from 'react';

const ExerciseLevel = ({
  value = 'easy',
  onChange = () => {},
  min = 0,
  max = 100,
}) => {
  let [dropdownValue, setDropdownValue] = useState(value);
  useEffect(() => {
    setDropdownValue(value);
  }, [value]);
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}>
      <Select
        value={dropdownValue}
        onChange={onChange}
        style={{
          width: '200px',
        }}>
        <Select.Option value='easy'>Easy</Select.Option>
        <Select.Option value='medium'>Medium</Select.Option>
        <Select.Option value='hard'>Hard</Select.Option>
      </Select>
      <div
        style={{
          width: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <InfoCircleFilled style={{ fontSize: '18px' }} />
        <span>
          <strong>LOC</strong> will in range <strong>{min}</strong> to{' '}
          <strong>{max}</strong>
        </span>
      </div>
    </div>
  );
};
export default ExerciseLevel;
