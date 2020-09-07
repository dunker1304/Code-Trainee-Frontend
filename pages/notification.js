import { List, Button, Skeleton , Spin } from 'antd';
import axios from 'axios';
import Header from "../components/Header"
import Footer from "../components/Footer"
import Router from "next/router"
import moment from "moment"
import InfiniteScroll from 'react-infinite-scroller';
import composeHOC from "../hocs"
import {connect} from 'react-redux'
import classnames from "classnames"

class Notification extends React.Component {
  state = {
    initLoading: true,
    loading: false,
    data: [],
    list: [],
    page : 1,
    count:1,
    hasMore : true
  };

  async componentDidMount() {
   
    let data = await this.fetchData(1,5);
    this.setState({data : data.data , list : data.data,initLoading:false , count : data.page, hasMore : data.page > 1 ? true : false})

  }

 

  fetchData = async (page,limit)=>{
    let url = `${process.env.API}/api/get-all-notification/${this.props.userInfo['id']}?page=${page}&limit=${limit}`
    let resData = await axios.get(url);
    return resData.data;
  }

  onLoadMore = async() => {
    if(this.state.page >= this.state.count ) {
        this.setState({hasMore : false})
        return;
    }
    this.setState({
      loading: true,
      page : this.state.page + 1,
      list: this.state.data.concat([...new Array(5)].map(() => ({ loading: true, name: {} }))),
    });

    let res = await this.fetchData(this.state.page + 1,5);

    const data = this.state.data.concat(res.data);
    this.setState(
      {
        data :data,
        list: data,
        loading: false,
      }
    );
  };

  render() {
    const { initLoading, loading, list, hasMore } = this.state;

    const loadMore =
      !initLoading && !loading && hasMore ? (
        <div
          style={{
            textAlign: 'center',
            marginTop: 12,
            height: 32,
            lineHeight: '32px',
          }}
        >
          <Button onClick={this.onLoadMore} className="action_button">loading more</Button>
        </div>
      ) : null;

    return (
      <div>
        <Header/>
      <div className="container wrapper-notification" style={{width:"600px", minHeight:"100vh"}}>
       
      <div className="demo-infinite-container" >
      <h1 className="title_noti">Notifications</h1>
      
          <List
            className="demo-loadmore-list"
            loading={initLoading}
            itemLayout="horizontal"
            loadMore={loadMore}
            dataSource={list}
            renderItem={item => (
              <List.Item key={item.id} className = {classnames('item_noti', item.isRead ? 'item-noti-readed':'')}
             >
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
           
          </List>
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
