import produce from "immer"
import { AnyAction } from "redux"

import Product from "../../types/Product"
import { ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART } from "../actions/CartActions"

interface State {
  items: {
    amount: number
    product: Product
  }[]
}

const initialState: State = {
  items: [],
}

const cartReducer = (state = initialState, action: AnyAction) =>
  produce(state, draft => {
    switch (action.type) {
      case ADD_TO_CART.INTERNAL:
        if (draft.items.find(item => item.product.id === action.payload.product.id)) {
          draft.items = draft.items.map(item => item.product.id === action.payload.product.id ? {
            ...item,
            amount: item.amount + action.payload.amount,
          } : item)
        } else {
          draft.items.push(action.payload)
        }
        return
      case REMOVE_FROM_CART.INTERNAL:
        draft.items = draft.items.filter(item => item.product.id !== action.payload.product.id)
        return
      case CLEAR_CART.INTERNAL:
        draft.items = []
        return
      default:
        return state
    }
  })

export default cartReducer