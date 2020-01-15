import { gql } from "apollo-boost"

import Campaign from "../../types/Campaign"

export interface campaignsQueryData {
  campaigns: Campaign[]
}

export const CAMPAIGNS_QUERY = gql`
query campaigns {
  campaigns {
    id
    name
    description
    active
    items {
      discount
      product {
        id
        name
        description
        price
        minPrice
      }
    }
  }
}
`