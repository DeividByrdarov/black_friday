import { gql } from "apollo-boost"

import Campaign from "../../types/Campaign"

export interface activeCampaignQueryData {
  activeCampaign?: Campaign
}

export const ACTIVE_CAMPAIGN_QUERY = gql`
query activeCampaign {
  activeCampaign {
    id
    name
    description
  }   
}
`