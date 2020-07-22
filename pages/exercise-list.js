import {
  Table,
  Row,
  Col,
  Button,
  Space,
  Popconfirm,
  Tag,
  notification,
} from 'antd';
import {
  CheckCircleTwoTone,
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '../components/Header';

const ExerciseList = ({ ownerId = 0 }) => {
  // table
  let [tableData, setTableData] = useState([]);
  let [currPageTable, setCurrPageTable] = useState(1);
  let [currPageSize, setCurrPageSize] = useState(10);
  let [tableLoading, setTablLoading] = useState(false);
  // naviagte
  let router = useRouter();
  // state button loading
  let [loadingButtonCreate, setLoadingButtonCreate] = useState(false);
  let [loadingButtonUpdate, setLoadingButtonUpdate] = useState(false);

  useEffect(() => {
    loadTable();
  }, []);

  const loadTable = async () => {
    try {
      setTablLoading(true);
      const res = await axios.get(
        `${process.env.API}/api/exercise/get-by-owner?ownerId=${ownerId}`
      );
      setTablLoading(false);
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
    } catch (e) {
      notification.error({
        title: 'Notification',
        message: 'Load Data Fail',
      });
      setTablLoading(false);
      console.log(e);
    }
  };

  const handleCreateExercise = () => {
    setLoadingButtonCreate(true);
    router.push({
      pathname: '/exercise',
      query: {},
    });
  };

  const handleDeleteRecord = async (record) => {
    const res = await axios.post(`${process.env.API}/api/exercise/delete`, {
      id: record.key,
    });
    console.log(res.data);
    if (res.data.success) {
      notification.info({
        title: 'Notification',
        message: 'Success',
      });
      loadTable();
    } else {
      notification.error({
        title: 'Notification',
        message: 'Fail',
      });
    }
  };

  return (
    <>
      <Head>
        <title>Exercise List</title>
      </Head>
      <Header />
      <div
        style={{
          marginTop: '50px',
        }}>
        <Table
          loading={tableLoading}
          title={() => (
            <Row
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}>
              <Col>Exercise List</Col>
              <Col>
                <Button
                  type='primary'
                  onClick={handleCreateExercise}
                  loading={loadingButtonCreate}>
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
              align: 'center',
              render: (text, record) => {
                return (
                  <>
                    {record.approved ? (
                      <CheckCircleTwoTone
                        twoToneColor='#52c41a'
                        style={{ fontSize: '25px' }}
                      />
                    ) : (
                      <span>Waiting...</span>
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
                  <Link href={`/exercise?id=${record.key}`} as={`/exercise`}>
                    <a>
                      <EditOutlined style={{ fontSize: '16px' }} />
                    </a>
                  </Link>
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
      </div>
    </>
  );
};
ExerciseList.getInitialProps = async (ctx) => {
  let ownerId = ctx.query?.ownerId;
  return { ownerId };
};
export default ExerciseList;
