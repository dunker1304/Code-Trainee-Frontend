import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import Link from "next/link"
import { Table , Pagination } from 'antd'
import { useState, useEffect } from "react"
import Router, {useRouter} from "next/router"
import axios from "axios"
import {openNotificationWithIcon} from "../../../components/Notification"
import composedAuthHOC from '../../../hocs';


const ExerciseStatistic = (props)=> {
 
  const router = useRouter();
  const [listSubmission , setListSubmission ] = useState([]);
  const [total , setTotal ] = useState(1);

  const [currentPage , setCurrentPage] = useState(1)
  const [pageSize , setPageSize] = useState(20)
  const [exercise , setExercise] = useState(null)



  useEffect(()=>{
    fetchData()
  },[])

  const fetchData = async (pageNumber)=> {
    let exerId = router.query.exerciseId;
    let url  = `${process.env.API}/api/exercise/statistic`
    let data = {
      exerciseId : exerId,
      page : pageNumber
    }
    let resData = await axios.post(url,data);

    if(resData.data.success) {
       setListSubmission(resData.data.data.list)
       setTotal(resData.data.data.count)
       setExercise(resData.data.data.exercise)
    }
    else {
      openNotificationWithIcon('error','',' Load Data Fail!');
    }
  }

  const handleClickPagging = (pageNumber)=>{
    fetchData(pageNumber)
    setCurrentPage(pageNumber)
}

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text,record) => <Link href='/profile/[profileId]' as={`/profile/${record['user']['id']}`}><a className="_author_link">{record['user']['name']}</a></Link>,
    },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'language',
      render: (text,record) => <a>{record['language']['name']}</a>,
    },
    {
      title: 'Runtime',
      dataIndex: 'runtime',
      key: 'runtime',
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render:  (text,record) => <Link href='/submission/[submissionId]' as={`/submission/${record['id']}`} ><span className="status-submission">{text}</span></Link>
    },
    {
      title: 'Time',
      key: 'time',
      dataIndex: 'createdAt',
      render:  (text,record) => <span >{text}</span>
    },
  ];
 return (
   <div>
     <Header/>
      <div className="statistic_wrapper">
      <div className="container-content container">
        <div className="row">
          <div className="col-md-12">
            <h4 className="inline-wrap_title" >
              <Link href={{pathname : '/playground', query : { questionID : exercise ? exercise['id']:1}}} as={`/playground?questionID=${exercise ?exercise['id']:1 }`}>
               <a className="inline-wrap" >
                  {exercise ? exercise['title'] : ''}
               </a>
               </Link>
            </h4>
          </div>
          <div className="col-md-12 submision_detail">
              <div className="wa_status">
                 <div className="status_detail">
                    <span>LOC:</span> 
                    <h4>{exercise ? exercise['loc'] : 0}</h4>
                 </div>
                 <div className="status_detail">
                    <span>Level:</span> 
                    <strong>
                      <span className ="time_sub">{exercise ? exercise['level'] : ''}</span>
                    </strong>
                 </div>
                 <div className="status_detail">
                    <span>Total Submissions:</span> 
                    <strong>
                      <span className ="time_sub">{exercise ? exercise['totalSubmission']: 0}</span>
                    </strong>
                 </div>
                 <div className="status_detail">
                    <span>CreatedAt:</span> 
                    <strong>
                      <span className ="time_sub">{exercise ? exercise['createdAt']: ''}</span>
                    </strong>
                 </div>
              </div>
          </div>
          <div className="col-md-12 submision_code">
             <Table columns={columns} dataSource={listSubmission} pagination={false} />
             <div className="data-pagging" style={ { display : total != 0 ?'flex' : 'none'} }>
                  <Pagination
                    defaultCurrent={1}
                    current= {currentPage}
                    total={total}
                    showSizeChanger={false}
                    pageSize={pageSize}
                    defaultPageSize={20} 
                    onChange= {(pageNumber)=> {handleClickPagging(pageNumber)}}
                    />
              </div>
          </div>
        </div>

      </div>
      </div>
     <Footer/>

   </div>
 )
}

export default composedAuthHOC(ExerciseStatistic);