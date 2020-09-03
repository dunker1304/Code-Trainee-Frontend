import {
  Table,
  Button,
  Space,
  Popconfirm,
  notification,
  Tooltip,
  Modal,
} from 'antd';
import TestCaseModal from './TestCaseModal';
import { useState, useEffect, useRef } from 'react';
import {
  CloseOutlined,
  CheckOutlined,
  EditTwoTone,
  DeleteTwoTone,
} from '@ant-design/icons';
import Highlight, { defaultProps } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/github';
import axios from 'axios';

const StepTestCases = ({ testcases = [], setTestCases }) => {
  // modal
  let [showAddModal, setShowAddModal] = useState(false);
  let [showEditModal, setShowEditModal] = useState(false);
  // table
  let [loading, setLoading] = useState(false);
  let [currPageTable, setCurrPageTable] = useState(1);
  let [currPageSize, setCurrPageSize] = useState(10);
  let [currRecord, setCurrRecord] = useState({});
  // keep 'key' for record
  let count = useRef(-1);
  // preview data
  let [showPreview, setShowPreview] = useState(false);
  let [previewData, setPreviewData] = useState({
    title: '',
    content: '',
  });

  const onEditRecord = (data) => {
    const key = currRecord.key;
    const afterEdited = [...testcases].map((t) => {
      if (t.key === key) {
        return {
          input: data.input,
          output: data.output,
          isHidden: data.isHidden,
          id: currRecord.id,
          key: key,
        };
      }
      return t;
    });
    setTestCases(afterEdited);
  };

  const onDeleteRecord = (key) => {
    const afterDeleted = [...testcases].filter((t) => t.key !== key);
    setTestCases(afterDeleted);
  };

  const onAddRecord = (data) => {
    count.current = count.current - 1;
    setTestCases([
      ...testcases,
      {
        input: data.input,
        output: data.output,
        isHidden: data.isHidden,
        key: count.current,
      },
    ]);
  };

  const onCancelPreview = () => {
    setShowPreview(false);
    setPreviewData({ title: '', content: '' });
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
        <Button
          type='primary'
          size='middle'
          onClick={() => setShowAddModal(true)}
          style={{
            marginBottom: 10,
          }}>
          Add Test Case
        </Button>
      </div>
      <TestCaseModal
        title='Add Test Case'
        isCreate={true}
        okText='Add'
        cancelText='Cancel'
        onCancel={() => setShowAddModal(false)}
        onCancelX={() => setShowAddModal(false)}
        onOK={onAddRecord}
        visible={showAddModal}
      />
      <TestCaseModal
        title='Edit Test Case'
        okText='Save'
        visible={showEditModal}
        isCreate={false}
        onCancel={() => setShowEditModal(false)}
        onCancelX={() => setShowEditModal(false)}
        onOK={onEditRecord}
        input={currRecord.input}
        output={currRecord.output}
        isHidden={currRecord.isHidden}
      />
      <div style={{ minHeight: '350px' }}>
        <Table
          loading={loading}
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
            },
            {
              title: 'Expected Output',
              dataIndex: 'output',
              key: 'output',
              width: '340px',
              ellipsis: true,
            },
            {
              title: 'Hidden',
              dataIndex: 'isHidden',
              key: 'isHidden',
              width: '100px',
              render: (hidden) => {
                if (hidden) {
                  return <CheckOutlined style={{ fontSize: '16px' }} />;
                } else {
                  // return <CloseOutlined style={{ fontSize: '16px' }} />;
                }
              },
            },
            {
              title: 'Action',
              key: 'action',
              width: '130px',
              fixed: 'right',
              render: (text, record) => (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                  <Tooltip placement='top' title={'Edit'}>
                    <Button
                      ghost
                      type='link'
                      onClick={() => {
                        setCurrRecord({ ...record });
                        setShowEditModal(true);
                      }}
                      style={{
                        border: 'none',
                      }}>
                      <EditTwoTone style={{ fontSize: '16px' }} />
                    </Button>
                  </Tooltip>
                  <Tooltip placement='top' title={'Delete'}>
                    <Popconfirm
                      title='Are you sure delete this test case?'
                      okText='Yes'
                      onConfirm={() => onDeleteRecord(record.key)}
                      cancelText='No'
                      placement='left'>
                      <Button
                        ghost
                        type='link'
                        style={{
                          border: 'none',
                        }}>
                        <DeleteTwoTone style={{ fontSize: '16px' }} />
                      </Button>
                    </Popconfirm>
                  </Tooltip>
                </div>
              ),
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
          dataSource={testcases}
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
      </div>
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
    </div>
  );
};

export default StepTestCases;
