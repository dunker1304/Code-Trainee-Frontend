
import QuestionLayout from "../../../components/QuestionLayout"
import { connect } from 'react-redux'
import {getDiscussByQuestionId } from "../../../store/discuss/action"
import axios from "axios"
import composedAuthHOC from 'hocs';



const Discuss = (props)=> {
  return (
    <div>
        <QuestionLayout {...props}>
        
        </QuestionLayout>
    </div> 
    
  )
}


Discuss.getInitialProps = async (ctx) => {
  const { store: { dispatch }, pathname, req, res ,query} = ctx
  let questionId = query.exerciseId ? query.exerciseId  : null;
  await dispatch(getDiscussByQuestionId(questionId))
  let url = `${process.env.API}/api/exercise?id=${questionId}`
  const questionResponse = await axios.get(url)
  return { question: questionResponse.data.question, questionId : questionId }

}

function mapStateToProps(state, ownProps) {
  return {
    discuss : state.discuss.discuss,
    totalDiscuss :  state.discuss.totalDiscuss
  }
}


export default connect(mapStateToProps,{getDiscussByQuestionId})(composedAuthHOC(Discuss));