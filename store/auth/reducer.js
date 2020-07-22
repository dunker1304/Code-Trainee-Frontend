import produce from 'immer';
import {openNotificationWithIcon} from '../../components/Notification'
import Router , {useRouter} from 'next/router'
import { redirectRouter } from "../../helpers/utils"


const initState = {
  userInfo: {},
  authMessage :'',
  isShowLogin: {
    isShow:false,
    type:1
  },
  isLoginSuccess :false,
  isAuthenticated : false
}

export default (state = initState, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case 'LOADED_USER_INFO':
        if(action.payload.success) {
          draft.userInfo = action.payload.user;
          draft.isAuthenticated = true
        }
        else {
          draft.userInfo = action.payload.user
          draft.isAuthenticated = false
        }
     
        break
      case 'SIGN_IN': 
         if(!action.payload.success){
           draft.authMessage = action.payload.message.message
           draft.isShowNoti = true
           openNotificationWithIcon('error','ERROR',action.payload.message.message)
         }
         else {
          draft.userInfo = action.payload.user
          draft.authMessage = action.payload.message
          draft.isShowLogin = {
            isShow : false,
            type: 1
          }
          openNotificationWithIcon('success','SUCCESS',action.payload.message)
          redirectRouter(draft.userInfo['role']['id'])
         }   
        break

      case 'DISPLAY_LOGIN':
          draft.isShowLogin = action.payload
          break  
      case 'SIGN_UP':
       // if(!action.payload.success){
          draft.signUpError = action.payload.message
          openNotificationWithIcon('warning','',action.payload.message)
          break 
     
    }
  })
}