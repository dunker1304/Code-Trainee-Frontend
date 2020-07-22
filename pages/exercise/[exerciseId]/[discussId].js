
import QuestionLayout from "../../../components/QuestionLayout"
import { connect } from 'react-redux'
import {getDiscussByCommentId} from "../../../store/discuss/action"
import Router , {useRouter} from 'next/router'
import { getQuery }from "../../../helpers/utils"
import composedAuthHOC from 'hocs';
const DiscussDetail = (props) => {
  const router = useRouter()
  return(
    <QuestionLayout discuss = {props.discuss} discussDetail = {props.discussDetail} questionId={props.questionId}/>
  )
}

DiscussDetail.getInitialProps = async (ctx) => {
  const { store: { dispatch }, pathname, req, res,query } = ctx
  let cmtId = query.discussId ? getQuery(query.discussId) : null
  let questionId = query.exerciseId ? query.exerciseId : null
  await dispatch(getDiscussByCommentId(cmtId))
  return { questionId }
}

function mapStateToProps(state, ownProps) {
  return {
    discussDetail : state.discuss.discussDetail
  }
}


export default connect(mapStateToProps,{getDiscussByCommentId})(composedAuthHOC(DiscussDetail))