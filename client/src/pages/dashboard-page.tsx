import { useCallback, useEffect, useState } from "react"
import { Package, RefreshCw, TrendingUp, Truck, Warehouse } from "lucide-react"
import { toast } from "sonner"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DataTable } from "@/components/layout/data-table"
import { DashboardSkeleton } from "@/components/layout/page-skeleton"
import { PageShell } from "@/components/layout/page-shell"
import { StatCard } from "@/components/layout/stat-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApiError, api } from "@/lib/api"
import { formatCurrency, formatDate, formatNumber } from "@/lib/format"
import type {
  HighestStockReport,
  NeverSoldProduct,
  SalesReportRow,
  Supplier,
  TotalSalesReport,
} from "@/types"

type DashboardData = {
  totalSales: TotalSalesReport[]
  highestStock: HighestStockReport[]
  suppliersF: Supplier[]
  neverSold: NeverSoldProduct[]
  salesReport: SalesReportRow[]
}

const emptyData: DashboardData = {
  totalSales: [],
  highestStock: [],
  suppliersF: [],
  neverSold: [],
  salesReport: [],
}

export function DashboardPage() {
  const [data, setData] = useState<DashboardData>(emptyData)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadReports = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    setError(null)

    try {
      const [
        totalSales,
        highestStock,
        suppliersF,
        neverSold,
        salesReport,
      ] = await Promise.all([
        api.reports.totalSales(),
        api.reports.highestStock(),
        api.reports.suppliersStartingWithF(),
        api.reports.neverSold(),
        api.reports.sales(),
      ])

      setData({
        totalSales,
        highestStock,
        suppliersF,
        neverSold,
        salesReport,
      })
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to load reports"
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    void loadReports()
  }, [loadReports])

  const topStock = data.highestStock[0]
  const totalUnitsSold = data.totalSales.reduce(
    (sum, row) => sum + Number(row.totalQuantitySold ?? 0),
    0,
  )

  if (loading) {
    return (
      <PageShell>
        <DashboardSkeleton />
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          disabled={refreshing}
          onClick={() => void loadReports(true)}
        >
          <RefreshCw className={refreshing ? "animate-spin" : undefined} />
          Refresh data
        </Button>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to load dashboard</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total units sold"
          value={formatNumber(totalUnitsSold)}
          description="Combined quantity sold across all products."
          icon={TrendingUp}
          tone="success"
        />
        <StatCard
          title="Top stocked item"
          value={topStock?.productName ?? "No products"}
          description={
            topStock
              ? `${formatNumber(topStock.stockQuantity)} units currently in stock`
              : "Add products to populate inventory metrics."
          }
          icon={Warehouse}
          tone="info"
        />
        <StatCard
          title="Suppliers (F)"
          value={formatNumber(data.suppliersF.length)}
          description="Vendors whose names begin with the letter F."
          icon={Truck}
        />
        <StatCard
          title="Never sold"
          value={formatNumber(data.neverSold.length)}
          description="Products with no recorded sales yet."
          icon={Package}
          tone="warning"
        />
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>
            Explore sales performance, inventory gaps, and supplier insights.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sales-by-product">
            <TabsList className="mb-4 h-auto flex-wrap">
              <TabsTrigger value="sales-by-product">Sales by product</TabsTrigger>
              <TabsTrigger value="sales-history">Sales history</TabsTrigger>
              <TabsTrigger value="never-sold">Never sold</TabsTrigger>
              <TabsTrigger value="suppliers-f">Suppliers (F)</TabsTrigger>
            </TabsList>

            <TabsContent value="sales-by-product">
              <DataTable
                rows={data.totalSales}
                emptyTitle="No sales data yet"
                emptyDescription="Record sales to see product performance here."
                columns={[
                  { key: "productName", header: "Product" },
                  {
                    key: "totalQuantitySold",
                    header: "Units sold",
                    className: "text-right",
                    render: (row) => (
                      <span className="font-medium">
                        {formatNumber(row.totalQuantitySold ?? 0)}
                      </span>
                    ),
                  },
                ]}
              />
            </TabsContent>

            <TabsContent value="sales-history">
              <DataTable
                rows={data.salesReport}
                emptyTitle="No sales recorded"
                emptyDescription="Sales transactions will appear in this report."
                columns={[
                  { key: "productName", header: "Product" },
                  {
                    key: "quantitySold",
                    header: "Quantity",
                    className: "text-right",
                    render: (row) => formatNumber(row.quantitySold),
                  },
                  {
                    key: "saleDate",
                    header: "Date",
                    render: (row) => formatDate(String(row.saleDate)),
                  },
                ]}
              />
            </TabsContent>

            <TabsContent value="never-sold">
              <DataTable
                rows={data.neverSold}
                emptyTitle="All products have sales"
                emptyDescription="Every product in inventory has at least one sale."
                getRowKey={(row) => row.productID}
                columns={[
                  { key: "productName", header: "Product" },
                  {
                    key: "price",
                    header: "Price",
                    render: (row) => formatCurrency(row.price),
                  },
                  {
                    key: "stockQuantity",
                    header: "Stock",
                    className: "text-right",
                    render: (row) => formatNumber(row.stockQuantity),
                  },
                ]}
              />
            </TabsContent>

            <TabsContent value="suppliers-f">
              <DataTable
                rows={data.suppliersF}
                emptyTitle="No matching suppliers"
                emptyDescription="No suppliers were found with names starting with F."
                getRowKey={(row) => row.supplierID}
                columns={[
                  { key: "supplierName", header: "Supplier" },
                  { key: "contactNumber", header: "Contact" },
                  {
                    key: "supplierID",
                    header: "ID",
                    render: (row) => (
                      <Badge variant="secondary">#{row.supplierID}</Badge>
                    ),
                  },
                ]}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </PageShell>
  )
}
