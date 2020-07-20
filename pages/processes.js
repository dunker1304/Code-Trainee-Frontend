import Header from "../components/Header"
import Footer from "../components/Footer"
import Process from "../components/Process"
import CodeTrainee from 'hocs';


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

Processes.getInitialProps = async (ctx) => {
  return {}
}


export default CodeTrainee(Processes);