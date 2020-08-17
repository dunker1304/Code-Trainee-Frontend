import { List, message, Avatar, Spin } from 'antd';
import axios from 'axios';
import Header from "../components/Header"
import Footer from "../components/Footer"
import Router from "next/router"
import moment from "moment"
import InfiniteScroll from 'react-infinite-scroller';
import composeHOC from "../hocs"
import {connect} from 'react-redux'

class Notification extends React.Component {
  state = {
    data: [],
    loading: false,
    hasMore: true,
  };

  async componentDidMount() {
   
    let data = await this.fetchData();
    this.setState({data : data.data})
  }

 

  fetchData = async ()=>{
    let url = `${process.env.API}/api/get-all-notification/${this.props.userInfo['id']}`
    let resData = await axios.get(url);
    return resData.data;
  }

  handleInfiniteOnLoad = async () => {
    let { data } = this.state;
    this.setState({
      loading: true,
    });
    if (data.length > 14) {
      message.warning('Infinite List loaded all');
      this.setState({
        hasMore: false,
        loading: false,
      });
      return;
    }

    let tmp = await this.fetchData();
    data = data.concat(tmp)

    this.setState({data,loading:false})
  };

  render() {
    return (
      <div>
        <Header/>
      <div className="container wrapper-notification" style={{width:"600px", minHeight:"100vh"}}>
       
      <div className="demo-infinite-container" >
      <h1 className="title_noti">Notifications</h1>
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={this.handleInfiniteOnLoad}
          hasMore={!this.state.loading && this.state.hasMore}
          useWindow={false}
        >
          <List
            dataSource={this.state.data}
            renderItem={item => (
              <List.Item key={item.id}>
                <div>
                <div dangerouslySetInnerHTML = {{__html : item['content']}}>
               
                </div>
                <div className="timezone">
                    <span>{moment(item.createdAt).fromNow()}</span>
                </div>
                </div>
                <button className="action_button" onClick= {()=>Router.push(`${item.type == 1 ? '/exercise/[exerciseId]/discuss': '/review'}`,item['linkAction'])}>View Detail</button>
              </List.Item>
            )}
          >
            {this.state.loading && this.state.hasMore && (
              <div className="demo-loading-container">
                <Spin />
              </div>
            )}
          </List>
        </InfiniteScroll>
      </div>
      </div>
      <Footer/>
      </div>
    );
  }
}

function mapStateToProps(state,ownProps) {
  return {
    authMessage: state.auth.authMessage,
  
  }
}


export default connect(mapStateToProps,null)(composeHOC(Notification)); 
