import Header from "../components/Header"
import Footer from "../components/Footer"
import Process from "../components/Process"
const Processes = (props)=> {
  return (
    <div>
      <Header/>
      <div className="container-content process-container">
        <Process/>
      </div>
      <Footer/>
    </div>
  )
}

export default Processes;