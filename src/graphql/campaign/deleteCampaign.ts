import { gql } from "apollo-boost"

export interface deleteCampaignMutationData {
  deleteCampaign: boolean
}

export const DELETE_CAMPAIGN_MUTATION = gql`
mutation deleteCampaign($campaignId: String!) {
  deleteCampaign(campaignId: $campaignId)
}
`