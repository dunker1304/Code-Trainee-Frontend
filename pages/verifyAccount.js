import Header from "../components/Header"
import Footer from "../components/Footer"
import axios from "axios"
const VerifyAccount = (props)=> {
  return (
    <div>
      <Header/>
      <div className="verifyAccount_wrapper">
        <div style= {{ display : props.success ? 'block' : 'none'}}>
           <h1>Congratulations!</h1>
           <div className="result-confirm">
             <p>You have successfully registered.</p>
           </div>
        </div>
        <div style= {{ display : props.success ? 'none' : 'block'}}>
           <h1>Confirm Email!</h1>
           <div className="result-confirm">
             <p>Unable to verify your email address.</p>
           </div>
        </div>
      </div>
      <Footer/>

    </div>
  )
}

VerifyAccount.getInitialProps = async (ctx) => {
  
  let secret = ctx.query.secret;
  let url = `${process.env.API}/accounts/confirm-email/${secret}`
  let resResult = await axios.get(url)

  return { success : resResult.data.success}
}

export default VerifyAccount;