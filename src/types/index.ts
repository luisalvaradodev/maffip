// types.ts
export interface Category {
  id: string
  name: string
  parent_id: string | null
  children?: Category[]
}
  export interface Product {
    id: number
    name: string
    price: number
    image: string
  }