import { Table, Row, Col, Button, Space, Popconfirm, Tag } from 'antd';
import {
  CheckCircleTwoTone,
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import axios from 'axios';

const ExerciseList = ({ ownerId = 0 }) => {
  let [tableData, setTableData] = useState([]);
  let [currPageTable, setCurrPageTable] = useState(1);
  let [currPageSize, setCurrPageSize] = useState(10);
  useEffect(() => {
    (async () => {
      const res = await axios.get(
        `http://localhost:1337/api/exercise/get-by-owner?ownerId=${ownerId}`
      );
      if (res.data.success) {
        let data = [];
        res.data.data.forEach((e) => {
          data.push({
            key: e.id,
            title: e.title,
            level: e.level,
            points: e.points,
            like: e.like,
            dislike: e.dislike,
            content: e.content,
            approved: e.isApproved,
            lastModified: e.updatedAt,
          });
        });
        setTableData([...data]);
      }
    })();
  }, []);

  const handleCreateRecord = () => {};

  const handleUpdateRecord = (record) => {};

  const handleDeleteRecord = (record) => {};

  return (
    <>
      <Table
        title={() => (
          <Row
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}>
            <Col>Exercise List</Col>
            <Col>
              <Button type='primary' onClick={handleCreateRecord}>
                Create Exercise
              </Button>
            </Col>
          </Row>
        )}
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
          { title: 'Like', dataIndex: 'like', key: 'like', width: '80px' },
          {
            title: 'Dislike',
            dataIndex: 'dislike',
            key: 'dislike',
            width: '80px',
          },
          {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            ellipsis: true,
            width: '260px',
          },
          {
            title: 'Approved',
            dataIndex: 'approved',
            key: 'approved',
            width: '100px',
            render: (text, record) => {
              return (
                <>
                  {record.approved ? (
                    <span>
                      <CheckCircleTwoTone twoToneColor='#52c41a' /> Approved
                    </span>
                  ) : (
                    <span>
                      <LoadingOutlined style={{ fontSize: '16px' }} />
                      Waiting...
                    </span>
                  )}
                </>
              );
            },
          },
          {
            title: 'Last Modified',
            dataIndex: 'lastModified',
            key: 'lastModified',
            width: '150px',
            ellipsis: true,
          },
          {
            title: 'Action',
            key: 'action',
            fixed: 'right',
            width: '150px',
            render: (text, record) => (
              <Space size='middle'>
                <a
                  href='#'
                  onClick={() => {
                    setCurrRecord(record);
                    handleUpdateRecord(record);
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
    </>
  );
};
export default ExerciseList;
