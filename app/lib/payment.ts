export function calculateDeposit(totalPrice: number, percentage: number = 30): number {
  return Math.round(totalPrice * (percentage / 100))
}

export function calculateRemaining(totalPrice: number, depositPaid: number): number {
  return totalPrice - depositPaid
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}
