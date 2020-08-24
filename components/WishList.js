import { Menu ,Modal ,Table ,Empty} from "antd"
import { PlusCircleOutlined ,DeleteOutlined } from "@ant-design/icons"
import { useState , useEffect } from "react"
import {connect } from "react-redux"
import { getWishList , addTypeWishList , getWishListByType ,removeToWishList} from "../store/problem/action"
import ConfirmModal from "../components/MyConfirm"
import { translateClassName ,validateDisplayName } from "../helpers/utils"
import Link from "next/link"


const WishList = (props)=> {

  const [isShowModalAdd ,setIsShowModelAdd]  = useState(false)
  const [nameWL , setNameWL] = useState('')
  const [activeIndex , setActiveIndex ] = useState(0)
  const [dataSource , setDataSource] = useState([])

  const columns = [
    {
    title: 'Index',
    dataIndex: 'index',
    key: 'index',
    align : 'center'
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      align : 'center',
      render: (text,record) => <Link href={{pathname : '/playground', query : { questionID : record['exercise']['id']}}} as={`/playground?questionID=${record['exercise']['id']}`}><a className="status-submission">{validateDisplayName(record['exercise']['title'])}</a></Link>,
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      align : 'center',
      render: (text,record) => <span className={`badge badge-pill badge-${translateClassName(record['exercise']['level'])}`}>{record['exercise']['level'].toUpperCase()}</span>,
    },
    {
      title: 'LOC',
      dataIndex: 'loc',
      key: 'loc',
      align : 'center',
      render: (text,record) => <span className="status-submission">{record['exercise']['loc']}</span>,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      align : 'center',
      render: (text,record) => <DeleteOutlined style={{color : "#d05451"}} onClick= {()=>ConfirmModal(()=>hanleOke(record['exercise']['id']))}/>
    },

  
  ]
 
  const  setModelAddVisible = (value) =>{
    setIsShowModelAdd(value)
  }

  const submitAddTypeWL = ()=> {
    props.addTypeWishList(nameWL)
    setIsShowModelAdd(false)
  }

  useEffect(()=> {
    props.getWishList();
  },[])

  useEffect(()=> {
    setDataSource(props.wishList)
  },[props.wishList])

  

  const hanleOke = (questionId)=> {
  
    props.removeToWishList(questionId)
  
  }



  const handleClickMenu = ((key)=>{
    setActiveIndex(key)
    props.getWishListByType(props.typeWishList[key]['id'])
  })

  return  (
    <div className="wish_list">
      <div className="container panel_main">

       <div className="right_wish_list">
         <div className="favorite-panel">
           <div className="panel-heading list-header-container">
             <div className="list-header-left-pane">
              <h3 className="panel-title list-name-header" title="Favorite">Favorite</h3>
             </div>                 
           </div>
           <div className="favorite-list">
               {/* <Menu  mode="vertical">
                 {
                   props.wishList.length > 0 ? props.wishList.map((value,index)=> (
                    <Menu.Item key={index} >
                      <div className="item-exercise">
                   <span className="title-exercise">{`${(index + 1 )}. ${value['exerciseId']['title']}`}</span>
                          <span><DeleteOutlined  style={{color : "#d05451"}} onClick= {()=>ConfirmModal(()=>hanleOke(value['exerciseId']['id']))}/></span>
                      </div>
                   </Menu.Item>
           
                   )): 
                   <Empty/>
                 }
               
                </Menu> */}
                  <Table columns={columns} dataSource={dataSource} pagination={false} align={'center'} rowKey="index"/>
           </div>
         </div>
         
       </div>
       </div>
    </div>
  )
}

function mapStateToProps(state,ownProps) {
  return {
    typeWishList: state.problem.typeWishList,
    wishList : state.problem.wishList
  
  }
}

export default connect(mapStateToProps,{ getWishList ,addTypeWishList,getWishListByType, removeToWishList})(WishList);