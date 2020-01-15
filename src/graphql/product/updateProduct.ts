import { gql } from "apollo-boost"
import Product from "../../types/Product"

export interface updateProductMutationData {
  updateProduct: Product
}

export const UPDATE_PRODUCT_MUTATION = gql`
mutation updateProduct($id: ID!, $name: String!, $description: String!, $price: Float!, $minPrice: Float!, $quantity: Int!) {
  updateProduct(id: $id, name: $name, description: $description, price: $price, minPrice: $minPrice, quantity: $quantity) {
    id
  }
}
`