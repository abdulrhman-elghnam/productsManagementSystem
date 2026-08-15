import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Loader2, Package, Plus, ShoppingCart } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EmptyState } from "@/components/layout/empty-state"
import { PageShell, PageToolbar } from "@/components/layout/page-shell"
import { TablePageSkeleton } from "@/components/layout/page-skeleton"
import { ApiError, api } from "@/lib/api"
import { formatDate, formatNumber } from "@/lib/format"
import { ROUTES } from "@/routes/paths"
import type { CreateSaleInput, Product, Sale } from "@/types"

type SaleFormState = {
  productID: string
  quantitySold: string
}

const emptyForm: SaleFormState = {
  productID: "",
  quantitySold: "",
}

export function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState<SaleFormState>(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)

    try {
      const [saleRows, productRows] = await Promise.all([
        api.sales.getAll(),
        api.products.getAll(),
      ])

      setSales(saleRows)
      setProducts(productRows)
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to load sales"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const openCreateDialog = () => {
    setForm({
      productID: products[0] ? String(products[0].productID) : "",
      quantitySold: "",
    })
    setDialogOpen(true)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const payload: CreateSaleInput = {
      productID: Number(form.productID),
      quantitySold: Number(form.quantitySold),
    }

    if (
      !Number.isFinite(payload.productID) ||
      !Number.isFinite(payload.quantitySold) ||
      payload.quantitySold < 1
    ) {
      toast.error("Select a product and enter a valid quantity.")
      return
    }

    setSubmitting(true)

    try {
      await api.sales.record(payload)
      toast.success("Sale recorded successfully.")
      setDialogOpen(false)
      await loadData()
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to record sale"
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <PageShell>
        <TablePageSkeleton />
      </PageShell>
    )
  }

  return (
    <PageShell>
      <PageToolbar>
        <Badge variant="secondary" className="w-fit">
          {sales.length} transactions
        </Badge>
        <Button onClick={openCreateDialog} disabled={products.length === 0}>
          <Plus />
          Record sale
        </Button>
      </PageToolbar>

      {products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Add a product first"
          description="Sales require at least one product in your inventory."
          action={
            <Button render={<Link to={ROUTES.products} />}>
              Go to products
            </Button>
          }
        />
      ) : null}

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>Sales history</CardTitle>
          <CardDescription>
            Review recorded transactions and sale quantities over time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sales.length === 0 ? (
            <EmptyState
              icon={ShoppingCart}
              title="No sales recorded"
              description="Record your first sale to start building transaction history."
              action={
                <Button onClick={openCreateDialog}>
                  <Plus />
                  Record sale
                </Button>
              }
            />
          ) : (
            <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead>Sale</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow key={sale.saleID}>
                      <TableCell>
                        <Badge variant="secondary">#{sale.saleID}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {sale.productName ?? `Product #${sale.productID}`}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Product ID #{sale.productID}
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatNumber(sale.quantitySold)} units
                      </TableCell>
                      <TableCell>{formatDate(sale.saleDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record sale</DialogTitle>
            <DialogDescription>
              Choose a product and enter the quantity sold.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>Product</Label>
              <Select
                value={form.productID}
                onValueChange={(value) =>
                  setForm((current) => ({ ...current, productID: value ?? "" }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem
                      key={product.productID}
                      value={String(product.productID)}
                    >
                      {product.productName} ({formatNumber(product.stockQuantity)}{" "}
                      in stock)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantitySold">Quantity sold</Label>
              <Input
                id="quantitySold"
                type="number"
                min="1"
                step="1"
                value={form.quantitySold}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    quantitySold: event.target.value,
                  }))
                }
                placeholder="5"
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Record sale"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageShell>
  )
}
