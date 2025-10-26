export type PaymentMethod = 'CASH' | 'CARD' | 'TRANSFER'
export type UserRole = 'OWNER' | 'ADMIN' | 'CASHIER'

export interface ProductDto {
  id?: number
  name: string
  sku: string
  description?: string
  costPrice: number
  sellingPrice: number
  quantity: number
  categoryId: number
}

export interface CategoryDto {
  id?: number
  name: string
  description?: string
}

export interface PaymentDto {
  amount: number
  method: PaymentMethod
}

export interface SaleItemDto {
  productId: number
  quantity: number
}

export interface SaleRequestDto {
  customerId?: number
  discount?: number
  items: SaleItemDto[]
  payments: PaymentDto[]
}

export interface PaymentResponseDto {
  id: number
  paymentDate: string
  amount: number
  method: PaymentMethod
}

export interface ProductResponseDto {
  id: number
  name: string
  sku: string
  sellingPrice: number
  categoryName: string
}

export interface SaleItemResponseDto {
  id: number
  product: ProductResponseDto
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface UserResponseDto {
  id: number
  username: string
  email: string
  role: string
}

export interface SaleResponseDto {
  id: number
  invoiceNumber: string
  saleDate: string
  totalAmount: number
  discount: number
  netAmount: number
  user: UserResponseDto
  saleItems: SaleItemResponseDto[]
  payments: PaymentResponseDto[]
}

export interface RegisterRequest {
  username: string
  password?: string
  email: string
  role: UserRole
}

export interface JwtAuthResponse {
  token: string
  username: string
  role: string
}

export interface LoginRequest {
  username: string
  password?: string
}

export interface MonthlySalesReport {
  month: string
  year: number
  monthOfYear: number
  totalSalesCount: number
  totalItemsSold: number
  totalDiscount: number
  totalRevenue: number
  netRevenue: number
}

export interface DailySalesSummaryDto {
  saleDate: string
  totalAmount: number
  totalSales: number
}

export interface CustomerReportDto {
  customerId: number
  customerName: string
  totalSales: number
  totalAmount: number
}

export interface CategoryReportDto {
  categoryName: string
  totalQuantitySold: number
  totalAmount: number
}
