import * as React from "react"
import { Scale } from "lucide-react"

export default function TermsConditions() {
  return (
    <div className="container max-w-3xl py-16 md:py-24 px-4">
      <div className="flex items-center gap-3 mb-2">
        <Scale className="w-8 h-8 text-primary" />
        <h1 className="text-4xl font-serif font-bold text-white">Terms & Conditions</h1>
      </div>
      <p className="text-white/40 text-sm mb-10">Last updated: July 28, 2026</p>

      <div className="prose prose-invert prose-yellow max-w-none text-white/70">
        <p className="lead text-xl text-white/90">
          By placing an order or booking a consultation with TosConnect, you agree to the following terms. Please read them carefully before proceeding.
        </p>

        <h2>1. About TosConnect</h2>
        <p>
          TosConnect is a professional audio services business operating from Phnom Penh, Cambodia. We provide mixing, mastering, and music production consultation services to creators and artists. Contact: <a href="mailto:pvisal.life@gmail.com">pvisal.life@gmail.com</a>.
        </p>

        <h2>2. Service Scope</h2>
        <p>
          TosConnect provides professional audio mixing, mastering, and consultation services as described on our service pages. By placing an order, you confirm you have read the service description and agree to provide correctly formatted stems or attend the scheduled consultation as agreed.
        </p>

        <h2>3. Payments and Billing</h2>
        <p>
          All payments are processed via <strong>ABA PayWay KHQR</strong>, a licensed payment gateway operated by Advanced Bank of Asia Limited (ABA Bank), regulated by the National Bank of Cambodia (NBC). By completing a payment you agree to:
        </p>
        <ul>
          <li>ABA PayWay's terms of service and privacy policy</li>
          <li>The prices displayed at the time of purchase (USD or KHR equivalent)</li>
        </ul>
        <p>
          TosConnect does not store, access, or retain any bank account numbers, card numbers, PINs, OTPs, or other banking credentials. All payment data is transmitted directly to and handled exclusively by ABA PayWay's PCI-DSS compliant infrastructure.
        </p>
        <p>
          KHQR codes expire after 15 minutes. If a code expires before payment, you may generate a new one from the checkout page. TosConnect is not liable for exchange rate fluctuations between USD and KHR between order placement and payment.
        </p>

        <h2>4. Intellectual Property</h2>
        <p>
          The client retains 100% ownership and publishing rights to their original music and compositions. TosConnect claims no ownership, co-writing credit, or publishing rights over any delivered mixed or mastered tracks, unless separately agreed in writing.
        </p>
        <p>
          TosConnect retains all rights to its own production techniques, signal chains, processing methods, templates, and proprietary workflows. DAW session files (.logicx, .ptx, .als, etc.) are not included in deliverables.
        </p>

        <h2>5. Prohibited Content</h2>
        <p>We reserve the right to immediately cancel and refund orders for projects that contain:</p>
        <ul>
          <li>Content promoting violence, hate speech, or discrimination</li>
          <li>Material that infringes third-party copyrights or trademarks</li>
          <li>Content that is illegal under Cambodian law</li>
        </ul>

        <h2>6. Turnaround and Deadlines</h2>
        <p>
          Our standard mixing and mastering turnaround is 3–5 business days from receipt of correctly formatted stems. Rush requests may be available for an additional fee — contact us before ordering. Turnaround times are estimates and not guaranteed delivery dates.
        </p>

        <h2>7. Revisions</h2>
        <p>
          One free revision round is included per mixing/mastering order. A revision covers balance, EQ, and loudness adjustments — not a complete re-mix. Additional revisions or changes to arrangement may incur extra fees, agreed in advance.
        </p>

        <h2>8. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by Cambodian law, TosConnect's liability for any claim arising from a service is limited to the amount paid for that specific order. We are not liable for indirect, consequential, or punitive damages including loss of revenue, lost opportunities, or data loss.
        </p>

        <h2>9. Dispute Resolution</h2>
        <p>
          We aim to resolve all disputes amicably. Contact us at <a href="mailto:pvisal.life@gmail.com">pvisal.life@gmail.com</a> with your order ID. If resolution cannot be reached within 30 days, disputes shall be submitted to the competent courts in Phnom Penh, Cambodia.
        </p>

        <h2>10. Governing Law</h2>
        <p>
          These terms are governed by and construed in accordance with the laws of the Kingdom of Cambodia, including the Law on E-Commerce and applicable National Bank of Cambodia circulars relating to digital payment services.
        </p>

        <h2>11. Amendments</h2>
        <p>
          We reserve the right to update these terms at any time. Material changes will be communicated by email. Continued use of our services after any update constitutes acceptance of the revised terms.
        </p>
      </div>
    </div>
  )
}
