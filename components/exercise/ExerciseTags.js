import { useState, useEffect, useRef } from 'react';
import { Tag, Input, Tooltip, AutoComplete, Space, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const ExerciseTags = ({ value = [], onChange = (newValue) => {} }) => {
  // input new tag
  let [inputVisible, setInputVisible] = useState(false);
  let [inputValue, setInputValue] = useState('');
  // edit old tag
  let [editInputIndex, setEditInputIndex] = useState(-1);
  let [editInputValue, setEditInputValue] = useState('');
  // suggest tags
  let [suggestedValues, setSuggestedValues] = useState([]);
  let [originalValues, setOriginalValues] = useState([]);

  let isUnMounted = useRef(false);

  const handleRemoveTag = (removedTag) => {
    onChange([...value.filter((tag) => tag !== removedTag)]);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const handleInputConfirm = () => {
    if (inputValue && value.indexOf(inputValue.trim()) === -1) {
      onChange([...value, inputValue.trim()]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleEditInputChange = (value) => {
    setEditInputValue(value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...value];
    if (editInputValue && value.indexOf(editInputValue.trim()) === -1) {
      newTags[editInputIndex] = editInputValue.trim();
    }
    onChange(newTags);
    setEditInputIndex(-1);
    setEditInputValue('');
  };

  const onSelectSuggestion = (selectedValue) => {
    if (editInputIndex === -1) {
      if (selectedValue && value.indexOf(selectedValue.trim()) === -1) {
        onChange([...value, selectedValue.trim()]);
      }
      setInputVisible(false);
      setInputValue('');
    } else {
      const newTags = [...value];
      if (selectedValue && value.indexOf(selectedValue.trim()) === -1) {
        newTags[editInputIndex] = selectedValue.trim();
      }
      onChange(newTags);
      setEditInputIndex(-1);
      setEditInputValue('');
    }
  };

  const handleTriggerSelection = (value) => {
    let suggestValues = [...originalValues]
      .filter((event) => event.toString().includes(value))
      .map((event) => ({ value: event }));
    setSuggestedValues([...suggestValues]);
  };

  const loadOriginalValues = async () => {
    try {
      const res = await axios.get(`${process.env.API}/api/tags/all`);
      if (res.data.success) {
        !isUnMounted.current &&
          setOriginalValues([...res.data.data.map((e) => e.name)]);
      } else {
        throw new Error('');
      }
    } catch (e) {
      console.log('error', e);
    }
  };

  useEffect(() => {
    loadOriginalValues();
    return () => {
      isUnMounted.current = true;
    };
  }, []);

  return (
    <>
      {value.map((tag, index) => {
        if (editInputIndex === index) {
          return (
            <AutoComplete
              options={suggestedValues}
              style={{ width: 200 }}
              key={tag}
              defaultValue={editInputValue}
              onSelect={onSelectSuggestion}
              onChange={handleEditInputChange}
              onSearch={handleTriggerSelection}
              onBlur={handleEditInputConfirm}
              onFocus={(e) => handleTriggerSelection(editInputValue)}
              defaultOpen={true}
              autoFocus={true}>
              <Input
                key={tag}
                size='small'
                className='tag-input'
                value={editInputValue}
                onPressEnter={handleEditInputConfirm}
                style={{
                  width: 200,
                  verticalAlign: 'top',
                }}
              />
            </AutoComplete>
          );
        }
        const isLongTag = tag.length > 15;
        const handleLongTag = (tag) => tag.slice(0, 15) + '...';
        const tagElem = (
          <Tag
            color='green'
            className='edit-tag'
            key={tag}
            closable={index !== 0} // disable first tag, cannot deletable
            onClose={() => handleRemoveTag(tag)}
            style={{
              userSelect: 'none',
            }}>
            <span
              onDoubleClick={(event) => {
                if (index !== 0) {
                  setEditInputIndex(index);
                  setEditInputValue(tag);
                  event.preventDefault();
                }
              }}>
              {isLongTag ? handleLongTag(tag) : tag}
            </span>
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {inputVisible ? (
        <AutoComplete
          options={suggestedValues}
          style={{ width: 200 }}
          defaultValue={inputValue}
          onSelect={onSelectSuggestion}
          onSearch={handleTriggerSelection}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          autoFocus={true}
          onFocus={(e) => handleTriggerSelection(inputValue)}
          defaultOpen={true}>
          <Input
            type='text'
            size='small'
            className='tag-input'
            value={inputValue}
            onPressEnter={handleInputConfirm}
            style={{
              width: 200,
              verticalAlign: 'top',
            }}
          />
        </AutoComplete>
      ) : (
        <Tag
          color='blue'
          className='site-tag-plus'
          onClick={showInput}
          style={{
            background: '#fff',
            borderStyle: 'dashed',
          }}>
          <PlusOutlined /> New Tag
        </Tag>
      )}
    </>
  );
};

export default ExerciseTags;
