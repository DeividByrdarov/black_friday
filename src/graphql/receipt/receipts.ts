import { gql } from "apollo-boost"
import Receipt from "../../types/Receipt"

export interface receiptsQueryData {
  receipts: Receipt[]
}

export const RECEIPTS_QUERY = gql`
query receipts {
  receipts {
    id
    total
    user {
      username
    }
    items {
      amount
      product {
        id
        name
        price
        discount
      }
    }
  }
}
`