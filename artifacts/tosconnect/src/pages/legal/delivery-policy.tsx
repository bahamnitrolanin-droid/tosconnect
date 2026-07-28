import * as React from "react"
import { Truck } from "lucide-react"

export default function DeliveryPolicy() {
  return (
    <div className="container max-w-3xl py-16 md:py-24 px-4">
      <div className="flex items-center gap-3 mb-2">
        <Truck className="w-8 h-8 text-primary" />
        <h1 className="text-4xl font-serif font-bold text-white">Delivery Policy</h1>
      </div>
      <p className="text-white/40 text-sm mb-10">Last updated: July 28, 2026</p>

      <div className="prose prose-invert prose-yellow max-w-none text-white/70">
        <p className="lead text-xl text-white/90">
          All services provided by TosConnect are delivered digitally. There is no physical shipping. This policy defines how and when you will receive your deliverables.
        </p>

        <h2>1. Service Fulfilment Model</h2>
        <p>
          TosConnect is a 100% digital service business. All deliverables — audio files and consultation sessions — are transmitted electronically. This complies with the digital goods fulfilment standards recognised by ABA PayWay and the National Bank of Cambodia for e-commerce merchant accounts.
        </p>

        <h2>2. Mixing & Mastering Delivery</h2>
        <ul>
          <li><strong>Format:</strong> 24-bit WAV master + MP3 (320kbps) via email download link</li>
          <li><strong>Timeline:</strong> 3–5 business days after receiving all required, correctly formatted stems</li>
          <li><strong>Delivery method:</strong> Secure download link sent to the email address provided at checkout</li>
          <li><strong>Link availability:</strong> Download links remain active for 30 days. Back up your files upon receipt.</li>
        </ul>
        <p>
          The clock starts only after (a) payment is confirmed by ABA PayWay and (b) all required stems have been received and validated. Incomplete or incorrectly formatted stems will pause the timeline until corrected files are received.
        </p>

        <h2>3. Virtual Consultation Delivery</h2>
        <ul>
          <li><strong>Format:</strong> 60-minute session via Zoom or Google Meet</li>
          <li><strong>Timeline:</strong> Session link emailed within 24 hours of booking confirmation</li>
          <li><strong>Scheduling:</strong> Based on the preferred time slots selected at booking; we will confirm the exact time by email</li>
        </ul>

        <h2>4. Delivery Confirmation</h2>
        <p>
          Delivery is considered complete when:
        </p>
        <ul>
          <li><strong>Mixing/mastering:</strong> the download link email has been sent to your registered address</li>
          <li><strong>Consultation:</strong> the agreed session has taken place</li>
        </ul>
        <p>
          If you do not receive a delivery email within the stated timeline, check your spam/junk folder before contacting us at <a href="mailto:pvisal.life@gmail.com">pvisal.life@gmail.com</a>.
        </p>

        <h2>5. Missed or Rescheduled Consultations</h2>
        <p>
          If you miss a scheduled consultation without 24 hours' notice, the session is forfeited. If we need to reschedule, we will contact you at least 24 hours in advance and offer a new time slot at no additional charge.
        </p>

        <h2>6. Force Majeure</h2>
        <p>
          In extraordinary circumstances beyond our control (natural disaster, major platform outages), we will notify you promptly and agree on a revised delivery timeline. This does not affect your rights under our Refund Policy.
        </p>

        <h2>7. Contact</h2>
        <p>
          For delivery enquiries, email <a href="mailto:pvisal.life@gmail.com">pvisal.life@gmail.com</a> with your order ID.
        </p>
      </div>
    </div>
  )
}
