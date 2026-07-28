import * as React from "react"
import { useParams, useLocation } from "wouter"
import { CheckCircle2, Music2, CalendarCheck, Mail, Home, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Step {
  text: string
}

function ConfirmedView({
  id,
  isBooking,
  onHome,
  onTrack,
}: {
  id: string
  isBooking: boolean
  onHome: () => void
  onTrack: () => void
}) {
  const steps: Step[] = isBooking
    ? [
        { text: "We'll confirm your time slot within 24 hours via email" },
        { text: "Your Zoom meeting link will arrive in the same email" },
        { text: "Prepare your goals — we'll make every minute count" },
      ]
    : [
        { text: "We'll review your stems within 1 business day" },
        { text: "Your mixed & mastered tracks are delivered in 3–5 business days" },
        { text: "We'll email you a download link when they're ready" },
      ]

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-2xl shadow-primary/5">
          <CardHeader className="text-center pt-12 pb-6">
            {/* Icon cluster */}
            <div className="relative mx-auto w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full bg-green-500/10 ring-8 ring-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-lg">
                {isBooking
                  ? <CalendarCheck className="w-4 h-4 text-background" />
                  : <Music2 className="w-4 h-4 text-background" />
                }
              </div>
            </div>

            <CardTitle className="text-3xl font-bold text-white mb-2">
              {isBooking ? "Consultation Confirmed!" : "Order Confirmed!"}
            </CardTitle>
            <p className="text-white/60 text-sm leading-relaxed">
              {isBooking
                ? "Your payment was received. We'll be in touch within 24 hours."
                : "Payment received. Your project is in the queue — sit back and let us work our magic."}
            </p>
          </CardHeader>

          <CardContent className="pb-12 space-y-6 px-8">
            {/* Reference ID */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-green-500/8 border border-green-500/15">
              <div>
                <p className="text-xs text-white/40 mb-0.5">Reference ID</p>
                <p className="font-mono text-white/90 text-sm">{id.slice(0, 8).toUpperCase()}…{id.slice(-4).toUpperCase()}</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
            </div>

            {/* Next steps */}
            <div>
              <p className="text-sm font-semibold text-white/80 mb-4">What happens next</p>
              <div className="space-y-4">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs font-bold">{i + 1}</span>
                    </div>
                    <p className="text-sm text-white/65 leading-relaxed">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dual-currency reminder */}
            <div className="p-3 rounded-lg bg-white/3 border border-white/8 text-xs text-white/40 flex items-start gap-2">
              <Mail className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-white/30" />
              A confirmation email has been sent to your inbox with full details and your payment receipt.
            </div>

            {/* CTAs */}
            <div className="flex gap-3 pt-2">
              <Button onClick={onHome} variant="outline" className="flex-1 gap-2">
                <Home className="w-4 h-4" />
                Home
              </Button>
              <Button onClick={onTrack} className="flex-1 gap-2">
                Track Status
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function OrderConfirmedPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const [, navigate] = useLocation()
  return (
    <ConfirmedView
      id={orderId ?? ""}
      isBooking={false}
      onHome={() => navigate("/")}
      onTrack={() => navigate("/track-order")}
    />
  )
}

export function BookingConfirmedPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const [, navigate] = useLocation()
  return (
    <ConfirmedView
      id={bookingId ?? ""}
      isBooking={true}
      onHome={() => navigate("/")}
      onTrack={() => navigate("/track-order")}
    />
  )
}
