import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { UploadCloud, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
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
import { useCreateOrder, useRequestUploadUrl } from "@workspace/api-client-react"
import { Badge } from "@/components/ui/badge"

const MAX_FILE_SIZE = 200 * 1024 * 1024 // 200MB
const ACCEPTED_FILE_TYPES = ["audio/wav", "audio/mpeg", "audio/mp3", "application/zip", "application/x-zip-compressed"]

const formSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  details: z.string().min(10, "Please provide some details about your project"),
  files: z.any().refine((files) => files?.length > 0, "At least one file is required")
})

export default function MixingMasteringPage() {
  const [uploadProgress, setUploadProgress] = React.useState<number>(0)
  const [isUploading, setIsUploading] = React.useState(false)
  const [orderId, setOrderId] = React.useState<string | null>(null)
  
  const createOrder = useCreateOrder()
  const requestUploadUrl = useRequestUploadUrl()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      email: "",
      details: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsUploading(true)
      const fileList = Array.from(values.files as FileList)
      const objectPaths: string[] = []

      // Validate files before requesting any presigned URLs
      for (const file of fileList) {
        if (file.size > MAX_FILE_SIZE) {
          throw new Error(`"${file.name}" exceeds the 200 MB limit (${(file.size / 1024 / 1024).toFixed(1)} MB). Please compress or split your stems.`)
        }
        if (!ACCEPTED_FILE_TYPES.includes(file.type) && !file.name.match(/\.(wav|mp3|zip)$/i)) {
          throw new Error(`"${file.name}" is not a supported format. Please upload WAV, MP3, or ZIP files.`)
        }
      }

      // Upload each file
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i]
        
        // 1. Get presigned URL
        const { uploadURL, objectPath } = await requestUploadUrl.mutateAsync({
          data: {
            name: file.name,
            size: file.size,
            contentType: file.type || "application/octet-stream"
          }
        })

        // 2. Upload directly to GCS — fail fast on non-2xx
        const uploadRes = await fetch(uploadURL, {
          method: "PUT",
          headers: {
            "Content-Type": file.type || "application/octet-stream"
          },
          body: file
        })
        if (!uploadRes.ok) {
          throw new Error(`File upload failed for "${file.name}" (HTTP ${uploadRes.status}). Please try again.`)
        }

        objectPaths.push(objectPath)
        setUploadProgress(Math.round(((i + 1) / fileList.length) * 100))
      }

      // 3. Create Order
      const order = await createOrder.mutateAsync({
        data: {
          customerName: values.customerName,
          email: values.email,
          details: values.details,
          stemsUrls: objectPaths,
          amountUsd: 80,
          amountKhr: 328000
        }
      })

      setOrderId(order.id)
    } catch (error) {
      console.error("Failed to submit order", error)
      // We would normally show a toast here
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  if (orderId) {
    return (
      <div className="container max-w-2xl py-24 px-4">
        <Card className="border-primary/50 text-center animate-in zoom-in duration-500">
          <CardHeader className="pt-12">
            <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl text-white">Order Confirmed</CardTitle>
            <CardDescription className="text-lg">Order ID: <span className="font-mono text-primary">{orderId}</span></CardDescription>
          </CardHeader>
          <CardContent className="pb-12 space-y-4">
            <p className="text-white/80">
              Thank you for trusting TosConnect with your music. 
              Your files have been securely uploaded.
            </p>
            <div className="p-6 bg-card-border/50 rounded-lg border border-white/10 max-w-md mx-auto">
              <p className="font-medium text-white mb-2">Next Steps:</p>
              <p className="text-white/60 text-sm">
                Payment instructions will arrive at your email shortly. 
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
        <Badge className="mb-4">Professional Service</Badge>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Mixing & Mastering</h1>
        <p className="text-lg text-white/60 max-w-2xl mx-auto">
          Send us your stems. Get back a radio-ready track. Industry-standard loudness, precise EQ, and vocal tuning crafted for the modern creator.
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_400px] gap-8">
        <div>
          <Card className="border-white/10 shadow-2xl">
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Fill out the form below to start your order.</CardDescription>
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
                            <Input placeholder="Sok San" {...field} disabled={isUploading} />
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
                            <Input type="email" placeholder="sok@example.com" {...field} disabled={isUploading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="details"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Notes & References</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about the vibe. Link 1-2 reference tracks..." 
                            className="h-32"
                            disabled={isUploading}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="files"
                    render={({ field: { onChange, value, ...rest } }) => (
                      <FormItem>
                        <FormLabel>Upload Stems (WAV/MP3)</FormLabel>
                        <FormControl>
                          <div className="border-2 border-dashed border-white/20 rounded-lg p-6 flex flex-col items-center justify-center bg-card-border/30 hover:bg-card-border/50 transition-colors group relative">
                            <input
                              type="file"
                              multiple
                              accept=".wav,.mp3,audio/wav,audio/mpeg,application/zip"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                              onChange={(e) => onChange(e.target.files)}
                              disabled={isUploading}
                              {...rest}
                            />
                            <UploadCloud className="w-10 h-10 text-white/40 group-hover:text-primary transition-colors mb-2" />
                            <p className="text-sm font-medium text-white/80">Click or drag stems here</p>
                            <p className="text-xs text-white/40 mt-1">Up to 5 files, Max 200MB each</p>
                            
                            {value && value.length > 0 && (
                              <div className="mt-4 w-full bg-black/40 rounded p-3">
                                <p className="text-xs text-primary font-mono">{value.length} file(s) selected</p>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-white/60">
                        <span>Uploading files...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <Button type="submit" size="lg" className="w-full font-serif text-lg h-14" disabled={isUploading}>
                    {isUploading ? "Processing..." : "Submit Order & Get Payment Instructions"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-white/60 text-sm font-medium mb-1">Total Price</p>
                  <div className="text-4xl font-bold font-mono text-white tracking-tighter">$80</div>
                </div>
                <div className="text-right">
                  <div className="text-lg text-white/70 font-mono">328,000 ៛</div>
                </div>
              </div>
              <div className="h-px w-full bg-white/10 mb-6" />
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-white/80">3–5 day turnaround</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-white/80">Full multitrack mix & master</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-white/80">1 round of free revisions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-white/80">High-res 24-bit WAV + MP3 delivery</span>
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
