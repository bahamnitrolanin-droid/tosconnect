import * as React from "react"
import { useParams, useLocation } from "wouter"
import { useGetTransactionStatus, useRetryTransaction, getGetTransactionStatusQueryKey } from "@workspace/api-client-react"
import {
  Clock, CheckCircle2, AlertCircle, Smartphone,
  RefreshCcw, ArrowLeft, QrCode, Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { loadPendingTransaction, savePendingTransaction, type PendingTransactionData } from "@/lib/payway"

// Countdown hook
function useCountdown(expiresAt: string | undefined) {
  const [remaining, setRemaining] = React.useState(0)
  React.useEffect(() => {
    if (!expiresAt) return
    const expiry = new Date(expiresAt).getTime()
    const tick = () => setRemaining(Math.max(0, expiry - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [expiresAt])
  return {
    minutes: Math.floor(remaining / 60000),
    seconds: Math.floor((remaining % 60000) / 1000),
    expired: remaining === 0 && !!expiresAt,
  }
}

export default function CheckoutPage() {
  const { transactionId: initialId = "" } = useParams<{ transactionId: string }>()
  const [, navigate] = useLocation()

  const [activeId, setActiveId] = React.useState(initialId)
  const [activeTxnData, setActiveTxnData] = React.useState<PendingTransactionData | null>(null)
  const [localStatus, setLocalStatus] = React.useState<"pending" | "paid" | "expired" | "failed">("pending")
  const [retryError, setRetryError] = React.useState("")

  // Load from sessionStorage on mount and on activeId change
  React.useEffect(() => {
    setActiveTxnData(loadPendingTransaction(activeId))
  }, [activeId])

  const retryTransaction = useRetryTransaction()

  const { data: statusData } = useGetTransactionStatus(activeId, {
    query: {
      queryKey: getGetTransactionStatusQueryKey(activeId),
      refetchInterval: localStatus === "pending" ? 3000 : false,
      enabled: !!activeId && localStatus === "pending",
    },
  })

  const { minutes, seconds, expired: countdownExpired } = useCountdown(activeTxnData?.expiresAt)

  // Watch status from server
  React.useEffect(() => {
    if (!statusData) return
    if (statusData.status === "paid") {
      setLocalStatus("paid")
      const dest = statusData.orderId
        ? `/order-confirmed/order/${statusData.orderId}`
        : `/order-confirmed/booking/${statusData.bookingId}`
      setTimeout(() => navigate(dest), 1800)
    } else if (statusData.status === "expired" || statusData.status === "failed") {
      setLocalStatus(statusData.status as "expired" | "failed")
    }
  }, [statusData, navigate])

  // Countdown expiry
  React.useEffect(() => {
    if (countdownExpired && localStatus === "pending") {
      setLocalStatus("expired")
    }
  }, [countdownExpired, localStatus])

  async function handleRetry() {
    setRetryError("")
    try {
      const result = await retryTransaction.mutateAsync({ transactionId: activeId })
      const newTxn: PendingTransactionData = {
        transactionId: result.transactionId,
        qrImage: result.qrImage,
        expiresAt: result.expiresAt,
        amountUsd: result.amountUsd,
        amountKhr: result.amountKhr,
        serviceType: activeTxnData?.serviceType ?? "order",
      }
      savePendingTransaction(newTxn)
      setActiveId(result.transactionId)
      setLocalStatus("pending")
    } catch {
      setRetryError("Could not generate a new QR. Please refresh and try again.")
    }
  }

  if (!activeTxnData) {
    return (
      <div className="container max-w-xl py-24 px-4 text-center">
        <AlertCircle className="mx-auto w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Session not found</h2>
        <p className="text-white/60 mb-6">
          This payment session has expired or was opened in a new tab.
          Please use the <a href="/track-order" className="text-primary underline">order tracker</a> to check your payment status.
        </p>
        <Button onClick={() => navigate("/")} variant="outline">Return Home</Button>
      </div>
    )
  }

  const isPaid = localStatus === "paid"
  const isExpiredOrFailed = localStatus === "expired" || localStatus === "failed"
  const isPending = localStatus === "pending"
  const isUrgent = isPending && minutes < 3 && !countdownExpired
  const abaDeepLink = activeTxnData.qrString
    ? `aba://payment?qr=${encodeURIComponent(activeTxnData.qrString)}`
    : null

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="container max-w-2xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Home
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary text-sm px-4 py-1.5 rounded-full mb-4">
            <QrCode className="w-4 h-4" />
            Secure Payment · ABA PayWay KHQR
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Complete Your Payment</h1>
          <p className="text-white/50 text-sm">
            Scan the QR code below with ABA Mobile or any KHQR-enabled app
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_260px] items-start">

          {/* QR Card */}
          <Card className="border-white/10 bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-3 flex-row items-center justify-between">
              <CardTitle className="text-white text-base">KHQR Code</CardTitle>
              {isPending && (
                <div className={`flex items-center gap-1.5 text-sm font-mono tabular-nums transition-colors ${
                  countdownExpired ? "text-red-400" : isUrgent ? "text-orange-400" : "text-primary"
                }`}>
                  <Clock className="w-3.5 h-3.5" />
                  {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </div>
              )}
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-5">

              {/* QR image */}
              <div className={`relative p-3 bg-white rounded-2xl shadow-xl transition-all duration-500 ${
                isPaid ? "ring-4 ring-green-500 scale-105" :
                isExpiredOrFailed ? "opacity-40 grayscale" : ""
              }`}>
                <img
                  src={activeTxnData.qrImage}
                  alt="KHQR payment QR code"
                  className="w-52 h-52 object-contain"
                  draggable={false}
                />
                {isPaid && (
                  <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-2xl backdrop-blur-sm">
                    <CheckCircle2 className="w-20 h-20 text-green-500 drop-shadow-2xl" />
                  </div>
                )}
                {isExpiredOrFailed && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl">
                    <div className="text-center">
                      <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-1.5" />
                      <p className="text-white text-xs font-semibold uppercase tracking-wide">Expired</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Status messages */}
              {isPaid && (
                <div className="text-center animate-in fade-in zoom-in duration-500 space-y-1">
                  <p className="text-green-400 font-semibold text-lg">Payment Confirmed ✓</p>
                  <p className="text-white/50 text-sm flex items-center gap-1.5 justify-center">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Redirecting…
                  </p>
                </div>
              )}

              {isPending && (
                <div className="flex items-center gap-2 text-white/50 text-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  Waiting for payment confirmation…
                </div>
              )}

              {isExpiredOrFailed && (
                <div className="text-center space-y-3 w-full">
                  <p className="text-red-400 text-sm">
                    {localStatus === "expired" ? "This QR code has expired." : "Payment was cancelled."}
                  </p>
                  {retryError && <p className="text-red-400 text-xs">{retryError}</p>}
                  <Button
                    onClick={handleRetry}
                    disabled={retryTransaction.isPending}
                    className="gap-2 w-full"
                  >
                    {retryTransaction.isPending
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
                      : <><RefreshCcw className="w-4 h-4" /> Generate New QR</>
                    }
                  </Button>
                </div>
              )}

              {/* ABA Mobile deep link */}
              {isPending && abaDeepLink && (
                <a
                  href={abaDeepLink}
                  className="flex items-center gap-2 text-sm text-primary/80 border border-primary/20 hover:border-primary/50 rounded-lg px-5 py-2.5 hover:bg-primary/5 transition-all"
                >
                  <Smartphone className="w-4 h-4" />
                  Open in ABA Mobile
                </a>
              )}
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Order summary */}
            <Card className="border-white/10 bg-card/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white/70">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Service</span>
                  <span className="text-white font-medium">
                    {activeTxnData.serviceType === "booking" ? "Consultation" : "Mixing & Mastering"}
                  </span>
                </div>
                <div className="border-t border-white/10 pt-3 space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-white/70">Total (USD)</span>
                    <span className="text-primary">${activeTxnData.amountUsd.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/40 text-xs">
                    <span>KHR equivalent</span>
                    <span>{activeTxnData.amountKhr.toLocaleString()} ៛</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="border-white/10 bg-card/60">
              <CardContent className="pt-4">
                <p className="text-sm font-medium text-white/70 mb-3">How to pay</p>
                <ol className="space-y-2 text-xs text-white/50 list-none">
                  {[
                    "Open ABA Mobile or any KHQR app",
                    'Tap "Scan" or "Pay"',
                    "Point camera at the QR code",
                    "Confirm amount and tap Pay",
                  ].map((step, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-primary/70 font-bold tabular-nums">{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
                <p className="text-white/30 text-xs mt-4 pt-3 border-t border-white/10">
                  Works with ABA Mobile, Wing, Pi Pay, and all KHQR-enabled banks
                </p>
              </CardContent>
            </Card>

            <p className="text-white/20 text-xs text-center font-mono">
              Ref: {activeId.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Fallback note */}
        {isPending && (
          <div className="mt-8 text-center">
            <p className="text-white/30 text-xs">
              Paid but page hasn't updated?{" "}
              <button onClick={() => window.location.reload()} className="text-primary/70 underline underline-offset-2">
                Refresh
              </button>{" "}
              or{" "}
              <a href="/track-order" className="text-primary/70 underline underline-offset-2">
                track your order
              </a>.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
