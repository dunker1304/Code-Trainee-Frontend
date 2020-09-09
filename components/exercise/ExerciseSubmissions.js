import { Table, Modal, Button } from 'antd'
import { useState, useEffect } from 'react'
import axios from 'axios'
import {formatDate} from "../../helpers/utils"
import moment from "moment"

const ExerciseSubmissions = props => {
  const [allSubmissions, setAllSubmissions] = useState()
  const [data, setData] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [rowClicked, setClickedRow] = useState()
  useEffect(() => {
    let url = `${process.env.API}/api/submissions/all?userID=${props.userInfo.id}&exerciseID=${props.exerciseID}`
    axios.get(url)
      .then(res => {
        console.log(res.data, 'lis submission')
        setAllSubmissions(res.data.submissions)
        let dataTable = []
        res.data.submissions.map((submission, index) => {
          let obj = {
            key: index,
            time: submission.createdAt,
            status: submission.status,
            runtime: submission.timeNeeded + ' ms',
            //memory: NaN,
            language: submission.programLanguageId.name,
            code: submission.answer
          }
          dataTable.push(obj)
        })
        setData(dataTable)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  const columns = [
    {
      title: 'Time Submitted',
      dataIndex: 'time',
      key: 'time',
      render : (text,record) => (<span>{formatDate(moment(record.time).toDate())}</span>)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: text => (<div style={(text == 'Accepted') ? {color: 'green'} : {color: 'red'}}>{text}</div>)
    },
    {
      title: 'Runtime',
      dataIndex: 'runtime',
      key: 'runtime',
    },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'language',
    }
  ]

  const handleAddSnippetCode = () => {
    console.log(rowClicked)
    props.handleChangeCodeAce(rowClicked.code)
    setOpenModal(false)
  }

  const handleCancel = () => {
    setOpenModal(false)
  }
  return (
    <div className="exercise-submission">
      <Modal
        title="Submisstion Detail"
        visible={openModal}
        onOk={handleAddSnippetCode}
        onCancel={handleCancel}
        okButtonProps={{ style: { display: 'none' } }}
      >
        <div className="submission-detail">
          <div className="result">
            <div className="title">{props.exercise.title}</div>
            <div className="status">Status: {rowClicked?.status}</div>
            <div className="time-submmited">Submitted: { rowClicked && rowClicked.time ? formatDate(moment(rowClicked.time).toDate()) : ''}</div>
            <div className="language">Language: {rowClicked?.language}</div>
            <div className="alert-info testcase-table">
              {rowClicked?.code}
            </div>
          </div>
          <div className="action">
            <Button type="primary" onClick={handleAddSnippetCode}>Edit Code</Button>
          </div>
        </div>
      </Modal>
      <Table 
        columns={columns} 
        dataSource={data} 
        pagination={{ hideOnSinglePage: true }}
        onRow={(row, index) => {
          return {
            onClick: () => {
              setOpenModal(true);
              setClickedRow(row)
            }
          }
        }}
      >

      </Table>
    </div>
  )
}

export default ExerciseSubmissions