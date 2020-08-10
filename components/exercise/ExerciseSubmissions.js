import { Table, Modal, Button } from 'antd'
import { useState, useEffect } from 'react'
import axios from 'axios'

const ExerciseSubmissions = props => {
  const [allSubmissions, setAllSubmissions] = useState()
  const [data, setData] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [rowClicked, setClickedRow] = useState()
  useEffect(() => {
    let url = `${process.env.API}/api/submissions/all?userID=${3}&exerciseID=${props.exerciseID}`
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
            runtime: NaN,
            memory: NaN,
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
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: text => (<div style={(text == 'Wrong Answer') ? {color: 'red'} : null}>{text}</div>)
    },
    {
      title: 'Runtime',
      dataIndex: 'runtime',
      key: 'runtime',
    },
    {
      title: 'Memory',
      dataIndex: 'memory',
      key: 'memory',
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
          {console.log(props.exercise, rowClicked, 'row clicked')}
          <div className="result">
            <div className="title">{props.exercise.title}</div>
            <div className="status">Status: {rowClicked?.status}</div>
            <div className="time-submmited">Submitted: {rowClicked?.time}</div>
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