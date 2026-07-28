import * as React from "react"
import { ShieldAlert } from "lucide-react"

export default function RefundPolicy() {
  return (
    <div className="container max-w-3xl py-16 md:py-24 px-4">
      <div className="flex items-center gap-3 mb-2">
        <ShieldAlert className="w-8 h-8 text-primary" />
        <h1 className="text-4xl font-serif font-bold text-white">Refund Policy</h1>
      </div>
      <p className="text-white/40 text-sm mb-10">Last updated: July 28, 2026</p>

      <div className="prose prose-invert prose-yellow max-w-none text-white/70">
        <p className="lead text-xl text-white/90">
          Due to the bespoke, labour-intensive nature of professional audio services, all sales are final once work has commenced. Please read this policy carefully before placing an order.
        </p>

        <h2>1. General Policy</h2>
        <p>
          TosConnect provides made-to-order digital services. Once your project has entered our production queue — confirmed by successful KHQR payment via ABA PayWay — no refund can be issued for change-of-mind or cancellation requests.
        </p>

        <h2>2. Eligible Refund Situations</h2>
        <p>A full refund may be issued <strong>only</strong> in the following circumstances:</p>
        <ul>
          <li>We are unable to commence your project within 14 business days of receiving payment and all required stems</li>
          <li>A verifiable technical failure on our side means we cannot deliver any output file</li>
          <li>The delivered files are demonstrably corrupted and we are unable to re-deliver within 7 days of your report</li>
        </ul>

        <h2>3. Non-Refundable Situations</h2>
        <ul>
          <li>Change of artistic direction after mixing/mastering has begun</li>
          <li>Dissatisfaction with creative interpretation (subjective taste) — revisions are available instead</li>
          <li>Failure to provide correctly formatted stems within 30 days of payment</li>
          <li>Consultation sessions: non-refundable within 24 hours of the scheduled session</li>
        </ul>

        <h2>4. Revisions</h2>
        <p>
          Mixing and mastering orders include <strong>one free revision round</strong>. A revision covers adjustments to levels, EQ balance, and loudness. It does not cover a complete re-mix or re-arrangement. Additional revision rounds may be purchased separately.
        </p>

        <h2>5. Technical Issue Resolution</h2>
        <p>
          If you experience issues receiving your deliverables (e.g., corrupted files, failed download links), contact <a href="mailto:pvisal.life@gmail.com">pvisal.life@gmail.com</a> within <strong>7 days</strong> of delivery. We will resolve the issue or, if unable to do so, process an appropriate remedy.
        </p>

        <h2>6. Payment Disputes</h2>
        <p>
          All payments are processed through ABA PayWay (Advanced Bank of Asia Limited). If you believe an unauthorised charge occurred, contact us immediately at <a href="mailto:pvisal.life@gmail.com">pvisal.life@gmail.com</a>. We cooperate fully with ABA Bank's dispute resolution process and comply with all National Bank of Cambodia merchant guidelines.
        </p>

        <h2>7. How to Request a Refund</h2>
        <p>To submit a refund request:</p>
        <ol>
          <li>Email <a href="mailto:pvisal.life@gmail.com">pvisal.life@gmail.com</a> with subject "Refund Request — [Order ID]"</li>
          <li>Include your order ID, payment reference, and the reason for your request</li>
          <li>We will acknowledge within 2 business days and respond with a decision within 7 business days</li>
        </ol>
        <p>
          Approved refunds are returned to the original ABA PayWay payment source. Processing time is subject to ABA Bank's standard settlement timelines.
        </p>
      </div>
    </div>
  )
}
