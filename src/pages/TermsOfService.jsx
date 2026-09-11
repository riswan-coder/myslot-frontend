import { Link } from 'react-router-dom'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-900 px-6 py-4">
        <Link to="/" className="text-zinc-400 hover:text-white text-sm">← Back to MySlot</Link>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12 space-y-6 text-zinc-300 text-sm leading-relaxed">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Terms of Service</h1>
          <p className="text-zinc-500 text-xs">Last updated: September 2026</p>
        </div>

        <p>
          By using MySlot, you agree to the following terms. Please read them carefully before
          booking a slot or listing your gaming center.
        </p>

        <div>
          <h2 className="text-white font-semibold mb-2">1. What MySlot Is</h2>
          <p>
            MySlot is a platform that connects customers with gaming centers, allowing customers
            to discover and book available gaming slots. MySlot is not the owner or operator of
            any gaming center listed on the platform.
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-2">2. Bookings</h2>
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>Bookings can be made without creating an account, using your name and phone number.</li>
            <li>A unique Booking ID is generated for each booking and, together with your phone number, is required to look up or cancel that booking.</li>
            <li>Each slot can only be booked by one customer at a time.</li>
            <li>You are responsible for arriving at the gaming center at your booked time.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-2">3. Payments</h2>
          <p>
            Payments are processed securely through Razorpay. By completing a payment, you agree to
            Razorpay's applicable terms in addition to these Terms of Service.
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-2">4. Cancellation & Refund Policy</h2>
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>Cancellations must be requested by contacting the gaming center directly at the phone number provided on your booking.</li>
            <li>Cancellation requests must be made at least 2 hours before your booked slot time. Requests made after this window may not be accepted.</li>
            <li>MySlot does not independently decide or process refunds. Refund decisions and amounts are determined by the gaming center. Where a gaming center approves a refund for an online payment, it will be processed back to your original payment method via Razorpay.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-2">5. Gaming Center Owners</h2>
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>Owners are responsible for accurately listing their gaming center, games, machines, and available slots.</li>
            <li>New gaming centers are reviewed by MySlot before appearing publicly on the platform.</li>
            <li>Owners are responsible for honoring bookings made through MySlot and for handling any cancellations or disputes with customers fairly.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-2">6. Limitation of Liability</h2>
          <p>
            MySlot acts as a booking platform connecting customers and gaming centers. We are not
            responsible for the condition of any gaming center, the quality of equipment or service
            provided, or disputes arising directly between customers and gaming centers. MySlot's
            liability, to the extent permitted by law, is limited to the amount of the specific
            booking in question.
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-2">7. Changes to These Terms</h2>
          <p>
            We may update these Terms of Service from time to time. Continued use of MySlot after
            changes are posted constitutes acceptance of the updated terms.
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-2">8. Contact</h2>
          <p>
            For questions about these Terms, please reach out via our support channels listed on the site.
          </p>
        </div>
      </div>
    </div>
  )
}
