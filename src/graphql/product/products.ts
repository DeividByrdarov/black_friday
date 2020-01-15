import { gql } from "apollo-boost"

import Product from "../../types/Product"

export interface productsQueryData {
  products: Product[]
}

export const PRODUCTS_QUERY = gql`
query products {
  products {
    id
    name
    description
    price
    minPrice
    discount
    quantity
  }
}
`