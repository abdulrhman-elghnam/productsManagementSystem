import type { ReactNode } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EmptyState } from "@/components/layout/empty-state"
import { cn } from "@/lib/utils"
import { Inbox } from "lucide-react"

type DataTableColumn<T> = {
  key: keyof T
  header: string
  className?: string
  render?: (row: T) => ReactNode
}

type DataTableProps<T extends Record<string, unknown>> = {
  rows: T[]
  columns: DataTableColumn<T>[]
  emptyTitle?: string
  emptyDescription?: string
  getRowKey?: (row: T, index: number) => string | number
  className?: string
}

export function DataTable<T extends Record<string, unknown>>({
  rows,
  columns,
  emptyTitle = "No records yet",
  emptyDescription = "There is nothing to display in this table right now.",
  getRowKey,
  className,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title={emptyTitle}
        description={emptyDescription}
      />
    )
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm",
        className,
      )}
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            {columns.map((column) => (
              <TableHead key={String(column.key)} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={getRowKey?.(row, index) ?? index}>
              {columns.map((column) => (
                <TableCell key={String(column.key)} className={column.className}>
                  {column.render
                    ? column.render(row)
                    : String(row[column.key] ?? "")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
