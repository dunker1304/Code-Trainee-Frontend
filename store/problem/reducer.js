import produce from 'immer';
import {openNotificationWithIcon} from "../../components/Notification"

const tags = [
  { name: 'HTML', isClicked: false,id:1 },
  { name: 'CSS', isClicked: false ,id:2},
  { name: 'JavaScript', isClicked: false ,id:3},
  { name: 'jQuery', isClicked: false ,id:4},
  { name: 'Bootstrap', isClicked: false, id: 5 },
  { name: 'Angular', isClicked: false , id :6 }
]


const initState = {
  question : [],
  category : [],
  totalQuestion : 0
}

export default (state = initState, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case 'SEARCH_QUESTION':
        draft.question = action.payload.data
        draft.totalQuestion = action.payload.total
        break;

      case 'GET_ALL_CATEGORY' : 
        draft.category = action.payload   
        break;

      case 'UPDATE_CATEGORY' : 
        let tmpArray = JSON.parse(JSON.stringify(state.category))

        for(let i =0 ;i<tmpArray.length ; i++) {
          if(tmpArray[i].id == action.payload) {
            tmpArray[i]['isClicked'] = !tmpArray[i].isClicked
            }
        }
        draft.category = tmpArray  
        break;
      
      case 'DROP_DOWN_FILTER':
        let dropdownArr = JSON.parse(JSON.stringify(state.category))
        let result = dropdownArr.filter(value => {
          return value.name.toLowerCase().indexOf(action.payload.toLowerCase()) > -1
        })

        draft.category = result;
        break;  
      
      case 'ADD_TO_WISHLIST':
        if(action.payload.success) {
          let tmpQuestion = JSON.parse(JSON.stringify(state.question))
          let tmpWishList = action.payload.data
          for(let i =0 ;i<tmpQuestion.length ; i++) {
            if(tmpQuestion[i].id == tmpWishList['questionId']) {
                tmpQuestion[i]['isWishList'] = true
              }
          }
          draft.question = tmpQuestion  
          openNotificationWithIcon('success','Success','Add To WishList Successfully!')
        }  
        else {
          openNotificationWithIcon('error','Error', action.payload.message)
        }
        break;

      case 'REMOVE_TO_WISHLIST':
        if(action.payload.success) {
          let tmpQuestionRemove = JSON.parse(JSON.stringify(state.question))
          let tmpWishListRemove = action.payload.data
          console.log(tmpWishListRemove)
          for(let i =0 ;i<tmpQuestionRemove.length ; i++) {
            if(tmpQuestionRemove[i].id == tmpWishListRemove['questionId']) {
              tmpQuestionRemove[i]['isWishList'] = false
              }
          }
          draft.question = tmpQuestionRemove  
          openNotificationWithIcon('success','Success','Remove Successfully')
        }  
        else {
          openNotificationWithIcon('error','Error', action.payload.message)
        }
        break;

    }
  })
}