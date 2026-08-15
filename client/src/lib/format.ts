export function formatCurrency(value: number | string) {
  const amount = typeof value === "string" ? Number(value) : value

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0)
}

export function formatDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

export function formatNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined) {
    return "0"
  }

  const amount = typeof value === "string" ? Number(value) : value

  return new Intl.NumberFormat().format(Number.isFinite(amount) ? amount : 0)
}
