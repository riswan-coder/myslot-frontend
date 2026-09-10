import { useState } from 'react'

export default function CancellationPolicyModal({ shopPhone, onAgree, onClose }) {
  const [agreed, setAgreed] = useState(false)

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-6">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold mb-3">Cancellation Policy</h3>
        <div className="text-zinc-400 text-sm space-y-3 mb-5 leading-relaxed">
          <p>
            Customers must cancel their booking by directly calling the gaming center at the phone number provided on the booking.
          </p>
          <p>
            Cancellation requests must be made <span className="text-white">at least 2 hours before</span> the booked slot time. Requests made after this period may not be accepted.
          </p>
          <p>
            MySlot does not process cancellation or refund requests directly. Any cancellation or refund amount will be decided and handled by the gaming center.
          </p>
          <p>
            Please contact the gaming center directly at{' '}
            <span className="text-red-400 font-medium">{shopPhone}</span>.
          </p>
        </div>

        <label className="flex items-start gap-3 mb-5 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 accent-red-600 w-4 h-4"
          />
          <span className="text-sm text-zinc-300">
            I have read and agree to the cancellation policy above.
          </span>
        </label>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-zinc-700 hover:bg-zinc-900 py-2.5 rounded-lg text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onAgree}
            disabled={!agreed}
            className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed py-2.5 rounded-lg text-sm font-medium"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  )
}
