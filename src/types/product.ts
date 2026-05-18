export interface Product {
  id: string
  name: string
  vat : number
  price: number
  category: number
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}
