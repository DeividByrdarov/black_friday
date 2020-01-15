import { gql } from "apollo-boost"

import Receipt from "../../types/Receipt"

export interface createReceiptMutationData {
  createReceipt: Receipt
}

export const CREATE_RECEIPT_MUTATION = gql`
mutation createReceipt($userSessionId: String!, $items: [ReceiptItemInput!]!) {
  createReceipt(userSessionId: $userSessionId, items: $items) {
    id
  }
}  
`