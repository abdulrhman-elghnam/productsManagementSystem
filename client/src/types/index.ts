export type ApiResponse<T> = {
  success?: boolean
  message?: string
  statusCode?: number
  data: T
}

export type Product = {
  productID: number
  productName: string
  price: number
  stockQuantity: number
  supplierID: number
}

export type Supplier = {
  supplierID: number
  supplierName: string
  contactNumber: string
}

export type Sale = {
  saleID: number
  productID: number
  productName?: string
  quantitySold: number
  saleDate: string
}

export type TotalSalesReport = {
  productID: number
  productName: string
  totalQuantitySold: number | null
}

export type HighestStockReport = {
  productID: number
  productName: string
  stockQuantity: number
}

export type SalesReportRow = {
  productName: string
  quantitySold: number
  saleDate: string
}

export type NeverSoldProduct = {
  productID: number
  productName: string
  price: number
  stockQuantity: number
}

export type CreateProductInput = {
  productName: string
  price: number
  stockQuantity: number
  supplierID: number
}

export type UpdateProductInput = Partial<CreateProductInput>

export type CreateSupplierInput = {
  supplierName: string
  contactNumber: string
}

export type UpdateSupplierInput = Partial<CreateSupplierInput>

export type CreateSaleInput = {
  productID: number
  quantitySold: number
}
