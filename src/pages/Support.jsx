import { Link } from 'react-router-dom'

const SUPPORT_PHONE = '7909146970'
const SUPPORT_WHATSAPP = '7909146970'
const SUPPORT_EMAIL = 'support@myslots.co.in'

export default function Support() {
  const whatsappMessage = encodeURIComponent('Hi, I need help with my MySlot booking.')

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-900 px-6 py-4">
        <Link to="/" className="text-zinc-400 hover:text-white text-sm">← Back to MySlot</Link>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-2">Need Help?</h1>
        <p className="text-zinc-500 text-sm mb-8">
          We're here to help with bookings, payments, cancellations, or any technical issues.
        </p>

        <div className="space-y-4">
          
            href={`tel:${SUPPORT_PHONE}`}
            className="flex items-center gap-4 bg-zinc-950 border border-zinc-800 hover:border-red-500/50 rounded-xl p-5 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-2xl flex-shrink-0">
              📞
            </div>
            <div>
              <p className="font-medium">Call Us</p>
              <p className="text-zinc-500 text-sm">{SUPPORT_PHONE}</p>
            </div>
          </a>

          
            href={`https://wa.me/${SUPPORT_WHATSAPP}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-zinc-950 border border-zinc-800 hover:border-green-500/50 rounded-xl p-5 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-2xl flex-shrink-0">
              💬
            </div>
            <div>
              <p className="font-medium">WhatsApp</p>
              <p className="text-zinc-500 text-sm">Chat with us instantly</p>
            </div>
          </a>

          
            href={`mailto:${SUPPORT_EMAIL}`}
            className="flex items-center gap-4 bg-zinc-950 border border-zinc-800 hover:border-blue-500/50 rounded-xl p-5 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-2xl flex-shrink-0">
              ✉️
            </div>
            <div>
              <p className="font-medium">Email</p>
              <p className="text-zinc-500 text-sm">{SUPPORT_EMAIL}</p>
            </div>
          </a>
        </div>

        <div className="mt-10 bg-zinc-950 border border-zinc-800 rounded-xl p-5">
          <p className="text-sm font-medium mb-3">We can help with:</p>
          <ul className="text-zinc-400 text-sm space-y-2">
            <li>• Booking confirmations and details</li>
            <li>• Payment issues or failed transactions</li>
            <li>• Cancellation and refund questions</li>
            <li>• Technical issues with the website</li>
          </ul>
        </div>

        <p className="text-zinc-600 text-xs mt-6">
          For cancellations specifically, please contact the gaming center directly using the phone number on your booking — see our{' '}
          <Link to="/terms-of-service" className="underline hover:text-zinc-400">Terms of Service</Link> for details.
        </p>
      </div>
    </div>
  )
}
