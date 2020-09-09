import { useEffect, useState } from "react"
import { PieChart } from 'react-minimal-pie-chart';
import  {Table ,Tooltip} from "antd"
import axios from "axios"
import { getExerciseOfUser} from "../store/problem/action"
import {connect} from "react-redux"
import Link from 'next/link'
import classnames from "classnames"
import  {formatDate } from "../helpers/utils"
import moment from "moment"

const columns = [
  {
    title: 'No.',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: 'Submit time',
    dataIndex: 'time',
    key: 'time', 
    render: (text,record) => ( <span>{ formatDate(moment(record.time).toDate())}</span>)
  },
  {
    title: 'Exercise',
    dataIndex: 'exercise',
    key: 'exercise',
    render: (text,record) => <Link  href={{pathname : '/playground', query : { questionID : record['exerciseId']} }} as={`/playground?questionID=${record['exerciseId'] }`}>
      <Tooltip title='View detail exercise'>
      <span className="link_title" style={{cursor :"pointer"}} >{text}</span>
      </Tooltip>
      </Link>,
    
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (text,record) =>
     <Link href="/submission/[submissionId]" as={`/submission/${record['id']}`} >
         <Tooltip title='View detail submission'>
       <span 
       className = {classnames('status-submisson',record.status == 'Accepted' ? 'status-success':'status-wrong')}
     >{text}</span>
       </Tooltip>
      </Link>,
  },
  {
    title: 'Runtime',
    key: 'runtime',
    dataIndex: 'runtime'
  },
  {
    title: 'Language',
    key: 'language',
    dataIndex: 'language'
  },
];


const Process = (props) => {
  const [anpha, setAnpha] = useState(51)
  const [beta, setBeta] = useState(121)
  const [lamda, setLamda] = useState(182)
  const [fontSize, setFontSize] = useState(20)
  const [fontSize2, setFontSize2] = useState(20)
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    if (fontSize < 80) {
      setTimeout(() => {
        setFontSize(fontSize + 0.5)
      }, 0.1);

    }
  }, [fontSize])

  useEffect(() => {
    if (fontSize2 < 40) {
      setTimeout(() => {
        setFontSize2(fontSize2 + 0.5)
      }, 0.1);

    }
  }, [fontSize2])

  const fetchData = async ()=> {
    let userId  = props.userInfo ?props.userInfo['id']:null;
    let url = `${process.env.API}/api/all-submission?userId=${userId} `
    let result =await  axios.get(url)
    await props.getExerciseOfUser( userId)
    setDataSource(result.data.data)
  }

  useEffect(  () => {
    fetchData()
  }, [])

  const defaultLabelStyle = {
    fontSize: '5px',
    fontFamily: 'sans-serif',
    color : '#fff'
  };
  return (
    <div className="process">
      <div className="container">
        <div className="status-submisson row">
          <div className="col-md-4 col-sm-12">
            <PieChart
              data={[
                { title: 'Wrong Answer', value: props.exerciseOfUser.wrongAnswer, color: 'rgb(175,216,248)' },
                { title: 'Accepted', value: props.exerciseOfUser.acceptedSubmissions, color: 'rgb(237,194,64)' },
                { title: 'Runtime Error', value: props.exerciseOfUser.runtimeError, color: 'rgb(203,75,75)' },
                { title: 'Other', value: props.exerciseOfUser.other, color: 'rgb(148,64,237)' },
              ]}
              animate = {true}
              animationDuration = {3000}
              style={{width:"300px"}}
              label={({ dataEntry }) => dataEntry.percentage > 0 ? (dataEntry.percentage).toFixed(2) + '%' : ''}
              labelStyle={defaultLabelStyle}
       />
           <table style={{position: 'absolute', top: '0px', right: '-20px', fontSize: 'smaller', color: '#545454'}}>
             <tbody>
               <tr>
                 <td className="legendColorBox">
                   <div style={{border: '1px solid #ccc', padding: '1px'}}>
                     <div style={{width: '4px', height: 0, border: '5px solid rgb(237,194,64)', overflow: 'hidden'}} />
                     </div>
                </td>
                <td className="legendLabel">Accepted</td>
              </tr>
              <tr>
                <td className="legendColorBox">
                  <div style={{border: '1px solid #ccc', padding: '1px'}}>
                    <div style={{width: '4px', height: 0, border: '5px solid rgb(175,216,248)', overflow: 'hidden'}} />
                    </div>
                </td>
                <td className="legendLabel">Wrong Answer</td>
              </tr>
              <tr>
                <td className="legendColorBox">
                  <div style={{border: '1px solid #ccc', padding: '1px'}}>
                    <div style={{width: '4px', height: 0, border: '5px solid rgb(203,75,75)', overflow: 'hidden'}} />
                    </div>
                </td>
                <td className="legendLabel">Runtime Error</td>
              </tr>
              <tr>
                <td className="legendColorBox">
                  <div style={{border: '1px solid #ccc', padding: '1px'}}>
                  <div style={{width: '4px', height: 0, border: '5px solid rgb(148,64,237)', overflow: 'hidden'}} />
                  </div>
                </td>
                <td className="legendLabel">Others</td>
              </tr>
            </tbody>
          </table>
          </div>
          <div className="col-md-8 col-sm-12">
            <div className="row">
              <div className="col-md-12">
                <p className="number">
            <span className="text-success" style={{ color: "rgb(60, 118, 61)", fontSize: fontSize }}>{props.exerciseOfUser.solved}</span>
                   <span  style={{ color: "#333" }}>/ {props.exerciseOfUser.total}</span>
                </p>
                <h3 className="number-text"> questions solved</h3>
              </div>

            </div>
            <div className="row inner-row">
              <div className="col-md-4 col-sm-4 col-xs-12">
            <p className="number text-primary" id="total_submissions" style={{color: "rgb(60, 118, 61)", fontSize: fontSize2 }}>{dataSource.total}</p>
                <h4 className="number-text"> total submissions</h4>
              </div>
              <div className="col-md-4 col-sm-4 col-xs-12">
            <p className="number text-success" id="ac_submissions"  style={{color: "rgb(60, 118, 61)", fontSize: fontSize2}}>{props.exerciseOfUser.acceptedSubmissions}</p>
                <h4 className="number-text"> accepted submissions</h4>
              </div>
              <div className="col-md-4 col-sm-4 col-xs-12">
                <p className="number">
            <span className="text-success" id="ac_rate"  style={{color: "rgb(60, 118, 61)", fontSize: fontSize2}}>{props.exerciseOfUser.rateAcceptedSubmissions}</span>
                  <span style={{color: "rgb(60, 118, 61)"}}>%</span>
                </p>
                <h4 className="number-text"> acceptance rate</h4>
              </div>
            </div>
          </div>

        </div>
        <div className = "row"> 
          <div className= " col-md-12">
              <h3 className="title-all-sub">All Submissions</h3>
              <Table columns={columns} dataSource={dataSource.submission} pagination={true}/>
          </div>
        </div>
      </div>

    </div>
  )
}


function mapStateToProps(state, ownProps) {
  return {
    exerciseOfUser : state.problem.exerciseOfUser,
    userInfo : state.auth.userInfo
  }
}

export default connect(mapStateToProps, {getExerciseOfUser})(Process)