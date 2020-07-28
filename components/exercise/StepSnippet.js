import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  Button,
  Space,
  Row,
  Col,
  Manu,
  Menu,
  Spin,
  Popover,
  notification,
  Tooltip,
} from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import AceEditor from 'react-ace';
import SnippetTemplate from './SnippetTemplate';
import axios from 'axios';

import 'ace-builds/src-noconflict/theme-kuroir';

const StepSnippet = ({
  exerciseId = 0,
  selectedLanguages = [],
  supportedLanguages = [],
  snippetValues = {},
  setSelectedLanguages = () => {},
  setSnippetValues = () => {},
  setSupportedLanguages = () => {},
  next = () => {},
  prev = () => {},
}) => {
  // table
  let [currPage, setCurrPage] = useState(1);
  let [currPageSize, setCurrPageSize] = useState(10);
  let [loading, setLoading] = useState(false);

  let firstRun = useRef(true);

  const handleNext = async () => {
    setLoading(true);
    if (selectedLanguages.length === 0) {
      notification.info({
        message: 'Notification',
        description: 'At least one language must be selected.',
      });
      setLoading(false);
    } else {
      let supportedLangs = [...supportedLanguages].map((e) => {
        let languageId = e.key;
        let isActive = selectedLanguages.includes(languageId);
        let sampleCode = snippetValues[languageId];
        return { languageId, isActive, sampleCode };
      });
      try {
        let res = await axios.post(`${process.env.API}/api/snippet/update`, {
          supportedLanguages: supportedLangs,
          exerciseId: exerciseId,
        });
        setLoading(false);
        if (res.data.success) {
          next();
        } else {
          throw new Error('');
        }
      } catch (e) {
        setLoading(false);
        notification.error({
          message: 'Notification',
          description: 'Something get wrong!',
        });
        console.log(e);
      }
    }
  };

  const handlePrevious = () => {
    prev();
  };

  useEffect(() => {
    !firstRun.current &&
      selectedLanguages.length === 0 &&
      notification.info({
        message: 'Notification',
        description: 'At least one language must be selected.',
      });
    firstRun.current = false;
  }, [selectedLanguages.length]);

  return (
    <div
      style={{
        marginBottom: '30px',
      }}>
      <Table
        bordered
        loading={loading}
        dataSource={supportedLanguages}
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
              Select supported Language
            </Col>
            {/* <Col>
              <Button type='primary' onClick={loadTable}>
                Reload Data
              </Button>
            </Col> */}
          </Row>
        )}
        columns={[
          {
            title: 'No.',
            key: 'no',
            width: '60px',
            render: (text, record, index) =>
              index + 1 + (currPage - 1) * currPageSize,
          },
          {
            title: 'Language',
            dataIndex: 'language',
            key: 'language',
            ellipsis: true,
          },
          {
            title: 'Language Code',
            dataIndex: 'languageCode',
            key: 'languageCode',
            width: '150px',
          },
        ]}
        rowSelection={{
          selectedRowKeys: selectedLanguages,
          onChange: (selectedRowKeys, selectedRows) => {
            setSelectedLanguages([...selectedRowKeys]);
          },
          selections: [
            Table.SELECTION_ALL,
            {
              key: 'unselectAll',
              text: 'Unselect all data',
              onSelect: (changableRowKeys) => setSelectedLanguages([]),
            },
          ],
        }}
        expandable={{
          expandedRowRender: (record) => {
            return (
              <>
                <Row>Playground Templates</Row>
                <AceEditor
                  className='playground'
                  mode={record.name}
                  theme='kuroir'
                  value={snippetValues[record.key] || ''}
                  showGutter={true}
                  onChange={(value, event) => {
                    snippetValues[record.key] = value;
                  }}
                  style={{ width: '100%', height: '300px' }}
                />
              </>
            );
          },
          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <MinusOutlined onClick={(e) => onExpand(record, e)} />
            ) : (
              <Tooltip
                placement='right'
                title='Expand to write template for this Language'>
                <PlusOutlined onClick={(e) => onExpand(record, e)} />
              </Tooltip>
            ),
        }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '30'],
        }}
        onChange={(pagination, filter, sorter) => {
          setCurrPageSize(pagination.pageSize);
          setCurrPage(pagination.current);
        }}
      />
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

export default StepSnippet;
