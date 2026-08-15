import type { LucideIcon } from "lucide-react"
import {
  BarChart3,
  Package,
  ShoppingCart,
  Truck,
} from "lucide-react"

export const ROUTES = {
  dashboard: "/dashboard",
  products: "/products",
  suppliers: "/suppliers",
  sales: "/sales",
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]

export type RouteMeta = {
  path: RoutePath
  label: string
  description: string
  icon: LucideIcon
}

export const routeMeta: RouteMeta[] = [
  {
    path: ROUTES.dashboard,
    label: "Dashboard",
    description: "Overview, reports, and key metrics at a glance.",
    icon: BarChart3,
  },
  {
    path: ROUTES.products,
    label: "Products",
    description: "Manage inventory, pricing, and stock levels.",
    icon: Package,
  },
  {
    path: ROUTES.suppliers,
    label: "Suppliers",
    description: "Maintain vendor contacts and supplier records.",
    icon: Truck,
  },
  {
    path: ROUTES.sales,
    label: "Sales",
    description: "Record transactions and review sales history.",
    icon: ShoppingCart,
  },
]

export function getRouteMeta(pathname: string): RouteMeta {
  const match = routeMeta.find((route) => route.path === pathname)

  return match ?? routeMeta[0]
}
