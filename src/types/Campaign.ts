import DiscountItem from "./DiscountItem"

export default interface Campaign {
  id: string
  name: string
  description: string
  active: boolean
  items: DiscountItem[]
}