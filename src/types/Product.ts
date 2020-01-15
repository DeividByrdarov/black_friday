export default interface Product {
  id: string
  name: string
  description: string
  price: number
  minPrice: number
  quantity: number
  discount?: number
}