import { useState, useEffect, useRef } from 'react';
import { Tag, Input, Tooltip, AutoComplete, Space, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const ExerciseTags = ({ tags = [], setTags = (arr) => {}, allTags = [] }) => {
  let [inputVisible, setInputVisible] = useState(false);
  let [inputValue, setInputValue] = useState('');
  let [editInputIndex, setEditInputIndex] = useState(-1);
  let [editInputValue, setEditInputValue] = useState('');
  let [suggestTags, setSuggestTags] = useState(allTags);
  let inputRef = useRef();
  let editInputRef = useRef();

  const handleClose = (removedTag) => {
    setTags([...tags.filter((tag) => tag !== removedTag)]);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  const handleInputChange = (event) => {
    let value = event.target.value;
    setInputValue(value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue.trim()) === -1) {
      setTags([...tags, inputValue.trim()]);
    }
    console.log('tags', tags);
    setInputVisible(false);
    setInputValue('');
  };

  const handleEditInputChange = (event) => {
    let value = event.target.value;
    setEditInputValue(value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    if (editInputValue && tags.indexOf(editInputValue.trim()) === -1) {
      newTags[editInputIndex] = editInputValue.trim();
    }
    setTags(newTags);
    setEditInputIndex(-1);
    setEditInputValue('');
  };

  const onSelectSuggestion = (value) => {
    if (editInputIndex === -1) {
      handleInputChange({ target: { value: value } });
    } else {
      handleEditInputChange({ target: { value: value } });
    }
  };

  const handleSearch = (value) => {
    let suggestValues = [...allTags]
      .filter((event) => event.toString().includes(value))
      .map((event) => ({ value: event }));
    setSuggestTags([...suggestValues]);
  };

  useEffect(() => {
    editInputRef.current?.focus();
  }, [editInputIndex, editInputValue]);

  return (
    <>
      {tags.map((tag, index) => {
        if (editInputIndex === index) {
          return (
            <AutoComplete
              options={suggestTags}
              style={{ width: 200 }}
              key={tag}
              defaultValue={editInputValue}
              onSelect={onSelectSuggestion}
              defaultOpen={true}
              autoFocus={true}
              onFocus={(e) => handleSearch(editInputValue)}
              onSearch={handleSearch}>
              <Input
                ref={editInputRef}
                key={tag}
                size='small'
                className='tag-input'
                value={editInputValue}
                onChange={handleEditInputChange}
                onBlur={handleEditInputConfirm}
                onPressEnter={handleEditInputConfirm}
                style={{
                  width: 200,
                  verticalAlign: 'top',
                }}
                maxLength={20}
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
            onClose={() => handleClose(tag)}
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
          options={suggestTags}
          style={{ width: 200 }}
          defaultValue={inputValue}
          onSelect={onSelectSuggestion}
          onSearch={handleSearch}
          autoFocus={true}
          onFocus={(e) => handleSearch(inputValue)}
          defaultOpen={true}>
          <Input
            ref={inputRef}
            type='text'
            size='small'
            className='tag-input'
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
            style={{
              width: 200,
              verticalAlign: 'top',
            }}
            maxLength={20}
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
