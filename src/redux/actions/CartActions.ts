import { Dispatch } from "redux"

import Product from "../../types/Product"
import { createRequestTypes, actionCreator } from "."

export const ADD_TO_CART = createRequestTypes("ADD_TO_CART")
export const REMOVE_FROM_CART = createRequestTypes("REMOVE_FROM_CART")
export const CLEAR_CART = createRequestTypes("CLEAR_CART")

export default class CartActions {
  public static addToCart = (product: Product, amount: number) => (dispatch: Dispatch) => {
    dispatch(actionCreator.internal(ADD_TO_CART, {
      amount,
      product,
    }))
  }

  public static removeFromCart = (item: { amount: number, product: Product }) => (dispatch: Dispatch) => {
    dispatch(actionCreator.internal(REMOVE_FROM_CART, item))
  }

  public static clearCart = () => (dispatch: Dispatch) => {
    dispatch(actionCreator.internal(CLEAR_CART))
  }
}