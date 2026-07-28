import * as React from "react"
import { Lock } from "lucide-react"

export default function PrivacyPolicy() {
  return (
    <div className="container max-w-3xl py-16 md:py-24 px-4">
      <div className="flex items-center gap-3 mb-2">
        <Lock className="w-8 h-8 text-primary" />
        <h1 className="text-4xl font-serif font-bold text-white">Privacy Policy</h1>
      </div>
      <p className="text-white/40 text-sm mb-10">Last updated: July 28, 2026</p>

      <div className="prose prose-invert prose-yellow max-w-none text-white/70">
        <p className="lead text-xl text-white/90">
          At TosConnect ("we", "us", "our"), we are committed to protecting your personal data and your unreleased creative work. This policy explains what we collect, how we use it, and your rights under applicable Cambodian data protection standards.
        </p>

        <h2>1. Data Controller</h2>
        <p>
          TosConnect is the data controller for all personal data processed through this website. Contact: <a href="mailto:pvisal.life@gmail.com">pvisal.life@gmail.com</a>, Phnom Penh, Cambodia.
        </p>

        <h2>2. What We Collect</h2>
        <p>When you use our services we collect:</p>
        <ul>
          <li><strong>Identity data:</strong> full name, email address</li>
          <li><strong>Order data:</strong> project description, service type, order reference number</li>
          <li><strong>Audio files:</strong> stems and reference tracks you upload for mixing/mastering</li>
          <li><strong>Payment data:</strong> ABA PayWay transaction reference (we never see card or banking credentials)</li>
          <li><strong>Communication data:</strong> messages exchanged for project coordination</li>
          <li><strong>Technical data:</strong> IP address, browser type, pages visited (anonymised analytics only)</li>
        </ul>

        <h2>3. Legal Basis for Processing</h2>
        <p>We process your data to:</p>
        <ul>
          <li>Fulfill the service contract you entered into with us</li>
          <li>Comply with legal obligations (financial record-keeping, AML/CTF requirements)</li>
          <li>Pursue our legitimate interests in improving service quality</li>
        </ul>

        <h2>4. How We Use Your Data</h2>
        <p>
          Your data is used exclusively for service delivery and legal compliance. We do not sell, rent, or share your personal information or unreleased music with third parties for marketing purposes. Your email is used for order updates, deliverable links, and customer support only.
        </p>

        <h2>5. Payment Processing</h2>
        <p>
          All payments are processed by <strong>ABA PayWay</strong>, operated by Advanced Bank of Asia Limited (ABA Bank), a National Bank of Cambodia licensed financial institution. TosConnect does not store, access, or process any bank account numbers, card numbers, PINs, or banking credentials. All payment data is handled exclusively within ABA PayWay's PCI-DSS compliant infrastructure.
        </p>

        <h2>6. Data Retention</h2>
        <ul>
          <li><strong>Audio files:</strong> securely deleted from active servers 30 days after final deliverables are sent</li>
          <li><strong>Order records:</strong> retained for 7 years to comply with Cambodian accounting and tax regulations</li>
          <li><strong>Payment references:</strong> retained as required by ABA Bank's merchant agreement and NBC regulations</li>
        </ul>

        <h2>7. Third-Party Services</h2>
        <p>We use the following trusted third parties:</p>
        <ul>
          <li><strong>ABA PayWay (ABA Bank):</strong> payment processing — subject to ABA's privacy policy</li>
          <li><strong>Google (Zoom/Meet):</strong> consultation video sessions — subject to Google's privacy policy</li>
          <li><strong>Cloud storage provider:</strong> secure audio file hosting with encryption at rest</li>
        </ul>

        <h2>8. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data (where legally permissible)</li>
          <li>Object to processing for legitimate interests</li>
        </ul>
        <p>
          To exercise these rights, contact us at <a href="mailto:pvisal.life@gmail.com">pvisal.life@gmail.com</a>. We will respond within 30 days.
        </p>

        <h2>9. Cookies</h2>
        <p>
          We use only essential session cookies required for the payment flow and order tracking. See our <a href="/cookie-policy">Cookie Policy</a> for details.
        </p>

        <h2>10. Changes to This Policy</h2>
        <p>
          We may update this policy to reflect changes in our services or legal requirements. Material changes will be notified via email. Continued use of our services after any update constitutes acceptance.
        </p>
      </div>
    </div>
  )
}
