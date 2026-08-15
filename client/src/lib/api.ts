import type {
  ApiResponse,
  CreateProductInput,
  CreateSaleInput,
  CreateSupplierInput,
  HighestStockReport,
  NeverSoldProduct,
  Product,
  Sale,
  SalesReportRow,
  Supplier,
  TotalSalesReport,
  UpdateProductInput,
  UpdateSupplierInput,
} from "@/types"

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080"

class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload
        ? String(payload.message)
        : `Request failed with status ${response.status}`

    throw new ApiError(message, response.status)
  }

  return payload as T
}

function unwrap<T>(response: ApiResponse<T> | { data?: T } | T): T {
  if (!response || typeof response !== "object") {
    return response as T
  }

  const data = "data" in response ? response.data : undefined

  if (
    data !== undefined &&
    data !== null &&
    typeof data === "object" &&
    "data" in data
  ) {
    return (data as { data: T }).data
  }

  return (data ?? response) as T
}

export const api = {
  products: {
    getAll: () =>
      request<ApiResponse<Product[]>>("/product/all").then(unwrap),
    getById: (id: number) =>
      request<ApiResponse<Product[]>>(`/product/${id}`).then(
        (response) => unwrap(response)[0],
      ),
    create: (input: CreateProductInput) =>
      request<ApiResponse<unknown>>("/product/create", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    update: (productID: number, input: UpdateProductInput) =>
      request<ApiResponse<unknown>>(`/product/update/${productID}`, {
        method: "PATCH",
        body: JSON.stringify(input),
      }),
    delete: (productID: number) =>
      request<ApiResponse<unknown>>(`/product/delete/${productID}`, {
        method: "DELETE",
      }),
  },

  suppliers: {
    getAll: () =>
      request<ApiResponse<Supplier[]>>("/supplier/all").then(unwrap),
    getById: (id: number) =>
      request<ApiResponse<Supplier[]>>(`/supplier/${id}`).then(
        (response) => unwrap(response)[0],
      ),
    create: (input: CreateSupplierInput) =>
      request<ApiResponse<unknown>>("/supplier/create", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    update: (supplierID: number, input: UpdateSupplierInput) =>
      request<ApiResponse<unknown>>(`/supplier/update/${supplierID}`, {
        method: "PATCH",
        body: JSON.stringify(input),
      }),
    delete: (supplierID: number) =>
      request<ApiResponse<unknown>>(`/supplier/delete/${supplierID}`, {
        method: "DELETE",
      }),
  },

  sales: {
    getAll: () => request<ApiResponse<Sale[]>>("/sale").then(unwrap),
    getByProduct: (productID: number) =>
      request<ApiResponse<Sale[]>>(`/sale/product/${productID}`).then(unwrap),
    record: (input: CreateSaleInput) =>
      request<ApiResponse<unknown>>("/sale/record", {
        method: "POST",
        body: JSON.stringify(input),
      }),
  },

  reports: {
    totalSales: () =>
      request<ApiResponse<TotalSalesReport[]>>("/report/totalSales").then(
        unwrap,
      ),
    highestStock: () =>
      request<ApiResponse<HighestStockReport[]>>("/report/highestStock").then(
        unwrap,
      ),
    suppliersStartingWithF: () =>
      request<ApiResponse<Supplier[]>>("/report/suppliersStarting-F").then(
        unwrap,
      ),
    neverSold: () =>
      request<ApiResponse<NeverSoldProduct[]>>("/report/neverSold").then(
        unwrap,
      ),
    sales: () =>
      request<ApiResponse<SalesReportRow[]>>("/report/sales").then(unwrap),
  },
}

export { ApiError }
