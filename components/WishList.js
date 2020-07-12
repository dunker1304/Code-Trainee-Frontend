import { Menu ,Modal ,Input ,Empty} from "antd"
import { PlusCircleOutlined ,DeleteOutlined } from "@ant-design/icons"
import { useState , useEffect } from "react"
import {connect } from "react-redux"
import { getTypeWishList , addTypeWishList , getWishListByType ,removeToWishList} from "../store/problem/action"
import ConfirmModal from "../components/ConfirmModal"

const WishList = (props)=> {

  const [isShowModalAdd ,setIsShowModelAdd]  = useState(false)
  const [nameWL , setNameWL] = useState('')
  const [activeIndex , setActiveIndex ] = useState(0)
 
  const  setModelAddVisible = (value) =>{
    setIsShowModelAdd(value)
  }

  const submitAddTypeWL = ()=> {
    props.addTypeWishList(nameWL)
    setIsShowModelAdd(false)
  }

  useEffect(()=> {
    props.getTypeWishList();
  },[])

  useEffect(()=>{
    if(props.typeWishList.length > 0 ){
      props.getWishListByType(props.typeWishList[0]['id'])
    }
  },[props.typeWishList])

  const hanleOke = (questionId)=> {
    let type = props.typeWishList[activeIndex]['id']
    props.removeToWishList(questionId,type)
  
  }



  const handleClickMenu = ((key)=>{
    setActiveIndex(key)
    props.getWishListByType(props.typeWishList[key]['id'])
  })

  return  (
    <div className="wish_list">
      <div className="container panel_main">

     
       <div className="left_wish_list">
          <div className="panel-heading all-lists-header">
            <h3 class="panel-title">My List</h3>
            <button type="button" class="add-list-btn">
               <PlusCircleOutlined onClick = {()=> setModelAddVisible(true)}/>
            </button>
            <Modal
              title="Create New List"
              centered
              visible={isShowModalAdd}
              onOk={() => submitAddTypeWL()}
              onCancel={() =>setIsShowModelAdd(false)}
              className="add-favo-modal"
            >
              <Input name="favorite" 
              placeholder="Enter a name for your list" 
              className="input-favo"
              onChange= { (e)=> {  setNameWL(e.target.value)}}
              value = {nameWL}
              />
          </Modal>
          </div> 
          <div className = "all_item_wish_list">
              <Menu  mode="vertical" selectedKeys= {[`${activeIndex}`]} onClick={({key})=> { handleClickMenu(key)}}>
                {props.typeWishList.lenth > 0 ? props.typeWishList.lenth.map((value,index)=> (
                   <Menu.Item key= {index}  >
                      {value.name}
                  </Menu.Item> 
                )) : <Empty/>}
              </Menu>
          </div> 
       </div>

       <div className="right_wish_list">
         <div className="favorite-panel">
           <div className="panel-heading list-header-container">
             <div class="list-header-left-pane">
              <h3 class="panel-title list-name-header" title="Favorite">Favorite</h3>
             </div>                 
           </div>
           <div className="favorite-list">
               <Menu  mode="vertical">
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
               
                </Menu>
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

export default connect(mapStateToProps,{ getTypeWishList ,addTypeWishList,getWishListByType, removeToWishList})(WishList);