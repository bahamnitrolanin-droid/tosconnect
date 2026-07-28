import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  UploadCloud, CheckCircle2, AlertCircle, ShieldCheck,
  FileAudio, X, Loader2, ArrowRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Form, FormControl, FormDescription,
  FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useCreateOrder, useRequestUploadUrl, useCreateTransaction } from "@workspace/api-client-react"
import { useLocation } from "wouter"
import { savePendingTransaction } from "@/lib/payway"

const MAX_FILE_SIZE = 200 * 1024 * 1024
const ACCEPTED_EXTENSIONS = /\.(wav|mp3|zip)$/i
const ACCEPTED_MIME = ["audio/wav", "audio/mpeg", "audio/mp3", "application/zip", "application/x-zip-compressed"]

const formSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  details: z.string().min(10, "Please describe your project (at least 10 characters)"),
  files: z.any().refine((f) => f?.length > 0, "At least one file is required"),
})

const PRICE_USD = 3
const PRICE_KHR = "12,300"

export default function MixingMasteringPage() {
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [isUploading, setIsUploading] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([])
  const [, navigate] = useLocation()

  const createOrder = useCreateOrder()
  const requestUploadUrl = useRequestUploadUrl()
  const createTransaction = useCreateTransaction()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { customerName: "", email: "", details: "" },
  })

  const isLoading = isUploading || createOrder.isPending || createTransaction.isPending

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitError(null)
    try {
      setIsUploading(true)
      const fileList = Array.from(values.files as FileList)
      const objectPaths: string[] = []

      for (const file of fileList) {
        if (file.size > MAX_FILE_SIZE)
          throw new Error(`"${file.name}" exceeds the 200 MB limit (${(file.size / 1024 / 1024).toFixed(1)} MB).`)
        if (!ACCEPTED_MIME.includes(file.type) && !ACCEPTED_EXTENSIONS.test(file.name))
          throw new Error(`"${file.name}" is not a supported format. Please upload WAV, MP3, or ZIP.`)
      }

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i]
        const { uploadURL, objectPath } = await requestUploadUrl.mutateAsync({
          data: { name: file.name, size: file.size, contentType: file.type || "application/octet-stream" },
        })
        const res = await fetch(uploadURL, {
          method: "PUT",
          headers: { "Content-Type": file.type || "application/octet-stream" },
          body: file,
        })
        if (!res.ok) throw new Error(`Upload failed for "${file.name}" (HTTP ${res.status}).`)
        objectPaths.push(objectPath)
        setUploadProgress(Math.round(((i + 1) / fileList.length) * 100))
      }

      const order = await createOrder.mutateAsync({
        data: {
          customerName: values.customerName,
          email: values.email,
          details: values.details,
          stemsUrls: objectPaths,
          amountUsd: PRICE_USD,
          amountKhr: 12300,
        },
      })

      const txn = await createTransaction.mutateAsync({ data: { orderId: order.id } })
      savePendingTransaction({
        transactionId: txn.transactionId,
        qrImage: txn.qrImage,
        expiresAt: txn.expiresAt,
        amountUsd: txn.amountUsd,
        amountKhr: txn.amountKhr,
        serviceType: "order",
      })
      navigate(`/checkout/${txn.transactionId}`)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong. Please try again.")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="min-h-screen">
      {/* ── Page Hero ── */}
      <div className="border-b border-white/5 bg-card/20 py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center animate-in slide-in-from-bottom-4 duration-700 fade-in">
          <Badge className="mb-4 px-4 py-1.5 text-xs tracking-widest uppercase" variant="outline">
            Professional Service
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-4 leading-tight">
            Mixing &amp; Mastering
          </h1>
          <p className="text-base sm:text-lg text-white/60 max-w-xl mx-auto leading-relaxed">
            Send us your stems. Get back a radio-ready track. Industry-standard loudness, precise EQ, and vocal tuning crafted for the modern creator.
          </p>
        </div>
      </div>

      {/* ── Form + Sidebar ── */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">

          {/* ── Sidebar: price first on mobile ── */}
          <aside className="order-first lg:order-last space-y-5">
            {/* Price card */}
            <Card className="border-primary/30 bg-primary/5 sticky top-24">
              <CardContent className="p-6 space-y-5">
                <div>
                  <p className="text-white/50 text-xs font-medium uppercase tracking-widest mb-1">Total Price</p>
                  <div className="flex items-end gap-3">
                    <span className="text-5xl font-bold font-mono text-white leading-none">${PRICE_USD}</span>
                    <span className="text-white/40 text-sm mb-1">USD</span>
                  </div>
                  <p className="text-white/40 font-mono text-sm mt-1">{PRICE_KHR} ៛ KHR</p>
                </div>
                <div className="h-px bg-white/10" />
                <ul className="space-y-3">
                  {[
                    "3–5 day turnaround",
                    "Full multitrack mix & master",
                    "Vocal tuning & precise EQ",
                    "1 free revision round",
                    "24-bit WAV + MP3 delivery",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-white/75">{item}</span>
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
                <CardTitle className="text-xl sm:text-2xl">Project Details</CardTitle>
                <CardDescription className="text-white/50">
                  Fill in your details and upload your stems to get started.
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

                    {/* Project Notes */}
                    <FormField
                      control={form.control}
                      name="details"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Notes &amp; References</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about the vibe. Link 1–2 reference tracks, describe the genre, BPM, and any specific requests..."
                              className="min-h-[120px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* File Upload */}
                    <FormField
                      control={form.control}
                      name="files"
                      render={({ field: { onChange } }) => (
                        <FormItem>
                          <FormLabel>Upload Stems</FormLabel>
                          <FormControl>
                            <div>
                              <label
                                htmlFor="file-upload"
                                className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer transition-colors px-4 py-8 text-center
                                  ${selectedFiles.length > 0
                                    ? "border-primary/40 bg-primary/5"
                                    : "border-white/15 bg-white/[0.02] hover:border-primary/30 hover:bg-primary/5"
                                  }`}
                              >
                                <UploadCloud className="w-8 h-8 text-white/30 mb-3" />
                                <p className="text-sm font-medium text-white/70">
                                  Drop files here or <span className="text-primary">browse</span>
                                </p>
                                <p className="text-xs text-white/35 mt-1">WAV · MP3 · ZIP — max 200 MB per file</p>
                                <input
                                  id="file-upload"
                                  type="file"
                                  className="sr-only"
                                  multiple
                                  accept=".wav,.mp3,.zip"
                                  onChange={(e) => {
                                    const files = e.target.files
                                    if (files) {
                                      onChange(files)
                                      setSelectedFiles(Array.from(files))
                                    }
                                  }}
                                />
                              </label>

                              {/* Selected file list */}
                              {selectedFiles.length > 0 && (
                                <ul className="mt-3 space-y-2">
                                  {selectedFiles.map((f) => (
                                    <li key={f.name} className="flex items-center gap-2 p-2.5 rounded-md bg-white/5 border border-white/10">
                                      <FileAudio className="w-4 h-4 text-primary shrink-0" />
                                      <span className="text-sm text-white/70 truncate flex-1">{f.name}</span>
                                      <span className="text-xs text-white/35 shrink-0">{(f.size / 1024 / 1024).toFixed(1)} MB</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </FormControl>
                          <FormDescription className="text-white/35 text-xs">
                            Export each track as a separate WAV stem at 24-bit/44.1 kHz. Zip multiple files.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Upload progress */}
                    {isUploading && uploadProgress > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-white/50">
                          <span>Uploading stems…</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-13 font-serif text-base gap-2 group"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {isUploading ? `Uploading… ${uploadProgress}%` : "Creating order…"}
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
