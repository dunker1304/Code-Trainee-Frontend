import { Space, Slider, Row, Col, InputNumber, notification } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import { useState, useEffect, useRef } from 'react';

const ExerciseLOC = ({ value, onChange, min, max }) => {
  let [sliderValue, setSliderValue] = useState(value);
  let inputRef = useRef();

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

  useEffect(() => {
    setSliderValue(value);
  }, [value]);

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
      <InputNumber
        ref={inputRef}
        value={sliderValue}
        min={min}
        max={max}
        onChange={onInputValueChange}
        onPressEnter={() => inputRef.current.blur()}
        style={{
          width: '15%',
          display: 'inline-block',
        }}
      />
      <Slider
        min={min}
        max={max}
        marks={{
          [min]: {
            style: { color: '#000000' },
            label: <strong>{min}</strong>,
          },
          [Math.floor((max + 3 * min) / 4)]: {
            style: { color: '#000000' },
            label: <span>{Math.floor((max + 3 * min) / 4)}</span>,
          },
          [Math.floor((min + max) / 2)]: {
            style: { color: '#000000' },
            label: <strong>{Math.floor((min + max) / 2)}</strong>,
          },
          [Math.floor((min + 3 * max) / 4)]: {
            style: { color: '#000000' },
            label: <span>{Math.floor((min + 3 * max) / 4)}</span>,
          },
          [max]: {
            style: { color: '#000000' },
            label: <strong>{max}</strong>,
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
