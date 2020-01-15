import { gql } from "apollo-boost"
import Campaign from "../../types/Campaign"

export interface updateCampaignMutationData {
  updateCampaign: Campaign
}

export const UPDATE_CAMPAIGN_MUTATION = gql`
mutation updateCampaign($id: ID!, $name: String!, $description: String!, $active: Boolean!, $items: [DiscountItemInput!]!) {
  updateCampaign(id: $id, name: $name, description: $description, active: $active, items: $items) {
    id
    active
  }
}
`