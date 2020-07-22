
import WishList from "../components/WishList"
import Header from "../components/Header"
import Footer from "../components/Footer"
import composedAuthHOC from 'hocs';
const MyList = (props)=> {
  return (
    <div >
      <Header/>
      <div className = "container-content wishList-container">
        <WishList/>
       </div>
      
      <Footer/>
    </div>
  )
}

MyList.getInitialProps = async (ctx) => {

  return { }
}

export default composedAuthHOC(MyList);