import * as React from "react"
import { Truck } from "lucide-react"

export default function DeliveryPolicy() {
  return (
    <div className="container max-w-3xl py-16 md:py-24 px-4">
      <div className="flex items-center gap-3 mb-8">
        <Truck className="w-8 h-8 text-primary" />
        <h1 className="text-4xl font-serif font-bold text-white">Delivery Policy</h1>
      </div>
      
      <div className="prose prose-invert prose-orange max-w-none text-white/70">
        <p className="lead text-xl text-white/90">
          All services provided by TosConnect are delivered digitally. We are committed to transparent digital fulfillment with no physical shipping requirements.
        </p>

        <h2>Mixing & Mastering</h2>
        <p>
          Mixing & mastering orders are delivered as high-resolution audio files (WAV/MP3) via email. Our standard turnaround time is 3–5 business days from the moment we receive all required, correctly formatted stems.
        </p>

        <h2>Consultations</h2>
        <p>
          Consultation sessions are conducted virtually via Zoom or Google Meet. A session link will be emailed to you within 24 hours of booking confirmation.
        </p>

        <h2>File Retention</h2>
        <p>
          Delivered files will remain available via the provided download link for 30 days. After this period, files may be removed from our active servers. Please ensure you download and back up your files promptly upon delivery.
        </p>
      </div>
    </div>
  )
}
