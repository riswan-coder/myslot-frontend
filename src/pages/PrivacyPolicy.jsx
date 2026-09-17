import { Link } from 'react-router-dom'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-900 px-6 py-4">
        <Link to="/" className="text-zinc-400 hover:text-white text-sm">← Back to MySlot</Link>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12 space-y-6 text-zinc-300 text-sm leading-relaxed">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Privacy Policy</h1>
          <p className="text-zinc-500 text-xs">Last updated: September 2026</p>
        </div>

        <p>
          This Privacy Policy explains how MySlot ("we", "us", "our") collects, uses, and protects
          information when you use our website to discover and book gaming center slots.
        </p>

        <div>
          <h2 className="text-white font-semibold mb-2">1. Information We Collect</h2>
          <p className="mb-2">When you make a booking as a guest, we collect:</p>
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>Your name</li>
            <li>Your phone number</li>
            <li>Booking details (gaming center, game, date, time, amount)</li>
          </ul>
          <p className="mt-2">
            If you are a gaming center owner or admin, we additionally collect a username, email,
            and password (stored securely, never in plain text) to enable login.
          </p>
          <p className="mt-2">
            Payments are processed by Razorpay. We do not collect or store your card, UPI, or
            banking details — these are handled entirely by Razorpay's secure payment systems.
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-2">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>To create and manage your booking</li>
            <li>To let you look up, cancel, or review a booking using your Booking ID and phone number</li>
            <li>To let gaming center owners view and manage bookings made at their shop</li>
            <li>To process payments and refunds via Razorpay</li>
          </ul>
          <p className="mt-2">
            We do not sell your personal information to third parties.
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-2">3. Guest Bookings — No Account Required</h2>
          <p>
            MySlot allows customers to book without creating an account. Your booking is identified
            by a unique Booking ID together with the phone number you provided. Keep both, as they
            are required to look up, cancel, or review your booking later.
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-2">4. Cookies & Local Storage</h2>
          <p>
            For gaming center owners and admins, we use browser local storage to keep you logged in
            between visits. Guests booking as customers do not require this.
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-2">5. Data Sharing</h2>
          <p>
            Booking details (your name and phone number) are shared with the specific gaming center
            you book with, so they can identify you and manage your slot. We use third-party services
            including Razorpay (payments), Cloudinary (image hosting), and Render/Vercel (site hosting)
            to operate MySlot.
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-2">6. Data Retention</h2>
          <p>
            Booking records are retained to maintain a history for gaming center owners and to handle
            any disputes or support requests. You may contact us to request deletion of your personal
            information, subject to any records we are required to keep for legal or accounting purposes.
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-2">7. Contact Us</h2>
          <p>
            For any questions about this Privacy Policy or your data, please contact us through the
            gaming center you booked with, or reach out via our support channels listed on the site.
          </p>
        </div>
      </div>
    </div>
  )
}
