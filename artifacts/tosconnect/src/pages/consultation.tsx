import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Video, CheckCircle2, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useCreateBooking } from "@workspace/api-client-react"
import { Badge } from "@/components/ui/badge"

const timeSlots = [
  { id: "weekday-morning", label: "Weekday Morning (9AM - 12PM)" },
  { id: "weekday-afternoon", label: "Weekday Afternoon (1PM - 5PM)" },
  { id: "weekend-morning", label: "Weekend Morning (10AM - 1PM)" },
  { id: "weekend-evening", label: "Weekend Evening (6PM - 9PM)" },
]

const formSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  sessionTopic: z.string().min(10, "Please describe what you want to cover"),
  preferredTimes: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one time slot.",
  }),
})

export default function ConsultationPage() {
  const [bookingId, setBookingId] = React.useState<string | null>(null)
  const createBooking = useCreateBooking()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      email: "",
      sessionTopic: "",
      preferredTimes: [],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const booking = await createBooking.mutateAsync({
        data: {
          customerName: values.customerName,
          email: values.email,
          sessionTopic: values.sessionTopic,
          preferredTimes: values.preferredTimes,
          amountUsd: 40,
          amountKhr: 164000
        }
      })
      setBookingId(booking.id)
    } catch (error) {
      console.error("Failed to submit booking", error)
    }
  }

  if (bookingId) {
    return (
      <div className="container max-w-2xl py-24 px-4">
        <Card className="border-primary/50 text-center animate-in zoom-in duration-500">
          <CardHeader className="pt-12">
            <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-blue-500" />
            </div>
            <CardTitle className="text-3xl text-white">Booking Requested</CardTitle>
            <CardDescription className="text-lg">Booking ID: <span className="font-mono text-blue-400">{bookingId}</span></CardDescription>
          </CardHeader>
          <CardContent className="pb-12 space-y-4">
            <p className="text-white/80">
              We've received your consultation request. We will review your preferred times and reach out shortly.
            </p>
            <div className="p-6 bg-card-border/50 rounded-lg border border-white/10 max-w-md mx-auto">
              <p className="font-medium text-white mb-2">Next Steps:</p>
              <p className="text-white/60 text-sm">
                Payment instructions and the Zoom meeting link will be emailed to you within 24 hours.
              </p>
              <p className="text-white/40 text-xs mt-4">
                All payments processed securely via ABA PayWay KHQR.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-12 md:py-24 px-4">
      <div className="mb-12 text-center animate-in slide-in-from-bottom-4 duration-700 fade-in">
        <Badge className="mb-4 border-white/20" variant="outline">1-on-1 Session</Badge>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Virtual Consultation</h1>
        <p className="text-lg text-white/60 max-w-2xl mx-auto">
          A focused 1-hour Zoom session to tackle your production hurdles, refine your distribution strategy, or break through a songwriting block.
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_400px] gap-8">
        <div>
          <Card className="border-white/10 shadow-2xl">
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
              <CardDescription>Tell us what you want to achieve.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Sok San" {...field} disabled={createBooking.isPending} />
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
                            <Input type="email" placeholder="sok@example.com" {...field} disabled={createBooking.isPending} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="sessionTopic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What do you want to cover?</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="E.g., I'm struggling to get my kick and bass to sit right in the mix..." 
                            className="h-32"
                            disabled={createBooking.isPending}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferredTimes"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Preferred Time Windows</FormLabel>
                          <FormDescription>
                            Select all that generally work for you. We will coordinate exact times via email.
                          </FormDescription>
                        </div>
                        <div className="space-y-3">
                          {timeSlots.map((slot) => (
                            <FormField
                              key={slot.id}
                              control={form.control}
                              name="preferredTimes"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={slot.id}
                                    className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-white/10 p-4 hover:bg-card-border/50 transition-colors cursor-pointer"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(slot.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, slot.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== slot.id
                                                )
                                              )
                                        }}
                                        disabled={createBooking.isPending}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer text-white/80">
                                      {slot.label}
                                    </FormLabel>
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

                  <Button type="submit" size="lg" className="w-full font-serif text-lg h-14" disabled={createBooking.isPending}>
                    {createBooking.isPending ? "Submitting..." : "Request Booking"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-white/60 text-sm font-medium mb-1">Session Rate</p>
                  <div className="text-4xl font-bold font-mono text-white tracking-tighter">$40</div>
                </div>
                <div className="text-right">
                  <div className="text-lg text-white/70 font-mono">164,000 ៛</div>
                </div>
              </div>
              <div className="h-px w-full bg-white/10 mb-6" />
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Video className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-white/80">1 hour via Zoom/Google Meet</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-white/80">Production technique review</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-white/80">Release strategy advice</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="p-4 border border-white/5 rounded-lg bg-card/50 flex gap-3 items-start">
            <ShieldCheck className="w-5 h-5 text-white/40 shrink-0" />
            <p className="text-xs text-white/50 leading-relaxed">
              All payments are processed securely via ABA PayWay KHQR. We do not store any sensitive payment data on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
