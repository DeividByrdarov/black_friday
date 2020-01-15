import thunk from "redux-thunk"
import { persistStore } from "redux-persist"
import { createStore, applyMiddleware, compose } from "redux"

import rootReducer from "./redux/reducers"

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
  ),
)

export const persistor = persistStore(store)

export default store