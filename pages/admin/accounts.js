import Header from "../../components/Header"
import { useState , useEffect ,useRef} from "react"
import Footer from "../../components/Footer"
import { Menu, Dropdown, Button,Tooltip, Input, Table, DatePicker, Space, Drawer, Form, Col, Row, Select, Switch,Pagination } from 'antd';
import { DownOutlined, PlusOutlined, DeleteOutlined, EditOutlined, UsergroupDeleteOutlined,CheckOutlined, FilterFilled } from "@ant-design/icons"
import axios from "axios"
import { openNotificationWithIcon} from "../../components/Notification"
import moment from "moment"
import _, { filter } from 'lodash'
import composedAuthHOC from 'hocs';
import { disabledDate } from "../../helpers/utils"
const CONSTANTS = require('../../utils/constants')


const role = [
  
  {
    id : 3 ,
    name : 'Admin'
  },
  {
    id : 4 ,
    name : 'Teacher'
  },
  {
    id : 5 ,
    name : 'Student'
  },
  {
    id : -1 ,
    name : 'All'
  },

]


const Admin = (props) => {

  const [visible, setVisible] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [roleActive , setRoleActive ] = useState(3)
  const [dropDownVisible , setDropDownVisible] = useState(0)
  const [listAccount , setListAccount] = useState([])


  const [editUsername , setEditUsername] = useState('')
  const [editEmail , setEditEmail] = useState('')
  const [editDisplayName , setEditDisplayName] = useState('')
  const [editPhone , setEditPhone] = useState('')
  const [editRole ,setEditRole] = useState('')
  const [editDeactive , setEditDeactive] = useState(false)
  const [editDOB , setEditDOB] = useState('')
  const [editUserId , setEditUserId] = useState('')
  const [currentPage , setCurrentPage] = useState(1)
  const [pageSize , setPageSize] = useState(20)
  const [pageTotal , setPageTotal] = useState(1)
  const formatDate = 'DD/MM/YYYY'

  const handleRoleActive = async (key)=>{
    setRoleActive(key)
    fetchData(1,key)
  }
  const menu = (
    <Menu onClick = { ({key}) => handleRoleActive(key)}>
       {role.map((value,index) => (
         <Menu.Item key = {value['id']}>
            {value['id'] == roleActive ?  <CheckOutlined/>  : ''}
            <span >
               {value.name}
            </span>
       </Menu.Item>
      ))}
     
    </Menu>
  );
  const { Option } = Select;

  const showDrawer = () => {
    setVisible(true)
  };

  const onClose = () => {
    setVisible(false)
  };

  const showDrawerEdit = async(record) => {
    setVisibleEdit(true)

    //load edit account
    let urlUser = `${process.env.API}/api/admin/get-user-by-id`
    let data = { userId : record['id']}
    const resUser = await axios.post(urlUser,data)
    if(resUser.data.success) {
      // setEditAccount(resUser.data.data)
      // console.log(resUser.data)
      let data = resUser.data.data;
      setEditUserId(data['id'])
      setEditUsername(data['username'])
      setEditEmail(data['email'])
      setEditDisplayName(data['displayName'])
      setEditPhone(data['phone'])
      setEditRole(data['roles'] ? data['roles'][0]['id'] : '')
      setEditDeactive(data['isDeleted'])
      setEditDOB( data['dateOfBirth'] ? moment(data['dateOfBirth']).format(formatDate) : null)
    }
    else {
      openNotificationWithIcon('error','','Load data fail!')
    }
   
    
  };

  const onCloseEdit = () => {
    setVisibleEdit(false)
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: 'EMAIL',
      dataIndex: 'email',
      key: 'email',
      render: text => <a>{text}</a>,
    },
    {
      title: 'USERNAME',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'ROLE',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'STATUS',
      key: 'status',
      dataIndex: 'status',
      render: (text) => (<span className={text == 'Deactive' ? '_deactive' : text == 'Active' ? '_active':'_unconfirmed'}>{text}</span>)
    },
    {
      title: 'ACTION',
      key: 'action',
      render: (text, record) => (
        <Tooltip title = { !record['isDeleted'] ? 'Deactive Account' : 'Active Account'}>
          {/* <EditOutlined onClick={()=>showDrawerEdit(record)} /> */}
          {/* <DeleteOutlined /> */}
          <Switch checked={record['isDeleted']} onChange ={(checked)=>deactiveAccount(record,checked)}/>
        </Tooltip>
      ),
    },
  ];
  const onChange = (newValue) => {
    setDropDownVisible(newValue)
  }

  const submitEditAccount = async ()=> {
    let data = {
      userId : editUserId,
      username : editUsername ,
      email : editEmail ,
      phone : editPhone ,
      dateOfBirth : editDOB,
      deActive : editDeactive,
      displayName : editDisplayName,
      role : editRole,
      key : 'admin-edit'
    }
   
    let urlUser = `${process.env.API}/api/admin/edit-an-account`
    const resUser = await axios.post(urlUser,data)
    if(resUser.data.success) {
      openNotificationWithIcon('success', '', 'Edit Account Successfully!')
      fetchData(currentPage,roleActive)
      onCloseEdit()
    }
    else {
      openNotificationWithIcon('error', '', 'Edit Account Fail!')
    }

  }

  const deactiveAccount = async (record,value)=> {
    let type = 'active'
    if(record['statusNumber'] == 0) {
      type = 'confirm'
    }
    let data = {
      value : value,
      userId : record['id'],
      key : type
    }
   
    let urlUser = `${process.env.API}/api/admin/deactive-an-account`
    const resUser = await axios.post(urlUser,data)
    if(resUser.data.success) {
      openNotificationWithIcon('success', '', resUser.data.message)
      let listTmp = JSON.parse(JSON.stringify(listAccount));
      listTmp.forEach(element => {
        if(element['id'] == record['id'] && type == 'confirm') {
          element['status'] = 'Active';
          element['statusNumber'] = 1;
        }

        if(element['id'] == record['id'] && type == 'active') {
          element['status'] = value ? 'Deactive' : 'Active';
          element['isDeleted'] = value;
        }

      });
      setListAccount(listTmp)
    }
    else {
      openNotificationWithIcon('error', '', 'Edit Account Fail!')
    }
      
  }

  const submitCreateAccount = async ()=>{
    let data = {
      username : editUsername ,
      email : editEmail ,
      phone : editPhone ,
      dateOfBirth : editDOB,
      displayName : editDisplayName,
      role : CONSTANTS.ROLE.ROLE_ADMIN,
      key : 'admin-edit'
     }

    let urlUser = `${process.env.API}/api/admin/create-an-account`
    const resUser = await axios.post(urlUser,data)
    if(resUser.data.success) {
      openNotificationWithIcon('success', '', resUser.data.message)
      fetchData(currentPage,roleActive)
      onClose()
    }
    else {
      openNotificationWithIcon('error', '', resUser.data.message ? resUser.data.message :'Edit Account Fail!')
    }

  }

  const handleClickPagging = (pageNumber)=>{
        fetchData(pageNumber,roleActive)
        setCurrentPage(pageNumber)
  }

  useEffect( ()=>{
    fetchData(1,roleActive);
  },[])

  const fetchData = async (page,role)=>{
    let urlUser = `${process.env.API}/api/admin/get-user-by-role`
    let data = { role : role , page : page}
    const resUser = await axios.post(urlUser,data)
    if(resUser.data.success) {
      setListAccount(resUser.data.data.users)
      setPageTotal(resUser.data.data.total)
    }
    else {
      openNotificationWithIcon('error','','Load data fail!')
    }
  }

  const searchHandleChange = async (e)=> {
     delayedQuery(e.target.value,roleActive);
  }

  const fetchKeySearchDate = async (keySearch,role)=> {
    if(keySearch.trim()) {
      let urlUser = `${process.env.API}/api/admin/search-fuzzy-account`
      let data = { role : role , keySearch : keySearch}
      const resUser = await axios.post(urlUser,data)
      if(resUser.data.success) {
        setListAccount(resUser.data.data.users)
        setPageTotal(resUser.data.data.total)
      }
      else {
        openNotificationWithIcon('error','','Load data fail!')
      }
    }
    else {
      fetchData(1,role)
    }
   
  }

  const delayedQuery = useRef(_.debounce((e,role) => fetchKeySearchDate(e,role), 500)).current;
  

  return (
    <div>
      <Header />
      <div className="container-content admin-content">
        <div className="admin-wrap-content container">
          <div style={{ display: "flex",paddingTop:"30px" }}>
            <h2 className="title_manage_acc">List Account  </h2>
            <UsergroupDeleteOutlined style={{ fontSize: "25px", marginLeft: "10px" }} />
          </div>

          <div className="vs-component">
            <header className="header-table-admin ">
              <div className="button_action">
              <div style={{ position: 'relative' }} id="area_role_admin">
                <Dropdown overlay={menu} placement="bottomRight"
                 trigger={['click']} 
                 visible = {dropDownVisible} 
                 onVisibleChange={onChange}
                 getPopupContainer={() => document.getElementById('area_role_admin')}
                 >
                  <button className="action_btn">Role <DownOutlined /></button>
                </Dropdown>
                </div>
                <button className="add_btn" onClick={showDrawer} > <PlusOutlined /> Add Account</button>

                <Drawer
                  title="Create a new account"
                  width={520}
                  onClose={onClose}
                  visible={visible}
                  bodyStyle={{ paddingBottom: 80 }}
                  footer={
                    <div
                      style={{
                        textAlign: 'right',
                      }}
                    >
                      <Button onClick={onClose} style={{ marginRight: 8 }}>
                        Cancel
                      </Button>
                      <Button onClick={submitCreateAccount} type="primary">
                        Submit
                      </Button>
                    </div>
                  }
                >
                  <Form layout="vertical" hideRequiredMark>
                    <Row gutter={16}>
                      <Col span={16}>
                        <Form.Item
                          name="username"
                          label="Username"
                          rules={[{ required: true, message: 'Please enter user name' }]}
                        >
                          <Input placeholder="Please enter user name" value={editUsername} onChange={(e)=>setEditUsername(e.target.value)} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>

                      <Col span={16}>
                        <Form.Item
                          name="email"
                          label="Email"
                          rules={[{ required: true, message: 'Please enter email' }]}
                        >
                          <Input placeholder="Please enter email" value={editEmail} onChange={(e)=>setEditEmail(e.target.value)}/>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={16}>
                        <Form.Item
                          name="displayName"
                          label="Display Name"
                          rules={[{ required: false, message: 'Please enter your display name' }]}
                        >
                          <Input placeholder='Please enter your display name' value={editDisplayName} onChange={(e)=>setEditDisplayName(e.target.value)}/>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={16}>
                        <Form.Item
                          name="phone"
                          label="Phone"
                        >
                          <Input placeholder="Please enter phone" value={editPhone} onChange={(e)=>setEditPhone(e.target.value)}/>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={16}>
                        <Form.Item
                          name="dob"
                          label="Date of birth"
                         
                        >
                           <DatePicker value = {moment(editDOB, formatDate) } 
                           format={formatDate}
                           allowClear = {false}
                           onChange={(date,dateString)=> setEditDOB(dateString)} 
                           disabledDate = { disabledDate}
                           /> 
                        </Form.Item>
                      </Col>
                    </Row>
                   
                    <Row gutter={16}>
                      <Col span={16}>
                        <Form.Item
                          name="role"
                          label="Role"
                          rules={[{ required: true, message: 'Please enter your role' }]}
                        >
                            <Input  defaultValue='Admin' readOnly />

                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Drawer>
              </div>
              <div className="filter_action">
                <Input placeholder="Search..." onChange= {(e) => searchHandleChange(e)}/>
              </div>

            </header>
            <div className="data-list-container">
              <Table columns={columns} dataSource={listAccount} pagination={false} />
              <div className="data-pagging" style={ { display : pageTotal != 0 ?'flex' : 'none'} }>
                  <Pagination
                    defaultCurrent={1}
                    current= {currentPage}
                    total={pageTotal}
                    showSizeChanger={false}
                    pageSize={pageSize}
                    defaultPageSize={20} 
                    onChange= {(pageNumber)=> {handleClickPagging(pageNumber)}}
                    />
              </div>
              
              
            </div>
          </div>

        </div>
        <Footer/>
      </div>
     

      <Drawer
        title="Edit An account"
        width={520}
        onClose={onCloseEdit}
        visible={visibleEdit}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={onCloseEdit} style={{ marginRight: 8 }}>
              Cancel
                      </Button>
            <Button onClick={submitEditAccount} type="primary">
              Submit
                      </Button>
          </div>
        }
      >
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true, message: 'Please enter user name' }]}
              > <Input   value={editUsername}  disabled/>              
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>

            <Col span={16}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: 'Please enter email' }]}
              > <Input   value={editEmail} disabled />
                
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="displayName"
                label="Display Name"
                rules={[{ required: true, message: 'Please enter your display name' }]}
              > <Input placeholder="Please enter your display name" value={editDisplayName} onChange= {(e)=> {setEditDisplayName(e.target.value)}}/>

              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="dob"
                label="DOB"
              > {
                editDOB ?   <DatePicker value = {moment(editDOB, formatDate) } format={formatDate} allowClear = {false}onChange={(date,dateString)=> setEditDOB(dateString)} /> :
                <DatePicker  format={formatDate} allowClear = {false}onChange={(date,dateString)=> setEditDOB(dateString)} /> 
              }
            
            

              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="phone"
                label="Phone"
              > <Input placeholder="Please enter phone" value={editPhone}  onChange= {(e)=> {setEditPhone(e.target.value)}}/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: 'Please enter your role' }]}
              >  <Select onSelect = {(value)=> setEditRole(value)} placeholder="Please select your role" value= {editRole == 3 ?'Admin' : editRole == 4 ? 'Teacher' : 'Student'} >
                  <Option value="3">Admin</Option>
                  <Option value="4">Teacher</Option>
                  <Option value="5">Student</Option>
                </Select>

              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={10}>
              <Form.Item
                name="status"
                label="DeActive Account"
              >
                <Switch checked={editDeactive} onChange ={()=>setEditDeactive(!editDeactive)}/>

              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  )
}

Admin.getInitialProps = async function(ctx) {
 
}

export default composedAuthHOC(Admin);