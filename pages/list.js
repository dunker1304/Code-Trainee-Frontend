
import WishList from "../components/WishList"
import Header from "../components/Header"
import Footer from "../components/Footer"
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
export default MyList;