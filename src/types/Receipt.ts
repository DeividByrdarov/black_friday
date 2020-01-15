import ReceiptItem from "./ReceiptItem"
import User from "./User"

export default interface Receipt {
  id: string
  total: number
  user: User
  items: ReceiptItem[]
}