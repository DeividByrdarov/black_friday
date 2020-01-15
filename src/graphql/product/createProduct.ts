import { gql } from "apollo-boost"

import Product from "../../types/Product"

export interface createProductMutationData {
  createProduct: Product
}

export const CREATE_PRODUCT_MUTATION = gql`
mutation createProduct($name: String!, $description: String!, $price: Float!, $minPrice: Float!, $quantity: Int!) {
  createProduct(name: $name, description: $description, price: $price, minPrice: $minPrice, quantity: $quantity) {
    id
  }
}
`