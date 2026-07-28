import * as React from "react"
import { Lock } from "lucide-react"

export default function PrivacyPolicy() {
  return (
    <div className="container max-w-3xl py-16 md:py-24 px-4">
      <div className="flex items-center gap-3 mb-8">
        <Lock className="w-8 h-8 text-primary" />
        <h1 className="text-4xl font-serif font-bold text-white">Privacy Policy</h1>
      </div>
      
      <div className="prose prose-invert prose-orange max-w-none text-white/70">
        <p className="lead text-xl text-white/90">
          At TosConnect, we take your privacy and the security of your unreleased music seriously.
        </p>

        <h2>Data Collected</h2>
        <p>
          When you use our services, we collect necessary information to fulfill your order, including:
          <ul>
            <li>Your name and email address</li>
            <li>Project files (audio stems, reference tracks)</li>
            <li>Communication related to your project</li>
          </ul>
        </p>

        <h2>How It's Used</h2>
        <p>
          The data collected is used exclusively for service delivery. We do not sell your personal information or share your unreleased music with third parties. Your email is used for order updates, deliverable links, and customer support.
        </p>

        <h2>Data Retention</h2>
        <p>
          To protect your intellectual property, project files and stems are securely deleted from our active servers 30 days after the final deliverables have been sent to you.
        </p>

        <h2>Third-Party Services</h2>
        <p>
          We use ABA PayWay for secure payment processing. When making a payment, your data is subject to their privacy policies. TosConnect does not access or store your banking credentials.
        </p>

        <h2>Contact Rights</h2>
        <p>
          You have the right to request access to or deletion of your personal data at any time. Contact us at <a href="mailto:support@tosconnect.com">support@tosconnect.com</a> to exercise these rights.
        </p>
      </div>
    </div>
  )
}
