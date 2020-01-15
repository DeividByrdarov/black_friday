import Product from "./Product"

export interface DiscountItemInput {
  discount: number
  productId: string
}

export default interface DiscountItem {
  discount: number
  product: Product
}