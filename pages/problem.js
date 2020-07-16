
import { Input, Empty } from 'antd';
import { Menu, Dropdown, Button, Select, Tag, Pagination ,Popover} from 'antd';
import { DownOutlined, CheckOutlined, SwitcherOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { searchQuestion, chooseTags, dropdownFilter, getCategory,addToWishList,removeToWishList,getExerciseOfUser } from "../store/problem/action"
import QuestionItem from "../components/QuestionItem"
import YourProcess from "../components/YourProcess"
import Header from "../components/Header"
import Footer from "../components/Footer"
import Link from 'next/link'
import axios from "axios"
import  Router  from "next/router"
import { openNotificationWithIcon } from "../components/Notification"


const Level = [{ id: 1, name: 'Easy' }, { id: 2, name: 'Medium' }, { id: 3, name: 'Hard' }]
const Status = [{ id: -1, name: 'To Do' }, { id: 1, name: 'Solved' }, { id: 0, name: 'InComplete' }]
const Problems = (props) => {

  const [visible, setVisible] = useState(false)
  const [termSearch, setTermSearch] = useState('')
  const [tagSearch, setTagSearch] = useState({})
  const [isTable, setIsTable] = useState(true)
  const [pageSize, setPageSize] = useState(10)
  const [pageNumber, setPageNumber] = useState(1)
  const onSearchDropDown = (e) => {
    props.dropdownFilter(e.target.value)
  }

  const onChange = (newValue) => {
    setVisible(newValue)
  }
  const { Option } = Select;

  const handleIsClicked = (value) => {
    let findTagArr = []
    let findArray = []
    props.chooseTags(value.id)
    let findArraySearch = JSON.parse(JSON.stringify(tagSearch))

    //if tagSearch has this value- remove
    if (tagSearch['tag']) {
      let indexOf = tagSearch['tag'].find(ele => ele.id == value.id)
      if (indexOf) {
        findTagArr = tagSearch['tag'].filter((element) => {
          return element.id != value.id
        });
        findArray = { ...findArraySearch, 'tag': [...findTagArr] ,'page':1}
        setTagSearch(findArray)
        setPageNumber(1)
        searchQuestion(findArray)
       
        return;
      }
      else {
        findArray = { ...findArraySearch, 'tag': [...findArraySearch['tag'], value],'page':1 }
        setTagSearch(findArray)
        setPageNumber(1)
        searchQuestion(findArray)
        return;
      }
    }
    else {
      findArray = { ...findArraySearch, 'tag': [value],'page':1 }
      setTagSearch(findArray)
      setPageNumber(1)
      searchQuestion(findArray)
      return;
    }


  }


  const text = ()=> {
    return (
      <Input className="filterSearch" placeholder="Filter topics.." onChange={(e) => onSearchDropDown(e)} />
    )
  }

  const content = (array)=> {
    return (
      <div style={{maxHeight:"300px"}}>
        {
        array.map((value, index) => (
          <li onClick={() => handleIsClicked(value)} key={index}>
            {value.isClicked ? <CheckOutlined /> : ''}<span >{value.name}</span></li>
        ))
      }
      </div>
    )
  }

  const selectLevel = ({ item, key }) => {
    {
      let levelSelected = Level.find(element => element.id == key);
      let tags = { ...tagSearch, 'level': levelSelected ,'page':1}
      setTagSearch(tags)
      setPageNumber(1)
      searchQuestion(tags)

    }
  }
  const selectStatus = ({ item, key }) => {
    {
      let statusSelected = Status.find(element => element.id == key);
      let tags = { ...tagSearch, 'status': statusSelected ,'page':1}
      setTagSearch(tags)
      setPageNumber(1)
      searchQuestion(tags)
    }
  }


  const menuTag = (array) => {
    return (
      <Menu onClick={selectLevel} >
        {
          array.map((value, index) => {
            return (
              <Menu.Item title={value.name} key={value.id}>
                <span>{value.name}</span>
              </Menu.Item>
            )
          })
        }

      </Menu>
    )
  }

  const menuStatus = (array) => {
    return (
      <Menu onClick={selectStatus}>
        {
          array.map((value, index) => {
            return (
              <Menu.Item title={value.name} key={value.id}>
                <span>{value.name}</span>
              </Menu.Item>
            )
          })
        }

      </Menu>
    )
  }

  const translateClassName = (level) => {
    switch (level) {
      case 'Easy':
        return 'success';
      case 'Medium':
        return 'warning';
      case 'Hard':
        return 'danger';
    }
  }

  const onCloseLevel = async (e) => {
    let level = { ...tagSearch ,'page' :1}
    delete level.level
    setTagSearch(level)
    setPageNumber(1)
    searchQuestion(level)
  }

  const onCloseStatus = (e) => {
    let status = { ...tagSearch ,'page' :1}
    delete status.status
    setTagSearch(status)
    setPageNumber(1)
    searchQuestion(status)
  }

  const onCloseTerm = (e) => {
    let term = { ...tagSearch ,'page' :1}
    delete term.term
    setTagSearch(term)
    setPageNumber(1)
    setTermSearch('')
    searchQuestion(term)
  }

  const onCloseTags = (removedTag) => {
    let tags = [...tagSearch.tag];
    let filterTags = tags.filter(value => {
      return value.id != removedTag.id
    })
    tags = { ...tagSearch, 'tag': filterTags,'page' :1 }
    setTagSearch(tags)
    setPageNumber(1)
    searchQuestion(tags)
    props.chooseTags(removedTag.id)
  }

  const submitTermSearch = (e) => {
    if (e.keyCode === 13) {
      let term = { ...tagSearch }
      term['term'] = { name: termSearch }
      setTagSearch(term)
      setPageNumber(1)
      searchQuestion(term)
    }
  }

  const textChange = (e) => {
    setTermSearch(e.target.value)
  }

  const pagingQuestion = async (pageNumber,pageSize) => {
         let condition = {...tagSearch}
         condition['page'] = pageNumber;
         condition['limit'] = pageSize
         setTagSearch(condition)
         await setPageNumber(pageNumber)
         searchQuestion(condition)
  }

  const changePageSize = (value) => {
    let condition = {...tagSearch}
    condition['page'] = 1;
    condition['limit'] = value
    setTagSearch(condition)
    setPageSize(value)
    setPageNumber(1)
    searchQuestion(condition)
  }

  const searchQuestion = async (condition)=> {
    props.searchQuestion(condition)
  }

  const handlePickRandomQuestion = async () => {
   let random = await axios.get('http://localhost:1337/api/exercise/random')
   if(random.data.success) {
     let exercise  = random.data.data
     Router.push(`/playground?questionID=${exercise['id']}`,`/playground?questionID=${exercise['id']}`)
   }
   else {
    openNotificationWithIcon('error','','Something Wrong!')
   }
    
  }



  return (
    <div>
    <Header/>
    <div className="wrapper_problem">
    <div className="container container-content list-question-container">

      <div className="row" >
        <div className="col-md-9">
          <div className="assess-bar">
          <div id="welcome" className="col-md-4 col-sm-12 question-solved">
          
              <span className="label label-primary round">
              <span>{props.exerciseOfUser['solved']}/{props.exerciseOfUser['total']} solved</span>
             </span>&nbsp;-&nbsp;
            <span className="label label-success round">Easy {props.exerciseOfUser['easy']}</span>&nbsp;
            <span className="label label-warning round">Medium {props.exerciseOfUser['medium']}</span>&nbsp;
            <span className="label label-danger round">Hard {props.exerciseOfUser['hard']}</span>
            
          </div>
          <div className="pull-right">
            <Button type='default' onClick= {()=>handlePickRandomQuestion()}>
              <svg viewBox="0 0 24 24" width="1em" height="1em" className="icon__3Su4 shuffle-icon__dV27"><path fillRule="evenodd" d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"></path></svg>
              <span>Pick One</span>
            </Button>
          </div>


          </div>
          <div className="question-list-base">
            <div className="question-filter-base">
              <div className="separator-line question-filter-hr">
                <div className="separator-op"></div>
              </div>
              <div className="row search-bar-control">
                <div className="col-sm-6 col-lg-7">
                  <Input placeholder="Search question title, discription" value={termSearch} onChange={textChange} onKeyUp={submitTermSearch}></Input>
                </div>
                <div className="pull-right col-sm-6 col-lg-5">
                  <Dropdown overlay={menuTag(Level)} placement="bottomRight" trigger="['click']" overlayClassName="my_dropdown">
                    <Button>Difficulty <DownOutlined /></Button>
                  </Dropdown>

                  <Dropdown overlay={menuStatus(Status)} placement="bottomRight" trigger="['click']" overlayClassName="my_dropdown">
                    <Button>Status <DownOutlined /></Button>
                  </Dropdown>

                  {/* <Dropdown overlay={select(props.tags)}
                    placement="bottomRight"
                    overlayClassName="my_dropdown"
                    trigger="['click']"
                    visible={visible}
                    onVisibleChange={onChange}
                  >
                    <Button>Tags <DownOutlined /></Button>
                  </Dropdown> */}
                   <Popover placement="bottomRight" title={text} content={content(props.dropdownCategorySearch)} trigger="click">
                     <Button>Tags <DownOutlined /></Button>
                  </Popover>
                  <SwitcherOutlined onClick = {()=> setIsTable(!isTable)} title = {`${isTable ? 'Grid Layout':'Table Layout'}`}style={{ fontSize: '16px', color: '#08c' }}/>


                </div>
              </div>
              <div className="filter-selected-tags col-xs-12">
                {/* <Tag key = "green" onClose = {(e)=> {console.log(e.target.key)}}color="#87d068" closable={true}>green</Tag>
                <Tag key = "blue" color="#87d068"  closable={true} >blue</Tag> */}
                {
                  Object.keys(tagSearch).map((value, index) => {
                    if (value == 'level' || value == 'status' || value == 'term') {
                      return (
                        <Tag key={index} color="#87d068" closable={true} onClose={value == 'level' ? onCloseLevel : value == 'status' ? onCloseStatus : onCloseTerm} >{tagSearch[value]['name']}</Tag>
                      )
                    }
                    else {
                      if (value == 'tag') {
                        let listTag = tagSearch[value].map((s, index) => {
                          console.log(s)
                          return (<Tag key={index} color="#87d068" onClose={() => onCloseTags(s)} closable={true} >{s['name']}</Tag>)
                        })
                        return listTag;
                      }

                    }
                  })

                }

              </div>
            </div>
            {/* Table */}
            <div className="table-responsive question-list-table" style={{ display: isTable ? 'block' : 'none' }}>
              <table className="align-middle text-truncate mb-0 table table-borderless ">
                <thead>
                  <tr>
                    <th className="text-center">#</th>
                    <th className="text-center">Title</th>
                    <th className="text-center">Difficulty</th>
                    <th className="text-center">Author</th>
                   
                  </tr>
                </thead>
              
                <tbody>
                  {
                     props.question && props.question.length > 0 ? props.question.map((value, index) => (
                      <tr key={value.id}>
                        <td className="text-center text-muted" >#{index + 1}</td>
                        <td className="text-center title-question">
                          <Link href={{pathname : '/playground', query : { questionID : value['id']}}} as={`/playground?questionID=${value['id']}`}>
                          <a>{value.title}</a>
                          </Link>
                        </td>
                        <td className="text-center">
                          <div className={`badge badge-pill badge-${translateClassName(value.level)}`}>{value.level}</div>
                        </td>

                        <td className="text-center created_by">
                          <Link href={{pathname : '/profile/[profileId]'}} as={`/profile/${value.author['id']}`}>
                          <a>{value.author.displayName}</a>
                          </Link>
                          
                        </td>
                        

                      </tr>
                    )): 
                    <tr style={{boxShadow:"none"}}>
                      <td colSpan="4" style={{backgroundColor:"#fff"}}>
                        <Empty/>
                      </td>
                    </tr>
                     
                  }

                </tbody>
                <tbody className="reactable-pagination">
                  <tr>
                    <td colSpan="7">
                      <span className="row-selector">
                        <Select defaultValue="1" className="selectPaging" onSelect= {(value)=>{changePageSize(value)}}>
                          <Option value="1">20</Option>
                          <Option value="2">50</Option>
                          <Option value="3">100</Option>
                        </Select>
                        rows per page.
                      </span>

                      <Pagination
                        defaultCurrent={pageNumber}
                        current= {pageNumber}
                        total={props.totalQuestion}
                        showSizeChanger={false}
                        pageSize={pageSize}
                        defaultPageSize={pageSize}
                        onChange= {(pageNumber,pageSize)=> {pagingQuestion(pageNumber,pageSize)}}


                      />

                    </td>
                  </tr>
                </tbody>
              </table>


            </div>
            {/* End Table  */}
            {/* Grid View */}
            <div className="row" style={{ display: isTable ? 'none' : 'flex' }} >
               { props.question.map((value,index)=> (
                  <QuestionItem question={value} key={index} addToWishList= {()=>props.addToWishList(value['id'])} removeToWishList = {()=> props.removeToWishList(value.id)}/>
                 
               ))}
            </div>
            {/*End Grid View */}


          </div>

        </div>
        <div className="col-md-3">
          <YourProcess exerciseOfUser = {props.exerciseOfUser}/>
        </div>
      </div>

      </div>
     
      <Footer/>
      </div>
   
    </div>
  )

}

Problems.getInitialProps = async (ctx) => {
  // console.log(action)
  const { store: { dispatch }, pathname, req, res } = ctx
  await dispatch(searchQuestion())
  await dispatch(getCategory())
  await dispatch(getExerciseOfUser())

}

function mapStateToProps(state, ownProps) {
  return {
    tags: state.problem.category,
    question: state.problem.question,
    totalQuestion : state.problem.totalQuestion,
    dropdownCategorySearch : state.problem.dropdownCategorySearch,
    exerciseOfUser : state.problem.exerciseOfUser

  }
}


export default connect(mapStateToProps, { searchQuestion, chooseTags,
   dropdownFilter, getCategory ,addToWishList ,removeToWishList, })(Problems);