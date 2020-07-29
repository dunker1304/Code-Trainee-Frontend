import { Table, Button, Space, Popconfirm, notification, Tooltip } from 'antd';
import TestCaseModal from './TestCaseModal';
import { useState, useEffect } from 'react';
import {
  CloseOutlined,
  CheckOutlined,
  EditTwoTone,
  DeleteTwoTone,
} from '@ant-design/icons';
import axios from 'axios';
import next from 'next';
import { previewImage } from 'antd/lib/upload/utils';

const StepTestCases = ({ exerciseId, next = () => {}, prev = () => {} }) => {
  // modal
  let [showAddModal, setShowAddModal] = useState(false);
  let [showEditModal, setShowEditModal] = useState(false);
  // table
  let [loading, setLoading] = useState(false);
  let [tableData, setTableData] = useState([]);
  let [currPageTable, setCurrPageTable] = useState(1);
  let [currPageSize, setCurrPageSize] = useState(10);
  let [currRecord, setCurrRecord] = useState({});

  const handleNext = () => {
    next();
  };

  const handlePrevious = () => {
    prev();
  };

  const handleEditRecord = async (data) => {
    try {
      const res = await axios.post(`${process.env.API}/api/testcase/update`, {
        isHidden: data.isHidden,
        input: data.input,
        output: data.output,
        id: currRecord.key,
      });
      if (res.data.success) {
        setCurrRecord({});
        loadTable();
      } else {
        throw new Error('');
      }
    } catch (e) {
      notification.error({
        message: 'Notification',
        description: 'Something get wrong!',
      });
      console.log(e);
    }
  };

  const handleDeleteRecord = async (id) => {
    try {
      const res = await axios.post(`${process.env.API}/api/testcase/delete`, {
        id: id,
      });
      if (res.data.success) {
        loadTable();
      } else {
        throw new Error('');
      }
    } catch (e) {
      notification.error({
        message: 'Notification',
        description: 'Something get wrong!',
      });
      console.log(e);
    }
  };

  const handleAddRecord = async (data) => {
    try {
      const res = await axios.post(`${process.env.API}/api/testcase/create`, {
        isHidden: data.isHidden,
        dataInput: data.input,
        expectedOutput: data.output,
        exerciseId: exerciseId,
      });
      if (res.data.success) {
        loadTable();
      } else {
        throw new Error('');
      }
    } catch (e) {
      notification.error({
        message: 'Notification',
        description: 'Something get wrong!',
      });
      console.log(e);
    }
  };

  const loadTable = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.API}/api/testcase/exercise/${exerciseId}`
      );
      if (res.data.success) {
        let testcases = [];
        res.data.data.result.forEach((e) => {
          testcases.push({
            key: e.id,
            input: e.input,
            output: e.expectedOutput,
            hidden: e.isHidden,
            createdAt: e.createdAt,
            updatedAt: e.updatedAt,
          });
        });
        setTableData(testcases);
      } else {
        throw new Error('');
      }
    } catch (e) {
      notification.error({
        message: 'Notification',
        description: 'Something get wrong!',
      });
      console.log(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTable();
  }, []);

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
        onOK={handleAddRecord}
        visible={showAddModal}
      />
      <TestCaseModal
        title='Edit Test Case'
        okText='Save'
        visible={showEditModal}
        isCreate={false}
        onCancel={() => setShowEditModal(false)}
        onCancelX={() => setShowEditModal(false)}
        onOK={handleEditRecord}
        input={currRecord.input}
        output={currRecord.output}
        isHidden={currRecord.hidden}
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
              dataIndex: 'hidden',
              key: 'hidden',
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
                      onConfirm={() => handleDeleteRecord(record.key)}
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
          dataSource={tableData}
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
      <div
        className='step-actions'
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '50px',
        }}>
        <Button
          onClick={handlePrevious}
          type='primary'
          size='large'
          style={{
            width: 100,
          }}>
          Previous
        </Button>
        <Button
          onClick={handleNext}
          loading={loading}
          type='primary'
          size='large'
          style={{
            width: 100,
          }}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default StepTestCases;
