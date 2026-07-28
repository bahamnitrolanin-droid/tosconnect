import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Video, CheckCircle2, ShieldCheck,
  Loader2, ArrowRight, AlertCircle, Calendar,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useCreateBooking, useCreateTransaction } from "@workspace/api-client-react"
import { useLocation } from "wouter"
import { savePendingTransaction } from "@/lib/payway"

const TIME_SLOTS = [
  { id: "weekday-morning",   label: "Weekday Morning",   sub: "9 AM – 12 PM" },
  { id: "weekday-afternoon", label: "Weekday Afternoon",  sub: "1 PM – 5 PM" },
  { id: "weekend-morning",   label: "Weekend Morning",    sub: "10 AM – 1 PM" },
  { id: "weekend-evening",   label: "Weekend Evening",    sub: "6 PM – 9 PM" },
]

const formSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  sessionTopic: z.string().min(10, "Please describe what you want to cover (at least 10 characters)"),
  preferredTimes: z.array(z.string()).min(1, "Select at least one time slot"),
})

const PRICE_USD = 20
const PRICE_KHR = "82,000"

export default function ConsultationPage() {
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [, navigate] = useLocation()

  const createBooking = useCreateBooking()
  const createTransaction = useCreateTransaction()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { customerName: "", email: "", sessionTopic: "", preferredTimes: [] },
  })

  const isLoading = createBooking.isPending || createTransaction.isPending

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitError(null)
    try {
      const booking = await createBooking.mutateAsync({
        data: {
          customerName: values.customerName,
          email: values.email,
          sessionTopic: values.sessionTopic,
          preferredTimes: values.preferredTimes,
          amountUsd: PRICE_USD,
          amountKhr: 82000,
        },
      })
      const txn = await createTransaction.mutateAsync({ data: { bookingId: booking.id } })
      savePendingTransaction({
        transactionId: txn.transactionId,
        qrImage: txn.qrImage,
        expiresAt: txn.expiresAt,
        amountUsd: txn.amountUsd,
        amountKhr: txn.amountKhr,
        serviceType: "booking",
      })
      navigate(`/checkout/${txn.transactionId}`)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong. Please try again.")
    }
  }

  return (
    <div className="min-h-screen">
      {/* ── Page Hero ── */}
      <div className="border-b border-white/5 bg-card/20 py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center animate-in slide-in-from-bottom-4 duration-700 fade-in">
          <Badge className="mb-4 px-4 py-1.5 text-xs tracking-widest uppercase" variant="outline">
            1-on-1 Session
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-4 leading-tight">
            Virtual Consultation
          </h1>
          <p className="text-base sm:text-lg text-white/60 max-w-xl mx-auto leading-relaxed">
            A focused 1-hour Zoom session to tackle your production hurdles, refine your distribution strategy, or break through a songwriting block.
          </p>
        </div>
      </div>

      {/* ── Form + Sidebar ── */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">

          {/* ── Sidebar: price first on mobile ── */}
          <aside className="order-first lg:order-last space-y-5">
            <Card className="border-primary/30 bg-primary/5 sticky top-24">
              <CardContent className="p-6 space-y-5">
                <div>
                  <p className="text-white/50 text-xs font-medium uppercase tracking-widest mb-1">Session Rate</p>
                  <div className="flex items-end gap-3">
                    <span className="text-5xl font-bold font-mono text-white leading-none">${PRICE_USD}</span>
                    <span className="text-white/40 text-sm mb-1">USD</span>
                  </div>
                  <p className="text-white/40 font-mono text-sm mt-1">{PRICE_KHR} ៛ KHR</p>
                </div>
                <div className="h-px bg-white/10" />
                <ul className="space-y-3">
                  {[
                    { icon: Video, text: "60 minutes via Zoom / Google Meet" },
                    { icon: CheckCircle2, text: "Production technique review" },
                    { icon: CheckCircle2, text: "Release & distribution strategy" },
                    { icon: CheckCircle2, text: "Songwriting & arrangement advice" },
                    { icon: Calendar, text: "Zoom link sent within 24 hours" },
                  ].map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-start gap-3">
                      <Icon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-white/75">{text}</span>
                    </li>
                  ))}
                </ul>
                <div className="h-px bg-white/10" />
                <div className="flex gap-2 items-start">
                  <ShieldCheck className="w-4 h-4 text-white/30 shrink-0 mt-0.5" />
                  <p className="text-xs text-white/40 leading-relaxed">
                    Secure payment via ABA PayWay KHQR. We never store your banking credentials.
                  </p>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* ── Form ── */}
          <div className="order-last lg:order-first">
            <Card className="border-white/10">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl sm:text-2xl">Book Your Session</CardTitle>
                <CardDescription className="text-white/50">
                  Tell us what you'd like to cover and pick your preferred time slots.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Error banner */}
                {submitError && (
                  <div className="flex items-start gap-3 p-4 mb-6 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm leading-relaxed">{submitError}</p>
                  </div>
                )}

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name + Email */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="customerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Sok San" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Session Topic */}
                    <FormField
                      control={form.control}
                      name="sessionTopic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What do you want to cover?</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g. I want to improve my mix bus chain, understand mastering for Spotify, and discuss my upcoming EP release strategy..."
                              className="min-h-[120px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Time Slots */}
                    <FormField
                      control={form.control}
                      name="preferredTimes"
                      render={() => (
                        <FormItem>
                          <FormLabel>Preferred Time Slots</FormLabel>
                          <p className="text-xs text-white/40 mb-3">
                            Select all that work for you — we'll confirm the exact time.
                          </p>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {TIME_SLOTS.map((slot) => (
                              <FormField
                                key={slot.id}
                                control={form.control}
                                name="preferredTimes"
                                render={({ field }) => {
                                  const checked = field.value?.includes(slot.id)
                                  return (
                                    <FormItem key={slot.id}>
                                      <FormControl>
                                        <label
                                          className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all select-none
                                            ${checked
                                              ? "border-primary/50 bg-primary/10"
                                              : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/5"
                                            }`}
                                        >
                                          <Checkbox
                                            checked={checked}
                                            className="mt-0.5 shrink-0"
                                            onCheckedChange={(c) => {
                                              const cur = field.value ?? []
                                              field.onChange(
                                                c ? [...cur, slot.id] : cur.filter((v) => v !== slot.id)
                                              )
                                            }}
                                          />
                                          <div>
                                            <p className="text-sm font-medium text-white/85">{slot.label}</p>
                                            <p className="text-xs text-white/40">{slot.sub}</p>
                                          </div>
                                        </label>
                                      </FormControl>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-13 font-serif text-base gap-2 group"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {createBooking.isPending ? "Creating booking…" : "Creating payment…"}
                        </>
                      ) : (
                        <>
                          Continue to Payment — ${PRICE_USD} USD
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}
