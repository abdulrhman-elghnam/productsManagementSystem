import { createBrowserRouter, Navigate } from "react-router-dom"

import { AppLayout } from "@/components/layout/app-layout"
import { DashboardPage } from "@/pages/dashboard-page"
import { NotFoundPage } from "@/pages/not-found-page"
import { ProductsPage } from "@/pages/products-page"
import { SalesPage } from "@/pages/sales-page"
import { SuppliersPage } from "@/pages/suppliers-page"
import { ROUTES } from "@/routes/paths"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.dashboard} replace />,
      },
      {
        path: ROUTES.dashboard.slice(1),
        element: <DashboardPage />,
      },
      {
        path: ROUTES.products.slice(1),
        element: <ProductsPage />,
      },
      {
        path: ROUTES.suppliers.slice(1),
        element: <SuppliersPage />,
      },
      {
        path: ROUTES.sales.slice(1),
        element: <SalesPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
])
