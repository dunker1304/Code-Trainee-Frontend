import React, { useState, useEffect } from 'react';
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
} from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import AceEditor from 'react-ace';
import axios from 'axios';
import SnippetTemplate from './SnippetTemplate';

import 'ace-builds/src-noconflict/theme-kuroir';

const StepSnippet = ({ exerciseId, nextStep = () => {} }) => {
  // table
  let [currPage, setCurrPage] = useState(1);
  let [currPageSize, setCurrPageSize] = useState(10);
  let [tableData, setTableData] = useState([]);
  let [loading, setLoading] = useState(false);
  // snippet
  let [readOnlyMap, setReadOnlyMap] = useState({});
  let [selectedMenuMap, setSelectedMenuMap] = useState({});
  let [loadingMap, setLoadingMap] = useState({});
  let [valueMap, setValueMap] = useState({});
  let [dirtySnippetMap, setDirtySnippetMap] = useState({});
  // check supported language
  let [selectedRowKeys, setSelectedRowKeys] = useState([]);
  let [dirtyLangMap, setDirtyLangMap] = useState({});

  const initConfig = () => {
    setCurrPage(1);
    setCurrPageSize(10);
    setReadOnlyMap({});
    setSelectedMenuMap({});
    setLoadingMap({});
    setValueMap({});
    setDirtySnippetMap({});
    setDirtyLangMap({});
    setSelectedRowKeys([]);
  };

  const handleSaveSnippet = async (languageId) => {
    setLoadingMap({
      ...loadingMap,
      [languageId]: true,
    });
    try {
      const res = await axios.post(
        `${process.env.API}/api/snippet/sample/update`,
        {
          exerciseId: exerciseId,
          languageId: languageId,
          sampleCode: valueMap[languageId].value,
        }
      );
      if (res.data.success) {
        notification.info({
          message: 'Notification',
          description: 'Success',
        });
        setDirtySnippetMap({
          ...dirtySnippetMap,
          [languageId]: false,
        });
      } else {
        notification.error({
          message: 'Notification',
          description: 'Fail!',
        });
      }
    } catch (e) {
      notification.error({
        message: 'Notification',
        description: 'Fail',
      });
    }
    setLoadingMap({
      ...loadingMap,
      [languageId]: false,
    });
  };

  const handleUpdateAndNext = async () => {
    try {
      setLoading(true);
      //save snippets if not save yet
      [...tableData].forEach((e) => {
        if (dirtySnippetMap[e.key]) {
          handleSaveSnippet(e.key);
        }
      });
      // save selected support language
      let activeIds = [...selectedRowKeys];
      let notActiveIds = [...tableData]
        .map((e) => e.key)
        .filter((e) => !activeIds.includes(e));
      if (activeIds.length === 0) {
        notification.error({
          message: 'Notification',
          description: 'Exercise must support at least one language.',
        });
        setLoading(false);
        return;
      }
      const res = await axios.post(
        `${process.env.API}/api/snippet/supported-language/update`,
        {
          exerciseId: exerciseId,
          activeLangIds: activeIds,
          notActiveLangIds: notActiveIds,
        }
      );
      setLoading(false);
      if (res.data.success) {
        notification.info({
          message: 'Notification',
          description: 'Success',
        });
        nextStep();
      } else {
        notification.error({
          message: 'Notification',
          description: 'Fail',
        });
      }
    } catch (e) {
      notification.error({
        message: 'Notification',
        description: 'Fail',
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTable();
  }, []);

  const loadTable = async () => {
    setLoading(true);
    const res = await axios.get(
      `${process.env.API}/api/program-language/all?exerciseId=${exerciseId}`
    );
    if (res.data.success) {
      let tableData = [];
      let selectedRows = [];
      let snippetValueMap = {};
      res.data.data.result.forEach((e) => {
        let snippetValue = e.codeSnippets?.length
          ? e.codeSnippets[0].sampleCode
          : '';
        tableData.push({
          key: e.id,
          language: e.name,
          languageCode: e.code,
          sampleCode: snippetValue,
        });
        if (e.codeSnippets?.length && e.codeSnippets[0].isActive) {
          selectedRows.push(e.id);
        }
        snippetValueMap[e.id] = {
          value: snippetValue,
        };
      });
      initConfig();
      setTableData([...tableData]);
      setSelectedRowKeys([...selectedRows]);
      setValueMap({ ...snippetValueMap });
    } else {
      notification.error({
        message: 'Notification',
        description: <p>Fail!</p>,
      });
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        marginBottom: '30px',
      }}>
      <Table
        className='table-snippets'
        bordered
        loading={loading}
        dataSource={tableData}
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
          selectedRowKeys: selectedRowKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);
          },
          selections: [
            Table.SELECTION_ALL,
            {
              key: 'unselectAll',
              text: 'Unselect all data',
              onSelect: (changableRowKeys) => setSelectedRowKeys([]),
            },
          ],
        }}
        expandable={{
          onExpand: (expanded, record) => {
            if (readOnlyMap[record.key] === undefined) {
              setReadOnlyMap({
                ...readOnlyMap,
                [record.key]: true,
              });
            }
            if (selectedMenuMap[record.key] === undefined) {
              setSelectedMenuMap({
                ...selectedMenuMap,
                [record.key]: [],
              });
            }
            if (loadingMap[record.key] === undefined) {
              setLoadingMap({
                ...loadingMap,
                [record.key]: false,
              });
            }
          },
          expandedRowRender: (record) => {
            return (
              <Col>
                <Row>Playground Templates</Row>
                <Row>
                  <Menu
                    mode='horizontal'
                    selectable={false}
                    selectedKeys={selectedMenuMap[record.key]}
                    onClick={({ key }) => {
                      if (key === 'edit') {
                        let currReadOnly = readOnlyMap[record.key];
                        setReadOnlyMap({
                          ...readOnlyMap,
                          [record.key]: !currReadOnly,
                        });
                        setSelectedMenuMap({
                          ...selectedMenuMap,
                          [record.key]: currReadOnly ? [] : [key],
                        });
                      } else if (key === 'save' && valueMap[record.key]) {
                        handleSaveSnippet(record.key);
                      }
                    }}
                    style={{ marginBottom: '8px' }}>
                    <Menu.Item key='status' disabled style={{ width: '100px' }}>
                      {!readOnlyMap[record.key] ? 'Editable' : 'ReadOnly'}
                    </Menu.Item>
                    <Menu.Item
                      key='edit'
                      icon={<EditOutlined style={{ fontSize: '16px' }} />}>
                      Edit
                    </Menu.Item>
                    <Menu.Item
                      key='save'
                      icon={<SaveOutlined style={{ fontSize: '16px' }} />}>
                      {!valueMap[record.key] ? (
                        <Popover
                          trigger='hover'
                          title='No need to Save'
                          content='This template does not changed.'>
                          Save
                        </Popover>
                      ) : (
                        'Save'
                      )}
                    </Menu.Item>
                  </Menu>
                </Row>
                <Spin tip='Loading' spinning={loadingMap[record.key]}>
                  <AceEditor
                    readOnly={readOnlyMap[record.key]}
                    className='playground'
                    mode={record.name}
                    theme='kuroir'
                    value={valueMap[record.key]?.value || ''}
                    showGutter={true}
                    onChange={(value, event) => {
                      valueMap[record.key].value = value;
                    }}
                    style={{ width: '100%', height: '300px' }}
                  />
                </Spin>
              </Col>
            );
          },
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

      <Button type='primary' onClick={handleUpdateAndNext} loading={loading}>
        Update and Next
      </Button>
    </div>
  );
};

export default StepSnippet;
