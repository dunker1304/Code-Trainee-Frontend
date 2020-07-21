import Head from 'next/head';
import { Table, notification, Tag, Space, Popconfirm, Button } from 'antd';
import { CheckCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import axios from 'axios';

const ApproveExercise = ({}) => {
  // table
  let [tableData, setTableData] = useState([]);
  let [currPageTable, setCurrPageTable] = useState(1);
  let [currPageSize, setCurrPageSize] = useState(10);
  let [tableLoading, setTablLoading] = useState(false);

  useEffect(() => {
    loadTable();
  }, []);
  const handleApproveExercise = async (record) => {
    try {
      setTablLoading(true);
      const res = await axios.post(
        `${process.env.API}/api/exercise/approve/update`,
        {
          id: record.key,
        }
      );
      setTablLoading(false);
      if (res.data.success) {
        loadTable();
        notification.info({
          message: 'Notification',
          description: 'Approve Exercise Successfully!',
        });
      } else {
        notification.error({
          message: 'Notification',
          description: 'Approve Exercise Fail',
        });
      }
    } catch (e) {
      notification.error({
        message: 'Notification',
        description: 'Approve Exercise Fail',
      });
      setTablLoading(false);
      console.log(e);
    }
  };
  const handleDeleteExercise = async (record) => {
    try {
      const res = await axios.post(`${process.env.API}/api/exercise/delete`, {
        id: record.key,
      });
      console.log(res.data);
      if (res.data.success) {
        notification.info({
          message: 'Notification',
          description: 'Success',
        });
        loadTable();
      } else {
        notification.error({
          message: 'Notification',
          description: 'Delete Fail',
        });
      }
    } catch (e) {
      notification.error({
        message: 'Notification',
        description: 'Delete Fail',
      });
      setTablLoading(false);
      console.log(e);
    }
  };

  const loadTable = async () => {
    try {
      setTablLoading(true);
      const res = await axios.get(`${process.env.API}/api/exercise/approve`);
      setTablLoading(false);
      if (res.data.success) {
        let data = [];
        res.data.data.forEach((e) => {
          data.push({
            key: e.id,
            title: e.title,
            level: e.level,
            points: e.points,
            content: e.content,
            lastModified: e.updatedAt,
          });
        });
        setTableData([...data]);
      }
    } catch (e) {
      notification.error({
        message: 'Notification',
        description: 'Load Data Fail',
      });
      setTablLoading(false);
      console.log(e);
    }
  };
  return (
    <>
      <Head>
        <title>Approve Exercise</title>
      </Head>
      <Table
        loading={tableLoading}
        bordered
        title={() => 'Exercises need to Approval'}
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
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: '220px',
            ellipsis: true,
          },
          {
            title: 'Level',
            dataIndex: 'level',
            key: 'level',
            width: '110px',
            render: (text, record) => {
              let tag = record.level.toUpperCase();
              let color =
                tag === 'HARD'
                  ? 'volcano'
                  : tag === 'MEDIUM'
                  ? 'geekblue'
                  : 'green';
              return (
                <>
                  <Tag color={color} key={tag}>
                    {tag}
                  </Tag>
                </>
              );
            },
          },
          { title: 'LOC', dataIndex: 'points', key: 'points', width: '80px' },
          {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            ellipsis: true,
            width: '360px',
          },
          {
            title: 'Last Modified',
            dataIndex: 'lastModified',
            key: 'lastModified',
            width: '200px',
            ellipsis: true,
          },
          {
            title: 'Action',
            key: 'action',
            fixed: 'right',
            width: '250px',
            render: (text, record) => (
              <Space size='middle'>
                <Popconfirm
                  title='Are you sure approve this exercise?'
                  okText='Yes'
                  onConfirm={() => handleApproveExercise(record)}
                  cancelText='No'>
                  <Button
                    type='primary'
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                    <CheckCircleOutlined
                      style={{
                        fontSize: '17px',
                      }}
                    />
                    Approve
                  </Button>
                </Popconfirm>
                <Popconfirm
                  title='Are you sure delete this exercise?'
                  okText='Yes'
                  onConfirm={() => handleDeleteExercise(record)}
                  cancelText='No'>
                  <Button
                    type='primary'
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                    <DeleteOutlined
                      style={{
                        fontSize: '17px',
                      }}
                    />
                    Delete
                  </Button>
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
    </>
  );
};
ApproveExercise.getInitialProps = async (ctx) => {
  let id = ctx.query?.id;
  return { id };
};
export default ApproveExercise;
