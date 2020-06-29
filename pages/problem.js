
import { Input } from 'antd';
import { Menu, Dropdown, Button, Select, Tag, Pagination } from 'antd';
import { DownOutlined, CheckOutlined, SwitcherOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { searchQuestion, chooseTags, dropdownFilter, getCategory,addToWishList,removeToWishList } from "../store/problem/action"
import QuestionItem from "../components/QuestionItem"
import YourProcess from "../components/YourProcess"
import Header from "../components/Header"


const Level = [{ id: 1, name: 'Easy' }, { id: 2, name: 'Medium' }, { id: 3, name: 'Hard' }]
const Status = [{ id: -1, name: 'To Do' }, { id: 1, name: 'Solved' }, { id: 0, name: 'InComplete' }]
const Problems = (props) => {

  const [visible, setVisible] = useState(false)
  const [termSearch, setTermSearch] = useState('')
  const [tagSearch, setTagSearch] = useState({})
  const [isTable, setIsTable] = useState(true)
  const [pageSize, setPageSize] = useState(1)
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

  const select = (array) => {
    return (
      <div>
        <Input className="filterSearch" placeholder="Filter topics.." onChange={(e) => onSearchDropDown(e)} />
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



  return (
    <div>
      <Header/>
    <div className="container">

      <div className="row" >
        <div className="col-md-9">
          <div className="question-list-base">
            <div className="question-filter-base">
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

                  <Dropdown overlay={select(props.tags)}
                    placement="bottomRight"
                    overlayClassName="my_dropdown"
                    trigger="['click']"
                    visible={visible}
                    onVisibleChange={onChange}
                  >
                    <Button>Tags <DownOutlined /></Button>
                  </Dropdown>
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
              <table className="align-middle text-truncate mb-0 table table-borderless table-hover">
                <thead>
                  <tr>
                    <th className="text-center">#</th>
                    <th className="text-center">Title</th>
                    <th className="text-center">Difficulty</th>
                    <th className="text-center">Author</th>
                    <th className="text-center">Acceptance</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    props.question.map((value, index) => (
                      <tr key={value.id}>
                        <td class="text-center text-muted" >#{index + 1}</td>
                        <td class="text-center"><a>{value.title}</a></td>
                        <td class="text-center">
                          <div class={`badge badge-pill badge-${translateClassName(value.level)}`}>{value.level}</div>
                        </td>

                        <td class="text-center created_by">
                          <span class="pr-2 opacity-6">
                            <i class="fa fa-business-time"></i>
                          </span>
                          {value.author.displayName}
                        </td>
                        <td class="text-center" >
                          <div class="widget-content p-0">
                            <div class="widget-content-outer">
                              <div class="widget-content-wrapper">
                                <div class="widget-content-left pr-2">
                                  <div class="widget-numbers fsize-1 text-danger">
                                    71%
                                </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>

                      </tr>
                    ))
                  }

                </tbody>
                <tbody class="reactable-pagination">
                  <tr>
                    <td colspan="7">
                      <span class="row-selector">
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
          <YourProcess/>
        </div>
      </div>

      </div>
    </div>
  )

}

Problems.getInitialProps = async (ctx) => {
  // console.log(action)
  const { store: { dispatch }, pathname, req, res } = ctx
  await dispatch(searchQuestion())
  await dispatch(getCategory())

}

function mapStateToProps(state, ownProps) {
  return {
    tags: state.problem.category,
    question: state.problem.question,
    totalQuestion : state.problem.totalQuestion

  }
}


export default connect(mapStateToProps, { searchQuestion, chooseTags,
   dropdownFilter, getCategory ,addToWishList ,removeToWishList })(Problems);