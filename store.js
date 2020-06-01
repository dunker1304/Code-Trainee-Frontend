import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware, compose } from 'redux'
import reducers from 'reducers'
import { createWrapper } from 'next-redux-wrapper'

const initStore = (initState = {}) => {
  const store = createStore(
    reducers,
    initState,
    compose(
      applyMiddleware(thunkMiddleware),
      typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__() : f => f
    )
  )
  return store
}

export const wrapper = createWrapper(initStore, { debug: true })
