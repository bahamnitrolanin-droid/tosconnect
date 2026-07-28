/** Utility for persisting KHQR transaction data across page navigations via sessionStorage */

export interface PendingTransactionData {
  transactionId: string;
  qrImage: string;
  expiresAt: string;
  amountUsd: number;
  amountKhr: number;
  qrString?: string;
  serviceType: "order" | "booking";
}

const storageKey = (id: string) => `payway_txn_${id}`;

export function savePendingTransaction(data: PendingTransactionData): void {
  try {
    sessionStorage.setItem(storageKey(data.transactionId), JSON.stringify(data));
  } catch {
    // Ignore — sessionStorage may be unavailable in some contexts
  }
}

export function loadPendingTransaction(transactionId: string): PendingTransactionData | null {
  try {
    const raw = sessionStorage.getItem(storageKey(transactionId));
    return raw ? (JSON.parse(raw) as PendingTransactionData) : null;
  } catch {
    return null;
  }
}
