import { Row, Col, Menu, Button, Popover, Spin } from 'antd';
import AceEditor from 'react-ace';
import { useState } from 'react';

const SnippetTemplate = () => {
  console.log('abc');
  let [data, setData] = useState(false);
  return (
    <Col>
      <Row>Playground Templates</Row>
      {/* <Row>
        <Menu
          mode='horizontal'
          selectable={false}
          selectedKeys={selectedMenuMap[record.key] || []}
          onClick={({ key }) => {
            if (key === 'edit') {
              let currReadOnly = readOnlyMap[record.key]?.value;
              readOnlyMap[record.key] = { value: !currReadOnly };
              selectedMenuMap[record.key] = currReadOnly ? [] : [key];
              console.log('def', readOnlyMap);
            } else if (key === 'save' && !!valueMap[record.key]) {
              handleSaveSnippet(record.key);
            }
          }}
          style={{ marginBottom: '8px' }}>
          <Menu.Item key='status' disabled style={{ width: '100px' }}>
            {readOnlyMap[record.key]?.value ? 'Editable' : 'ReadOnly'}
          </Menu.Item>
          <Menu.Item
            key='edit'
            icon={<EditOutlined style={{ fontSize: '16px' }} />}>
            Edit
          </Menu.Item>
          <Menu.Item
            key='save'
            icon={<SaveOutlined style={{ fontSize: '16px' }} />}>
            {!!!valueMap[record.key] && (
              <Popover
                trigger='hover'
                title='No need to Save'
                content='This template does not changed.'>
                Save
              </Popover>
            )}
            {!!valueMap[record.key] && 'Save'}
          </Menu.Item>
        </Menu>
      </Row>
      <Spin tip='Loading' spinning={!!loadingMap[record.key]}>
        <AceEditor
          readOnly={readOnlyMap[record.key]?.value}
          className='playground'
          mode={record.name}
          theme='kuroir'
          value={valueMap[record.key]?.value || ''}
          showGutter={true}
          onChange={(value, event) => {
            valueMap[record.key].value = value;
          }}
          style={{ width: '100%', height: '300px' }}
        />
      </Spin> */}
    </Col>
  );
};
export default SnippetTemplate;
