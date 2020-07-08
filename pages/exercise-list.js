import { Table, Row, Col, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import axios from 'axios';

const ExerciseList = () => {
  let [tableData, setTableData] = useState([]);
  let [currPageTable, setCurrPageTable] = useState(1);
  let [currPageSize, setCurrPageSize] = useState(10);
  useEffect(() => {
    (async () => {
      let res = await axios.get(``);
      if (res.data.success) {
        let data = [];
        res.data.forEach((e) => {
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
        setTableData({ ...data });
      }
    })();
  });

  const handleEditRecord = (record) => {};

  const handleDeleteRecord = (record) => {};

  return (
    <>
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
          { title: 'Title', dataIndex: 'title', key: 'title' },
          { title: 'Level', dataIndex: 'level', key: 'level' },
          { title: 'LOC', dataIndex: 'points', key: 'points' },
          { title: 'Like', dataIndex: 'like', key: 'like' },
          { title: 'Dislike', dataIndex: 'dislike', key: 'dislike' },
          {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            ellipsis: true,
          },
          { title: 'Approved', dataIndex: 'approved', key: 'approved' },
          {
            title: 'Last Modified',
            dataIndex: 'lastModified',
            key: 'lastModified',
          },
          {
            title: 'Action',
            key: 'action',
            fixed: 'right',
            render: (text, record) => (
              <Space size='middle'>
                <a
                  href='#'
                  onClick={() => {
                    setCurrRecord(record);
                    handleEditRecord(record);
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
