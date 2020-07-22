import { Space, Slider, Row, Col, InputNumber, notification } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import { useState, useEffect, useRef } from 'react';

const ExerciseLOC = ({
  value = 0,
  onChange = (value) => {},
  min = 0,
  max = 100,
}) => {
  let [sliderValue, setSliderValue] = useState(value);
  let sliderRef = useRef();
  useEffect(() => {
    setSliderValue(value);
  }, [value]);
  useEffect(() => {
    sliderRef.current.onKeyDown = (e) => {
      if (e.keyCode === 37) {
        // left arrow press
        onSliderValueChange(sliderValue - 1);
      }
      if (e.keyCode === 39) {
        // right arrow press
        onSliderValueChange(sliderValue + 1);
      }
    };
  }, [sliderValue]);
  const onSliderValueChange = (value) => {
    if (value <= max && value >= min) {
      setSliderValue(value);
    }
  };
  const onInputValueChange = (value) => {
    if (value <= max && value >= min) {
      onChange(value);
    }
  };
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
      <InputNumber
        value={sliderValue}
        onChange={onInputValueChange}
        style={{
          width: '15%',
          display: 'inline-block',
          fontWeight: 'bold',
        }}
      />
      <Slider
        ref={sliderRef}
        min={0}
        max={300}
        marks={{
          0: {
            style: { color: '#000000' },
            label: <strong>0</strong>,
          },
          50: {
            style: { color: '#000000' },
            label: <span>50</span>,
          },
          100: {
            style: { color: '#000000' },
            label: <strong>100</strong>,
          },
          150: {
            style: { color: '#000000' },
            label: <span>150</span>,
          },
          200: {
            style: { color: '#000000' },
            label: <strong>200</strong>,
          },
          250: {
            style: { color: '#000000' },
            label: <span>250</span>,
          },
          300: {
            style: { color: '#000000' },
            label: <strong>300</strong>,
          },
        }}
        value={sliderValue}
        onAfterChange={onChange}
        onChange={onSliderValueChange}
        style={{
          width: '78%',
          display: 'inline-block',
        }}
      />
    </div>
  );
};
export default ExerciseLOC;
