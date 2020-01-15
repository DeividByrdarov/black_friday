import thunk from "redux-thunk"
import { persistStore } from "redux-persist"
import { createStore, applyMiddleware } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"

import rootReducer from "./redux/reducers"

const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(thunk),
  ),
)

export const persistor = persistStore(store)

export default store