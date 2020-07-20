import { BellFilled , UserOutlined ,HeartOutlined,
  FileProtectOutlined,PieChartOutlined,UndoOutlined,LogoutOutlined   } from "@ant-design/icons"
import Logo from "../static/images/codetrainee.png"
import { Menu , Dropdown,Popover,Avatar} from 'antd';
import Link from 'next/link'



const Header = (props) => {
  const text = 
    <span>
       <Avatar size="small" icon={<UserOutlined />} /><b className="user_name">quynhkt</b>
    </span>;

  const content = (
        <ul className = "prover_ul">
          <Link href="/list" as="/list">
               <li>
               <HeartOutlined style={{color : "#d05451",fontSize :"20px"}} className="icon_prover_header"/>My List
               </li>
          </Link>
          <Link href="/profile/[profileId]" as={`/profile/${5}`}>
            <li>
              <FileProtectOutlined style={{color : "#1da09c" ,fontSize :"20px"}} className="icon_prover_header"/> My Profile
            </li>
          </Link> 
          <Link href="/processes" as="/processes" >
            <li>
              <PieChartOutlined style={{color : "#8365cd" ,fontSize :"20px"}} className="icon_prover_header"/>My Process
            </li>
          </Link>  
          <li> <UndoOutlined style={{color : "#ffdf00" ,fontSize :"20px"}} className="icon_prover_header"/> Change Password</li>
          <li> <LogoutOutlined style={{color : "#fea116",fontSize :"20px"}} className="icon_prover_header"/> Sign out</li>
        </ul>
  );  

  return (
    <div className="coding-header">
      <div className="container header-content">
        <div className="coding-logo">
           <img src = {Logo} style={{height : "30px"}}/>
        </div>
        <div className="conding-header-nav">
           <div className="header-left">
               <Menu mode="horizontal">
                <Menu.Item key="exercises">
                   <Link href="/problem" as="/problem">
                    <a href="">Exercises</a>
                  </Link>
                </Menu.Item>
                <Menu.Item key="profile">
                  <a href="">My Profile</a>
                </Menu.Item>
                <Menu.Item key="forum">
                  <a href="">Forum</a>
                </Menu.Item>
              </Menu>
           </div>
           <div className="header-right">
              <div className="header-ring">
                <BellFilled/>
              </div>
              <div className="header-user">
                 <Popover placement="bottomRight" title={text} content={content} trigger="click" className="header_proper">
                    <UserOutlined/>
                  </Popover>
                
              </div>
           </div>
        </div>
      </div>

    </div>
  )
}

export default Header