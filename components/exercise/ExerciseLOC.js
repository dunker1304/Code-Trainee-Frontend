import { Space, Slider, Row, Col, Input } from 'antd';
import { useState } from 'react';

const ExerciseLOC = ({
  value = 0,
  onChange = () => {},
  minValue = 0,
  maxValue = 100,
  defaultValue = 0,
}) => {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
      <Slider
        min={minValue}
        max={maxValue}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        style={{
          width: '80%',
          display: 'inline-block',
        }}
      />
      <Input
        disabled
        value={value}
        defaultValue={defaultValue}
        style={{
          width: '15%',
          display: 'inline-block',
        }}
      />
    </div>
  );
};
export default ExerciseLOC;
