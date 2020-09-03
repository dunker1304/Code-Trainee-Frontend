import { Table, Modal, Button } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/github';

const ReviewStepTestcase = ({ data = [] }) => {
  let [currPageTable, setCurrPageTable] = useState(1);
  let [currPageSize, setCurrPageSize] = useState(10);
  // preview data
  let [showPreview, setShowPreview] = useState(false);
  let [previewData, setPreviewData] = useState({
    title: '',
    content: '',
  });

  const onCancelPreview = () => {
    setShowPreview(false);
    setPreviewData({ title: '', content: '' });
  };

  return (
    <>
      <h2
        style={{
          marginTop: 10,
          marginBottom: 10,
        }}>
        {`Testcase use to evaluate student's answers`}
      </h2>
      <span style={{ fontSize: 13 }}>
        <i>
          {`Click cell in below table to view preview 'Data Input' or 'Expected Output'.`}
        </i>
      </span>
      <Table
        bordered
        scroll={{ x: 1000 }}
        columns={[
          {
            title: 'No.',
            key: 'no',
            width: '60px',
            render: (text, record, index) => {
              return index + 1 + (currPageTable - 1) * currPageSize;
            },
          },
          {
            title: 'Data Input',
            dataIndex: 'input',
            key: 'input',
            width: '340px',
            ellipsis: true,
            sorter: (a, b) => a.input.localeCompare(b.input),
          },
          {
            title: 'Expected Output',
            dataIndex: 'output',
            key: 'output',
            width: '340px',
            ellipsis: true,
            sorter: (a, b) => a.output.localeCompare(b.output),
          },
          {
            title: 'Hidden',
            dataIndex: 'isHidden',
            key: 'isHidden',
            width: '100px',
            render: (hidden) => {
              if (hidden) {
                return <CheckOutlined style={{ fontSize: '16px' }} />;
              }
            },
            sorter: (a, b) => (a.isHidden ? -1 : 1),
            filters: [
              {
                text: 'Public',
                value: 'public',
              },
              { text: 'Hidden', value: 'hidden' },
            ],
            onFilter: (value, record) => {
              console.log({ value: value });
              if (value === 'public') {
                return record.isHidden === false;
              }
              if (value === 'hidden') {
                return record.isHidden === true;
              }
            },
          },
        ]}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              const cellIndex = event.target.cellIndex;
              if (cellIndex === 1) {
                setPreviewData({
                  title: `Preview Data Input`,
                  content: record.input,
                });
                setShowPreview(true);
              }
              if (cellIndex === 2) {
                setPreviewData({
                  title: `Preview Expected Output`,
                  content: record.output,
                });
                setShowPreview(true);
              }
            },
          };
        }}
        dataSource={data}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '30'],
        }}
        onChange={(pagination, filter, sorter) => {
          setCurrPageSize(pagination.pageSize);
          setCurrPageTable(pagination.current);
        }}
      />
      <Modal
        className='preview-testcase-modal'
        title={previewData.title}
        visible={showPreview}
        style={{ marginTop: -30 }}
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
            width: '100%',
          }}>
          <Highlight {...defaultProps} theme={theme} code={previewData.content}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre
                className={className}
                style={{
                  textAlign: 'left',
                  padding: '0.5em',
                  margin: 0,
                  overflow: 'scroll',
                  maxHeight: 500,
                  height: '100%',
                  ...style,
                }}>
                {tokens.map((line, i) => (
                  <div
                    style={{ display: 'table-row' }}
                    key={i}
                    {...getLineProps({ line, key: i })}>
                    <span
                      style={{
                        display: 'inline-block',
                        textAlign: 'right',
                        paddingRight: '1em',
                        userSelect: 'none',
                        opacity: '0.5',
                        borderRight: '1px solid gray',
                        width: '40px',
                      }}>
                      {i + 1}
                    </span>
                    <span
                      style={{
                        display: 'inline-block',
                        paddingLeft: '1em',
                        paddingRight: '1em',
                      }}>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token, key })} />
                      ))}
                    </span>
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </div>
      </Modal>
    </>
  );
};
export default ReviewStepTestcase;
