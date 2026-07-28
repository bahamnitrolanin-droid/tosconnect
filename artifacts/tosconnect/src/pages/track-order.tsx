import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Search, Loader2, Package, Clock, CheckCircle2, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useTrackOrder } from "@workspace/api-client-react"
import { OrderStatus } from "@workspace/api-client-react"

const formSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  email: z.string().email("Invalid email address"),
})

export default function TrackOrderPage() {
  const [result, setResult] = React.useState<OrderStatus | null>(null)
  const trackOrder = useTrackOrder()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderId: "",
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setResult(null)
      const res = await trackOrder.mutateAsync({
        id: values.orderId,
        data: { email: values.email }
      })
      setResult(res)
    } catch (error) {
      console.error("Failed to track order", error)
      form.setError("orderId", { type: "manual", message: "Order not found or email doesn't match" })
    }
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending': return { icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Awaiting Payment" }
      case 'paid': return { icon: Package, color: "text-blue-500", bg: "bg-blue-500/10", label: "Paid - Queueing" }
      case 'in_progress': return { icon: Loader2, color: "text-primary", bg: "bg-primary/10", label: "In Progress", spin: true }
      case 'delivered': return { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10", label: "Delivered" }
      case 'cancelled': return { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Cancelled" }
      default: return { icon: Clock, color: "text-muted-foreground", bg: "bg-muted", label: status }
    }
  }

  return (
    <div className="container max-w-2xl py-12 md:py-24 px-4 min-h-[70vh]">
      <div className="mb-12 text-center animate-in slide-in-from-bottom-4 duration-700 fade-in">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Track Order</h1>
        <p className="text-lg text-white/60">
          Enter your Order ID and email address to check the status of your project.
        </p>
      </div>

      <Card className="border-white/10 shadow-2xl mb-8">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="orderId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order ID</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., 12345-abc" {...field} disabled={trackOrder.isPending} />
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
                        <Input type="email" placeholder="Used during booking" {...field} disabled={trackOrder.isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full gap-2" disabled={trackOrder.isPending}>
                {trackOrder.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Track Project
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-white/10 animate-in fade-in slide-in-from-bottom-4 bg-card-border/20">
          <CardHeader>
            <CardTitle className="text-xl">Project Status</CardTitle>
            <CardDescription className="font-mono">{result.id}</CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const display = getStatusDisplay(result.status)
              const Icon = display.icon
              return (
                <div className={`p-6 rounded-lg border border-white/5 flex items-center gap-4 ${display.bg}`}>
                  <Icon className={`w-8 h-8 ${display.color} ${display.spin ? "animate-spin" : ""}`} />
                  <div>
                    <h3 className={`text-xl font-bold font-serif ${display.color}`}>{display.label}</h3>
                    <p className="text-white/60 text-sm mt-1">Last updated: {new Date(result.updatedAt || result.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              )
            })()}

            {result.notes && (
              <div className="mt-6 p-4 rounded-lg bg-black/40 border border-white/5">
                <p className="text-sm font-medium text-white/60 mb-1">Notes from Producer</p>
                <p className="text-white/90">{result.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
