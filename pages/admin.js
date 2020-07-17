import Header from "../components/Header"
import { useState } from "react"
import Footer from "../components/Footer"
import { Menu, Dropdown, Button, Input, Table, Tag, Space, Drawer, Form, Col, Row, Select, Switch } from 'antd';
import { DownOutlined, PlusOutlined, DeleteOutlined, EditOutlined, UsergroupDeleteOutlined,CheckOutlined } from "@ant-design/icons"



const data = [
  {
    index: '1',
    name: 'John Brown',
    role: 'Student',
    status: 'Deactive',
  },
  {
    index: '2',
    name: 'Jim Green',
    role: 'Student',
    status: 'Deactive',
  },
  {
    index: '3',
    name: 'Joe Black',
    role: 'Student',
    status: 'Active',
  },
];

const role = [
  {
    id : 3 ,
    name : 'admin'
  },
  {
    id : 4 ,
    name : 'teacher'
  },
  {
    id : 5 ,
    name : 'student'
  }

]


const Admin = (props) => {

  const [visible, setVisible] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [roleActive , setRoleActive ] = useState(0)
  const [dropDownVisible , setDropDownVisible] = useState(0)
  const handleRoleActive = (key)=>{
    setRoleActive(key)
  }
  const menu = (
    <Menu onClick = { ({key}) => handleRoleActive(key)}>
       {role.map((value,index) => (
         <Menu.Item key = {index}>
            {index == roleActive ?  <CheckOutlined/>  : ''}
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

  const showDrawerEdit = () => {
    setVisibleEdit(true)
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
      title: 'NAME',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
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
      render: (text) => (<span className={text == 'Deactive' ? '_deactive' : '_active'}>{text}</span>)
    },
    {
      title: 'ACTION',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <EditOutlined onClick={showDrawerEdit} />
          {/* <DeleteOutlined /> */}
        </Space>
      ),
    },
  ];
  const onChange = (newValue) => {
    setDropDownVisible(newValue)
  }

  return (
    <div>
      <Header />
      <div className="container-content admin-content">
        <div className="admin-wrap-content container">
          <div style={{ display: "flex" }}>
            <h2 className="title_manage_acc">List Account  </h2>
            <UsergroupDeleteOutlined style={{ fontSize: "25px", marginLeft: "10px" }} />
          </div>

          <div className="vs-component">
            <header className="header-table-admin ">
              <div className="button_action">
                <Dropdown overlay={menu} placement="bottomRight" trigger={['click']} visible = {dropDownVisible} onVisibleChange={onChange}>
                  <button className="action_btn">Role <DownOutlined /></button>
                </Dropdown>
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
                      <Button onClick={onClose} type="primary">
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
                          <Input placeholder="Please enter user name" />
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
                          <Input placeholder="Please enter email" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={16}>
                        <Form.Item
                          name="phone"
                          label="Phone"
                          rules={[{ required: false, message: 'Please enter phone' }]}
                        >
                          <Input placeholder="Please enter phone" />
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
                          <Select placeholder="Please select your role">
                            <Option value="3">Admin</Option>
                            <Option value="4">Teacher</Option>
                            <Option value="5">Student</Option>
                          </Select>

                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Drawer>
              </div>
              <div className="filter_action">
                <Input placeholder="Search..." />
              </div>

            </header>
            <div className="data-list-container">
              <Table columns={columns} dataSource={data} pagination={false} />

            </div>
          </div>

        </div>

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
            <Button onClick={onCloseEdit} type="primary">
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
                <Input placeholder="Please enter user name" />
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
                <Input placeholder="Please enter email" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="phone"
                label="Phone"
                rules={[{ required: false, message: 'Please enter phone' }]}
              >
                <Input placeholder="Please enter phone" />
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
                <Select placeholder="Please select your role">
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
                label="Active Account"
              >
                <Switch checked={true} />

              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  )
}

export default Admin;