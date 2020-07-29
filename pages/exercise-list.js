import {
  Table,
  Row,
  Col,
  Button,
  Space,
  Popconfirm,
  Tag,
  notification,
  Tooltip,
} from 'antd';
import {
  CheckCircleTwoTone,
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
  EditTwoTone,
  DeleteTwoTone,
} from '@ant-design/icons';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import composedAuthHOC from 'hocs';
import ExercisePreviewModal from '../components/exercise/ExercisePreviewModal';

const ExerciseList = (props) => {
  let currUserId = props.userInfo.id || 0;
  // table
  let [tableData, setTableData] = useState([]);
  let [currPageTable, setCurrPageTable] = useState(1);
  let [currPageSize, setCurrPageSize] = useState(10);
  let [tableLoading, setTableLoading] = useState(false);
  // naviagte
  let router = useRouter();
  // state button loading
  let [loadingButtonCreate, setLoadingButtonCreate] = useState(false);

  // preview
  let [visiblePreview, setVisiblePreview] = useState(false);
  let [contentPreview, setContentPreview] = useState({
    title: '',
    level: '',
    like: 0,
    dislike: 0,
    content: '',
    points: 1,
  });

  const loadTable = async () => {
    try {
      setTableLoading(true);
      const res = await axios.get(
        `${process.env.API}/api/exercise/owner/${currUserId}`
      );
      setTableLoading(false);
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
      setTableLoading(false);
      console.log(e);
    }
  };

  const handleButtonCreate = () => {
    setLoadingButtonCreate(true);
    router.push('/exercise');
  };

  const handleButtonDeleteRecord = async (record) => {
    try {
      setTableLoading(true);
      const res = await axios.post(`${process.env.API}/api/exercise/delete`, {
        id: record.key,
      });
      setTableLoading(false);
      if (res.data.success) {
        notification.info({
          message: 'Notification',
          description: 'Delete Success!',
        });
        loadTable();
      } else {
        notification.error({
          message: 'Notification',
          description: 'Delete Failed!',
        });
      }
    } catch (e) {
      notification.error({
        message: 'Notification',
        description: 'Delete Failed!',
      });
      console.log(e);
    }
  };

  const handleButtonEditRecord = (record) => {
    setTableLoading(true);
    router.push(`/exercise?id=${record.key}`, '/exercise');
  };

  useEffect(() => {
    loadTable();
  }, []);

  useEffect(() => {
    if (!visiblePreview) {
      setContentPreview({
        title: '',
        level: '',
        like: 0,
        dislike: 0,
        content: '',
        points: 1,
      });
    }
  }, [visiblePreview]);

  return (
    <>
      <Head>
        <title>Exercise List</title>
      </Head>
      <Header />
      <div
        style={{
          width: '95%',
          margin: '60px auto',
          marginBottom: 0,
        }}>
        <Table
          loading={tableLoading}
          title={() => (
            <Row
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}>
              <Col
                style={{
                  fontSize: '19px',
                }}>
                Exercise List
              </Col>
              <Col>
                <Button
                  type='primary'
                  onClick={handleButtonCreate}
                  loading={loadingButtonCreate}>
                  Create Exercise
                </Button>
              </Col>
            </Row>
          )}
          bordered
          scroll={{ x: 1100 }}
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
              render: (text, record) => {
                return (
                  <div
                    style={{
                      width: '260px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                    {record.content}
                  </div>
                );
              },
            },
            {
              title: 'Approved',
              dataIndex: 'approved',
              key: 'approved',
              width: '130px',
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
              width: '200px',
              ellipsis: true,
            },
            {
              title: 'Action',
              key: 'action',
              fixed: 'right',
              width: '130px',
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
                      onClick={() => handleButtonEditRecord(record)}
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
                      onConfirm={() => handleButtonDeleteRecord(record)}
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
                let cellIndex = event.target.cellIndex;
                console.log('cellIndex', cellIndex);
                if (cellIndex === 9) {
                  // this is column 'action', => do nothing
                  return;
                }
                setVisiblePreview(true);
                setContentPreview({
                  content: record.content,
                  dislike: record.dislike,
                  like: record.like,
                  title: record.title,
                  level: record.level,
                  points: record.points,
                });
              },
            };
          }}
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
      <Footer />
      <ExercisePreviewModal
        title='Preview Exercise'
        data={contentPreview}
        raw={false}
        visible={visiblePreview}
        onCancel={() => setVisiblePreview(false)}
      />
    </>
  );
};
ExerciseList.getInitialProps = (ctx) => {
  // let ownerId = ctx.query?.ownerId || 0;
  return {};
};
export default composedAuthHOC(ExerciseList);
