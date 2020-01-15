import { gql } from "apollo-boost"

import Campaign from "../../types/Campaign"

export interface createCampaignMutationData {
  createCampaign: Campaign
}

export const CREATE_CAMPAIGN_MUTATION = gql`
mutation createCampaign($name: String!, $description: String!, $active: Boolean!, $items: [DiscountItemInput!]!) {
  createCampaign(name: $name, description: $description, active: $active, items: $items) {
    id
  }
}
`