import { gql } from "apollo-boost"

export interface deleteProductMutationData {
  deleteProduct: boolean
}

export const DELETE_PRODUCT_MUTATION = gql`
mutation deleteProduct($productId: String!) {
  deleteProduct(productId: $productId)
}
`