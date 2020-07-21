import { Space, Slider, Row, Col, InputNumber } from 'antd';
import { useState, useEffect } from 'react';

const ExerciseLOC = ({
  value = 0,
  onChange = (value) => {},
  min = 0,
  max = 100,
}) => {
  let [sliderValue, setSliderValue] = useState(value);
  useEffect(() => {
    console.log('init', value);
    setSliderValue(value);
  }, [value]);
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
      <Slider
        min={min}
        max={max}
        value={sliderValue}
        onAfterChange={onChange}
        onChange={setSliderValue}
        style={{
          width: '80%',
          display: 'inline-block',
        }}
      />
      <InputNumber
        value={sliderValue}
        min={min}
        max={max}
        onChange={onChange}
        style={{
          width: '15%',
          display: 'inline-block',
        }}
      />
    </div>
  );
};
export default ExerciseLOC;
