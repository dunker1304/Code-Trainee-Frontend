import produce from 'immer';

const initState = {
  userInfo: {}
}


export default (state = initState, action) => {
  return produce(state, draft => {
    console.log(action, 'payload')
    switch (action.type) {
      case 'LOADED_USER_INFO':
        draft.userInfo = action.payload
        break
    }
  })
}