import * as React from "react"
import { ShieldCheck } from "lucide-react"

export default function AmlPolicy() {
  return (
    <div className="container max-w-3xl py-16 md:py-24 px-4">
      <div className="flex items-center gap-3 mb-2">
        <ShieldCheck className="w-8 h-8 text-primary" />
        <h1 className="text-4xl font-serif font-bold text-white">Anti-Money Laundering (AML) &amp; Counter-Terrorism Financing (CTF) Policy</h1>
      </div>
      <p className="text-white/40 text-sm mb-10">Last updated: July 28, 2026</p>

      <div className="prose prose-invert prose-yellow max-w-none text-white/70">
        <p className="lead text-xl text-white/90">
          TosConnect is committed to complying with all applicable Cambodian anti-money laundering and counter-terrorism financing laws, including the Law on Anti-Money Laundering and Combating the Financing of Terrorism (AML/CFT Law) and all related National Bank of Cambodia (NBC) regulations.
        </p>

        <h2>1. Our Commitment</h2>
        <p>
          TosConnect operates as a legitimate digital services business. We do not facilitate, knowingly accept, or ignore suspicious financial activity. All transactions are processed exclusively through ABA PayWay, a licensed and NBC-regulated payment gateway operated by Advanced Bank of Asia Limited (ABA Bank). ABA Bank is responsible for primary AML/CTF compliance at the payment processing level.
        </p>

        <h2>2. Accepted Payment Methods</h2>
        <p>
          TosConnect accepts payments <strong>only</strong> through ABA PayWay KHQR. We do not accept:
        </p>
        <ul>
          <li>Cash payments of any amount</li>
          <li>Cryptocurrency or digital asset transfers</li>
          <li>Third-party payment on behalf of the ordering customer</li>
          <li>Transfers from unknown or unverified sources</li>
          <li>Payments that exceed the stated service price</li>
        </ul>

        <h2>3. Customer Verification</h2>
        <p>
          We collect the customer's name and email address at the time of order. For standard low-value digital service transactions (under $100 USD), this information together with ABA PayWay's own KYC verification of the paying account is deemed sufficient.
        </p>

        <h2>4. Transaction Monitoring</h2>
        <p>
          All transactions are logged with their ABA PayWay reference number, amount, timestamp, and service type. We review transaction patterns for anomalies. Suspicious activity, including unsolicited overpayments, requests to redirect refunds to different accounts, or unusual repeat orders, will be declined and reported as required by law.
        </p>

        <h2>5. Reporting Obligations</h2>
        <p>
          In accordance with Cambodia's AML/CFT Law and NBC Prakas No. B7-017-344, TosConnect will report any suspicious transaction or activity to the Financial Intelligence Unit (FIU) of the National Bank of Cambodia where required. We cooperate fully with any investigation by law enforcement or regulatory authorities.
        </p>

        <h2>6. Record-Keeping</h2>
        <p>
          Transaction records, including order details and ABA PayWay payment references, are retained for a minimum of <strong>7 years</strong> in compliance with Cambodian AML/CFT regulations.
        </p>

        <h2>7. No Facilitation of Illegal Activity</h2>
        <p>
          We refuse orders for content that is illegal under Cambodian law, promotes terrorism, or is associated with proceeds of crime. Orders suspected of being connected to illegal activity will be cancelled and funds held pending regulatory guidance.
        </p>

        <h2>8. Contact</h2>
        <p>
          For AML/CTF compliance enquiries, contact <a href="mailto:pvisal.life@gmail.com">pvisal.life@gmail.com</a>.
        </p>
      </div>
    </div>
  )
}
