import { Table, Button, Space, Popconfirm, Modal, notification } from 'antd';
import TestCaseModal from './TestCaseModal';
import { useState, useEffect } from 'react';
import {
  EditOutlined,
  DeleteOutlined,
  CloseOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const StepTestCases = ({ exerciseId }) => {
  let [showAddModal, setShowAddModal] = useState(false);
  let [showEditModal, setShowEditModal] = useState(false);
  let [currRecord, setCurrRecord] = useState({
    input: '',
    output: '',
    hidden: false,
  });

  let [tableData, setTableData] = useState([]);
  let [currPageTable, setCurrPageTable] = useState(1);
  let [currPageSize, setCurrPageSize] = useState(10);
  const loadTable = async () => {
    const res = await axios.get(
      `http://localhost:1337/api/testcase/get-by-exercise?exerciseId=${exerciseId}`
    );
    console.log(res.data);
    if (res.data.success) {
      let temp = [];
      res.data.data.result.forEach((e) => {
        temp.push({
          key: e.id,
          input: e.input,
          output: e.expectedOutput,
          hidden: e.isHidden,
          createdAt: e.createdAt,
          updatedAt: e.updatedAt,
        });
      });
      setTableData(temp);
    }
  };
  useEffect(() => {
    loadTable();
  }, []);
  const handleEditRecord = async (data) => {
    const res = await axios.post(`http://localhost:1337/api/testcase/update`, {
      isHidden: data.isHidden,
      input: data.input,
      output: data.output,
      id: currRecord.key,
    });
    if (res.data.success) {
      notification.info({
        message: 'Notification',
        description: <p>Success!</p>,
      });
      setShowEditModal(false);
      setCurrRecord({
        input: '',
        output: '',
        hidden: false,
      });
      loadTable();
    } else {
      notification.error({
        message: 'Notification',
        description: <p>Fail!</p>,
      });
    }
  };
  const handleDeleteRecord = async (record) => {
    const res = await axios.post(`http://localhost:1337/api/testcase/delete`, {
      id: record.key,
    });
    if (res.data.success) {
      notification.info({
        message: 'Notification',
        description: <p>Success!</p>,
      });
      loadTable();
    } else {
      notification.error({
        message: 'Notification',
        description: <p>Fail!</p>,
      });
    }
  };
  const handleAddRecord = async (data) => {
    const res = await axios.post(`http://localhost:1337/api/testcase/create`, {
      isHidden: data.isHidden,
      dataInput: data.input,
      expectedOutput: data.output,
      exerciseId: exerciseId,
    });
    if (res.data.success) {
      notification.info({
        message: 'Notification',
        description: <p>Success!</p>,
      });
      setShowAddModal(false);
      loadTable();
    } else {
      notification.error({
        message: 'Notification',
        description: <p>Fail!</p>,
      });
    }
  };

  return (
    <React.Fragment>
      <Button type='primary' onClick={() => setShowAddModal(true)}>
        Add Test Case
      </Button>
      <TestCaseModal
        title='Add Test Case'
        okText='Add'
        onCancel={() => setShowAddModal(false)}
        onCancelX={() => setShowAddModal(false)}
        onOK={handleAddRecord}
        visible={showAddModal}
      />
      <TestCaseModal
        title='Edit Test Case'
        okText='Save'
        visible={showEditModal}
        onCancel={() => setShowEditModal(false)}
        onCancelX={() => setShowEditModal(false)}
        onOK={handleEditRecord}
        input={currRecord.input}
        output={currRecord.output}
        isHidden={currRecord.hidden}
      />
      <Table
        bordered
        columns={[
          {
            title: 'No.',
            key: 'no',
            width: '60px',
            render: (text, record, index) => {
              return index + 1 + (currPageTable - 1) * currPageSize;
            },
          },
          { title: 'Data Input', dataIndex: 'input', key: 'input' },
          { title: 'Expected Ouput', dataIndex: 'output', key: 'output' },
          {
            title: 'Hidden',
            dataIndex: 'hidden',
            key: 'hidden',
            render: (hidden) => {
              if (hidden) {
                return <CheckOutlined style={{ fontSize: '16px' }} />;
              } else {
                return <CloseOutlined style={{ fontSize: '16px' }} />;
              }
            },
          },
          { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt' },
          { title: 'Updated At', dataIndex: 'updatedAt', key: 'updatedAt' },
          {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
              <Space size='middle'>
                <a
                  href='#'
                  onClick={() => {
                    setCurrRecord(record);
                    setShowEditModal(true);
                  }}>
                  <EditOutlined style={{ fontSize: '16px' }} />
                </a>
                <Popconfirm
                  title='Are you sure delete this test case?'
                  okText='Yes'
                  onConfirm={() => handleDeleteRecord(record)}
                  cancelText='No'>
                  <a href='#'>
                    <DeleteOutlined style={{ fontSize: '16px' }} />
                  </a>
                </Popconfirm>
              </Space>
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
    </React.Fragment>
  );
};

export default StepTestCases;
