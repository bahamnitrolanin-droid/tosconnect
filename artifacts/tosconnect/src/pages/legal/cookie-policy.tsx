import * as React from "react"
import { Cookie } from "lucide-react"

export default function CookiePolicy() {
  return (
    <div className="container max-w-3xl py-16 md:py-24 px-4">
      <div className="flex items-center gap-3 mb-2">
        <Cookie className="w-8 h-8 text-primary" />
        <h1 className="text-4xl font-serif font-bold text-white">Cookie Policy</h1>
      </div>
      <p className="text-white/40 text-sm mb-10">Last updated: July 28, 2026</p>

      <div className="prose prose-invert prose-yellow max-w-none text-white/70">
        <p className="lead text-xl text-white/90">
          This policy explains how TosConnect uses cookies and similar browser storage technologies on this website.
        </p>

        <h2>1. What Are Cookies?</h2>
        <p>
          Cookies are small text files stored in your browser by a website you visit. Similar technologies include <code>sessionStorage</code> and <code>localStorage</code>, which store data only in your browser without sending it to a server.
        </p>

        <h2>2. How We Use Browser Storage</h2>
        <p>TosConnect uses only <strong>strictly necessary</strong> browser storage. We do not use tracking, advertising, or third-party analytics cookies.</p>

        <table>
          <thead>
            <tr>
              <th>Name / Key</th>
              <th>Type</th>
              <th>Purpose</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>payway_txn_*</code></td>
              <td>sessionStorage</td>
              <td>Stores active KHQR payment transaction data (QR image, expiry, amount) to display the checkout page. Cleared when the browser tab is closed.</td>
              <td>Session only</td>
            </tr>
            <tr>
              <td><code>tosconnect_admin_token</code></td>
              <td>localStorage</td>
              <td>Stores the admin authentication token after admin login. Only present if the admin panel has been accessed.</td>
              <td>Until logout or browser clear</td>
            </tr>
          </tbody>
        </table>

        <h2>3. No Third-Party Tracking</h2>
        <p>
          We do not use Google Analytics, Facebook Pixel, or any third-party advertising or tracking scripts. No behavioural data about your browsing is collected or sold.
        </p>

        <h2>4. ABA PayWay</h2>
        <p>
          The ABA PayWay payment gateway may set its own cookies when you interact with the payment flow. These are governed by <a href="https://www.ababank.com/privacy-policy/" target="_blank" rel="noopener noreferrer">ABA Bank's Privacy Policy</a>. TosConnect has no control over ABA PayWay's cookies.
        </p>

        <h2>5. Managing Cookies</h2>
        <p>
          You can clear cookies and browser storage at any time via your browser's settings. Clearing the <code>payway_txn_*</code> session storage while a payment is in progress will not cancel the transaction — the payment status is tracked server-side. You can re-enter your transaction from the checkout link in your order confirmation email.
        </p>

        <h2>6. Contact</h2>
        <p>
          Questions about our use of cookies: <a href="mailto:pvisal.life@gmail.com">pvisal.life@gmail.com</a>.
        </p>
      </div>
    </div>
  )
}
