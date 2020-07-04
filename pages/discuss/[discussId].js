
import QuestionLayout from "../../components/QuestionLayout"
import { connect } from 'react-redux'
import {getDiscussByCommentId} from "../../store/discuss/action"
import Router , {useRouter} from 'next/router'

const DiscussDetail = (props) => {
  const router = useRouter()
  return(
    <QuestionLayout discuss = {props.discuss} discussDetail = {props.discussDetail}/>
  )
}

DiscussDetail.getInitialProps = async (ctx) => {
  const { store: { dispatch }, pathname, req, res,query } = ctx
  let cmtId = query.discussId ? query.discussId : null
  await dispatch(getDiscussByCommentId(cmtId))
}

function mapStateToProps(state, ownProps) {
  return {
    discussDetail : state.discuss.discussDetail
  }
}


export default connect(mapStateToProps,{getDiscussByCommentId})(DiscussDetail)