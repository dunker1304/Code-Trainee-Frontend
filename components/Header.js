import { BellFilled , UserOutlined  } from "@ant-design/icons"

const Header = (props) => {
  return (
    <div className="coding-header">
      <div className="container header-content">
        <div className="coding-logo">
           <img src = '../static/images/codetrainee.png' style={{height : "30px"}}/>
        </div>
        <div className="conding-header-nav">
           <div className="header-left">
              <ul >
                <li><a>Exercises</a></li>
                <li><a>My Profile</a></li>
                <li><a>Forum </a></li>
              </ul>
           </div>
           <div className="header-right">
              <div className="header-ring">
                <BellFilled/>
              </div>
              <div className="header-user">
                <UserOutlined/>
              </div>
           </div>
        </div>
      </div>

    </div>
  )
}

export default Header