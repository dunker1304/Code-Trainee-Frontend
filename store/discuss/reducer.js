import produce from 'immer';
import {openNotificationWithIcon} from "../../components/Notification"
import {ERROR_MESSAGE_FROM_SERVER} from "../../utils/constants"
import Router , {useRouter} from 'next/router'

const initState = {
  discuss : [],
  discussDetail : {},
  totalDiscuss : 0
}

export default (state = initState, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case 'GET_COMMENT_QUESTION_ID':
        draft.discuss = action.payload.comments
        draft.totalDiscuss = action.payload.total
        break
      case 'GET_COMMENT_COMMENT_ID' :
        draft.discussDetail = action.payload
        break;
      case 'VOTE_A_COMMENT':
        let tmpDiscussDetail = JSON.parse(JSON.stringify(state.discussDetail)) 
        let tmpCommentVoted = action.payload.data

        //if vote comment parent
        if(tmpCommentVoted['id'] == tmpDiscussDetail['id']) {

          tmpDiscussDetail['statusVote'] = action.payload.statusVote
          tmpDiscussDetail['like'] = tmpCommentVoted.like
          tmpDiscussDetail['dislike'] = tmpCommentVoted.dislike
          draft.discussDetail = { ... tmpDiscussDetail}
          break;
        }
        // if vote comment children
        else {
           for(let i= 0 ;i < tmpDiscussDetail['children'].length ; i++ ){
              if(tmpCommentVoted['id'] == tmpDiscussDetail['children'][i]['id']) {
                tmpDiscussDetail['children'][i]['statusVote'] = action.payload.statusVote
                tmpDiscussDetail['children'][i]['like'] = tmpCommentVoted.like
                tmpDiscussDetail['children'][i]['dislike'] = tmpCommentVoted.dislike
                break;
              }
           }
          draft.discussDetail = { ... tmpDiscussDetail}
          break;
        }
      case 'CREATE_A_COMMENT_CHILDREN':
        let tmpCmt =   JSON.parse(JSON.stringify(state.discussDetail)) 
        let childrenCmt = action.payload;
            childrenCmt['isYourComment'] = true
        tmpCmt['children'].unshift(childrenCmt)

        draft.discussDetail = {...tmpCmt}
        break;

      case 'DELETE_A_COMMENT' : 
        let tmpCommentForDelete =  JSON.parse(JSON.stringify(state.discussDetail)) 

        let resultDelete = action.payload

        if(!resultDelete['success']) {
          openNotificationWithIcon('error','',ERROR_MESSAGE_FROM_SERVER[resultDelete['error']])
          break;
        }
        //if delete parent comment
        if(resultDelete['data']['id'] == tmpCommentForDelete['id']) {
          let tmpArray = JSON.parse(JSON.stringify(state.discuss)) 
          tmpArray = tmpArray.filter((element) => {
             return element['id'] != resultDelete['data']['id']
          });

          draft.discuss = [...tmpArray]
          openNotificationWithIcon('success','','Delete Successfully!')
          Router.push('/exercise/[exerciseId]/discuss',`/exercise/${tmpCommentForDelete['exerciseId']}/discuss`)
          break;
        }

        // if delete children comment
        else {
               let tmpChidlrenDelete = [...tmpCommentForDelete['children']]
               tmpChidlrenDelete = tmpChidlrenDelete.filter((element) => {
                 return element['id'] != resultDelete['data']['id']
               });
               tmpCommentForDelete = {...tmpCommentForDelete,children : [...tmpChidlrenDelete]}
               draft.discussDetail = { ... tmpCommentForDelete}
               openNotificationWithIcon('success','','Delete Successfully!')
               break;       
        }


    }
  })
}