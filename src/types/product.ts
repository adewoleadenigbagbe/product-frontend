export interface Product {
  id: string
  name: string
  vat : number
  price: number
  category: number
}

export interface PaginatedResponse<T> {
  items: T[]
  page: number
  pageLength: number
  totalPage: number
  totalCount: number
}

export interface GetProductByIdResponse {
  product: Product
}
