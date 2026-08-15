import { useCallback, useEffect, useState } from "react"
import { Loader2, Pencil, Plus, Trash2, Truck } from "lucide-react"
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
import type { CreateSupplierInput, Supplier } from "@/types"

type SupplierFormState = {
  supplierName: string
  contactNumber: string
}

const emptyForm: SupplierFormState = {
  supplierName: "",
  contactNumber: "",
}

export function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [form, setForm] = useState<SupplierFormState>(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  const loadSuppliers = useCallback(async () => {
    setLoading(true)

    try {
      const rows = await api.suppliers.getAll()
      setSuppliers(rows)
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to load suppliers"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadSuppliers()
  }, [loadSuppliers])

  const openCreateDialog = () => {
    setEditingSupplier(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEditDialog = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setForm({
      supplierName: supplier.supplierName,
      contactNumber: supplier.contactNumber,
    })
    setDialogOpen(true)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const payload: CreateSupplierInput = {
      supplierName: form.supplierName.trim(),
      contactNumber: form.contactNumber.trim(),
    }

    if (!payload.supplierName || !/^\d+$/.test(payload.contactNumber)) {
      toast.error("Enter a supplier name and numeric contact number.")
      return
    }

    setSubmitting(true)

    try {
      if (editingSupplier) {
        await api.suppliers.update(editingSupplier.supplierID, payload)
        toast.success("Supplier updated successfully.")
      } else {
        await api.suppliers.create(payload)
        toast.success("Supplier created successfully.")
      }

      setDialogOpen(false)
      await loadSuppliers()
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to save supplier"
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
      await api.suppliers.delete(deleteTarget.supplierID)
      toast.success("Supplier deleted successfully.")
      setDeleteTarget(null)
      await loadSuppliers()
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to delete supplier"
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
          {suppliers.length} suppliers
        </Badge>
        <Button onClick={openCreateDialog}>
          <Plus />
          Add supplier
        </Button>
      </PageToolbar>

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>Supplier directory</CardTitle>
          <CardDescription>
            Keep vendor contacts organized for product assignments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {suppliers.length === 0 ? (
            <EmptyState
              icon={Truck}
              title="No suppliers yet"
              description="Create your first supplier before adding products."
              action={
                <Button onClick={openCreateDialog}>
                  <Plus />
                  Add supplier
                </Button>
              }
            />
          ) : (
            <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead>Supplier</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((supplier) => (
                    <TableRow key={supplier.supplierID}>
                      <TableCell>
                        <div className="font-medium">{supplier.supplierName}</div>
                        <Badge variant="secondary" className="mt-1">
                          ID #{supplier.supplierID}
                        </Badge>
                      </TableCell>
                      <TableCell>{supplier.contactNumber}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => openEditDialog(supplier)}
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon-sm"
                            onClick={() => setDeleteTarget(supplier)}
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
              {editingSupplier ? "Edit supplier" : "Create supplier"}
            </DialogTitle>
            <DialogDescription>
              Supplier names must be at least 2 characters. Contact numbers must
              be numeric.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="supplierName">Supplier name</Label>
              <Input
                id="supplierName"
                value={form.supplierName}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    supplierName: event.target.value,
                  }))
                }
                placeholder="FreshFoods"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact number</Label>
              <Input
                id="contactNumber"
                value={form.contactNumber}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    contactNumber: event.target.value,
                  }))
                }
                placeholder="01001234567"
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
                ) : editingSupplier ? (
                  "Save changes"
                ) : (
                  "Create supplier"
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
            <AlertDialogTitle>Delete supplier</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove{" "}
              <strong>{deleteTarget?.supplierName}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={submitting}
              onClick={() => void handleDelete()}
            >
              Delete supplier
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageShell>
  )
}
