import { Table } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { useState } from 'react';

const ReviewStepTestcase = ({ data = [] }) => {
  let [currPageTable, setCurrPageTable] = useState(1);
  let [currPageSize, setCurrPageSize] = useState(10);

  return (
    <>
      <h1
        style={{
          marginTop: 10,
          marginBottom: 10,
        }}>
        Testcase use to evaluate student's answer
      </h1>
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
              }
            },
          },
        ]}
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
    </>
  );
};
export default ReviewStepTestcase;
