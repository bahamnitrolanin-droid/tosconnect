import * as React from "react"
import { ShieldAlert } from "lucide-react"

export default function RefundPolicy() {
  return (
    <div className="container max-w-3xl py-16 md:py-24 px-4">
      <div className="flex items-center gap-3 mb-8">
        <ShieldAlert className="w-8 h-8 text-primary" />
        <h1 className="text-4xl font-serif font-bold text-white">Refund Policy</h1>
      </div>
      
      <div className="prose prose-invert prose-orange max-w-none text-white/70">
        <p className="lead text-xl text-white/90">
          Due to the nature of digital audio services, all sales are final and non-refundable once the work has commenced.
        </p>

        <h2>Service Execution</h2>
        <p>
          Once you have submitted your stems or booked your consultation, our team allocates time and resources to your project. Therefore, we cannot offer refunds after the mixing/mastering process has begun or within 24 hours of a scheduled consultation.
        </p>

        <h2>Technical Issues</h2>
        <p>
          If you experience technical issues receiving your deliverables (e.g., corrupted files, download errors), contact <a href="mailto:support@tosconnect.com">support@tosconnect.com</a> within 7 days for a resolution. We will ensure you receive the correct, working files.
        </p>

        <h2>Revisions</h2>
        <p>
          We are committed to your satisfaction. Custom mixing and mastering work may be eligible for one round of free revisions at the producer's discretion to ensure the final product meets your expectations. Additional revisions may incur extra fees.
        </p>
      </div>
    </div>
  )
}
