import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Loader2, Package, Pencil, Plus, Trash2, Truck } from "lucide-react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
import { formatCurrency, formatNumber } from "@/lib/format"
import { ROUTES } from "@/routes/paths"
import type { CreateProductInput, Product, Supplier } from "@/types"

type ProductFormState = {
  productName: string
  price: string
  stockQuantity: string
  supplierID: string
}

const emptyForm: ProductFormState = {
  productName: "",
  price: "",
  stockQuantity: "",
  supplierID: "",
}

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form, setForm] = useState<ProductFormState>(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)

    try {
      const [productRows, supplierRows] = await Promise.all([
        api.products.getAll(),
        api.suppliers.getAll(),
      ])

      setProducts(productRows)
      setSuppliers(supplierRows)
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to load products"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const supplierNameById = (supplierID: number) =>
    suppliers.find((supplier) => supplier.supplierID === supplierID)
      ?.supplierName ?? `Supplier #${supplierID}`

  const openCreateDialog = () => {
    setEditingProduct(null)
    setForm({
      ...emptyForm,
      supplierID: suppliers[0] ? String(suppliers[0].supplierID) : "",
    })
    setDialogOpen(true)
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setForm({
      productName: product.productName,
      price: String(product.price),
      stockQuantity: String(product.stockQuantity),
      supplierID: String(product.supplierID),
    })
    setDialogOpen(true)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const payload: CreateProductInput = {
      productName: form.productName.trim(),
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
      supplierID: Number(form.supplierID),
    }

    if (
      !payload.productName ||
      !Number.isFinite(payload.price) ||
      !Number.isFinite(payload.stockQuantity) ||
      !Number.isFinite(payload.supplierID)
    ) {
      toast.error("Please fill in all product fields with valid values.")
      return
    }

    setSubmitting(true)

    try {
      if (editingProduct) {
        await api.products.update(editingProduct.productID, payload)
        toast.success("Product updated successfully.")
      } else {
        await api.products.create(payload)
        toast.success("Product created successfully.")
      }

      setDialogOpen(false)
      await loadData()
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to save product"
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }

    setSubmitting(true)

    try {
      await api.products.delete(deleteTarget.productID)
      toast.success("Product deleted successfully.")
      setDeleteTarget(null)
      await loadData()
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to delete product"
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
          {products.length} products
        </Badge>
        <Button onClick={openCreateDialog} disabled={suppliers.length === 0}>
          <Plus />
          Add product
        </Button>
      </PageToolbar>

      {suppliers.length === 0 ? (
        <EmptyState
          icon={Truck}
          title="Add a supplier first"
          description="Products must be linked to an existing supplier before they can be created."
          action={
            <Button render={<Link to={ROUTES.suppliers} />}>
              Go to suppliers
            </Button>
          }
        />
      ) : null}

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>Product inventory</CardTitle>
          <CardDescription>
            Track pricing, stock levels, and supplier assignments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No products yet"
              description="Create your first product to start managing inventory."
              action={
                <Button onClick={openCreateDialog}>
                  <Plus />
                  Add product
                </Button>
              }
            />
          ) : (
            <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.productID}>
                      <TableCell>
                        <div className="font-medium">{product.productName}</div>
                        <div className="text-xs text-muted-foreground">
                          ID #{product.productID}
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(product.price)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {formatNumber(product.stockQuantity)} units
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {supplierNameById(product.supplierID)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => openEditDialog(product)}
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon-sm"
                            onClick={() => setDeleteTarget(product)}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </TableCell>
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
            <DialogTitle>
              {editingProduct ? "Edit product" : "Create product"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? "Update product details and supplier assignment."
                : "Add a new product to the inventory."}
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="productName">Product name</Label>
              <Input
                id="productName"
                value={form.productName}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    productName: event.target.value,
                  }))
                }
                placeholder="Milk"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      price: event.target.value,
                    }))
                  }
                  placeholder="15.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stockQuantity">Stock quantity</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stockQuantity}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      stockQuantity: event.target.value,
                    }))
                  }
                  placeholder="50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Supplier</Label>
              <Select
                value={form.supplierID}
                onValueChange={(value) =>
                  setForm((current) => ({ ...current, supplierID: value ?? "" }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem
                      key={supplier.supplierID}
                      value={String(supplier.supplierID)}
                    >
                      {supplier.supplierName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                ) : editingProduct ? (
                  "Save changes"
                ) : (
                  "Create product"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove{" "}
              <strong>{deleteTarget?.productName}</strong> from the inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={submitting}
              onClick={() => void handleDelete()}
            >
              Delete product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageShell>
  )
}
