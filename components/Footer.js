import Logo from "../static/images/codetrainee.png"
const Footer = (props)=> {
 return (
   <div className = "site-footer">
     <div className = "row">
     
       <div className = "right-reserved">
       <hr className="footer-hr"/>
         <span className ="powerby">
           <img src={Logo} className="logo"/>
            Powered by Code Trainee
         </span>
         <span className="copyright">© 2020.</span>
         <span>All Rights Reserved. rev 7/1/2020 11:46:41 AM</span>

         
       </div>

     </div>

   </div>
 )
}
export default Footer;