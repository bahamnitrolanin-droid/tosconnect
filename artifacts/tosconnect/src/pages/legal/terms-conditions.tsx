import * as React from "react"
import { Scale } from "lucide-react"

export default function TermsConditions() {
  return (
    <div className="container max-w-3xl py-16 md:py-24 px-4">
      <div className="flex items-center gap-3 mb-8">
        <Scale className="w-8 h-8 text-primary" />
        <h1 className="text-4xl font-serif font-bold text-white">Terms & Conditions</h1>
      </div>
      
      <div className="prose prose-invert prose-orange max-w-none text-white/70">
        <h2>Service Scope</h2>
        <p>
          TosConnect provides professional audio mixing, mastering, and consultation services. By placing an order, you agree to provide high-quality, properly exported stems as outlined in our submission guidelines.
        </p>

        <h2>Payments and Billing</h2>
        <p>
          Payments are processed via ABA PayWay KHQR, a licensed payment gateway operated by ABA Bank (Advanced Bank of Asia Limited). TosConnect does not store any bank account details, card numbers, or sensitive payment credentials on its servers. All payment data is handled exclusively by ABA PayWay's secure infrastructure.
        </p>

        <h2>Intellectual Property</h2>
        <p>
          The client retains 100% of the rights to their music and original compositions. TosConnect claims no ownership or publishing rights over the final mixed/mastered tracks, unless otherwise agreed upon in a separate written contract. We reserve the right to decline projects containing explicit hate speech or illegal content.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          TosConnect shall not be held liable for any indirect, incidental, special, consequential, or punitive damages resulting from the use of our services or the inability to use the delivered audio files.
        </p>

        <h2>Governing Law</h2>
        <p>
          These terms and conditions are governed by and construed in accordance with the laws of Cambodia.
        </p>

        <h2>Contact Information</h2>
        <p>
          For any questions regarding these terms, please contact us at <a href="mailto:support@tosconnect.com">support@tosconnect.com</a>.
        </p>
      </div>
    </div>
  )
}
