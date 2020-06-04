import produce from 'immer';

const initState = {
  userInfo: {},
  token: ''
}

export default (state = initState, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case 'LOADED_USER_INFO':
        draft.userInfo = action.payload
        break
      case 'GOOGLE_AUTH': 
        draft.token = action.payload
        break
    }
  })
}