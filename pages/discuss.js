import DetailComment from "../components/DetailComment"
import ListComment from "../components/ListComment"
import QuestionLayout from "../components/QuestionLayout"
import { connect } from 'react-redux'
import {getDiscussByQuestionId} from "../store/discuss/action"


const Discuss = (props)=> {
  return (
    <div>
        <QuestionLayout {...props}>
          {/* <ListComment discuss= {props.discuss}/> */}
        </QuestionLayout>
    </div> 
    
  )
}


Discuss.getInitialProps = async (ctx) => {
  const { store: { dispatch }, pathname, req, res } = ctx
  await dispatch(getDiscussByQuestionId(1))
}

function mapStateToProps(state, ownProps) {
  return {
    discuss : state.discuss.discuss
  }
}


export default connect(mapStateToProps,{getDiscussByQuestionId})(Discuss);