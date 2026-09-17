import { useRef, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import html2canvas from 'html2canvas'

export default function BookingConfirmed() {
  const { state } = useLocation()
  const receiptRef = useRef(null)
  const [downloading, setDownloading] = useState(false)

  if (!state) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>No booking found. <Link to="/" className="text-red-400 underline">Go home</Link></p>
      </div>
    )
  }

  async function handleDownload() {
    setDownloading(true)
    try {
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: '#09090b',
        scale: 2,
      })
      const link = document.createElement('a')
      link.download = `MySlot-Receipt-${state.bookingId}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Receipt download failed:', err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-8 text-center mb-4">
          <div className="text-green-400 text-5xl mb-4">✓</div>
          <h1 className="text-2xl font-bold mb-1">Booking Confirmed!</h1>
          <p className="text-zinc-500 text-sm mb-6">{state.bookingId}</p>

          <div className="text-left space-y-2 text-sm mb-8">
            <p className="flex justify-between"><span className="text-zinc-400">Gaming Center</span> <span>{state.shopName}</span></p>
            <p className="flex justify-between"><span className="text-zinc-400">Game</span> <span>{state.gameName}</span></p>
            <p className="flex justify-between"><span className="text-zinc-400">Date</span> <span>{state.date}</span></p>
            <p className="flex justify-between"><span className="text-zinc-400">Time</span> <span>{state.time}</span></p>
            <p className="flex justify-between"><span className="text-zinc-400">Amount</span> <span className="text-red-400 font-semibold">₹{state.price}</span></p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex-1 border border-zinc-700 hover:bg-zinc-900 disabled:opacity-50 py-3 rounded-lg text-sm font-medium"
            >
              {downloading ? 'Preparing...' : '⬇ Download Receipt'}
            </button>
            <Link to="/" className="flex-1 text-center bg-red-600 hover:bg-red-500 py-3 rounded-lg font-medium text-sm">
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Off-screen receipt template used only for image capture */}
      <div style={{ position: 'fixed', top: '-9999px', left: '-9999px' }}>
        <div
          ref={receiptRef}
          style={{
            width: '480px',
            backgroundColor: '#09090b',
            color: '#ffffff',
            padding: '32px',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '22px', fontWeight: 'bold' }}>
              MySlot <span style={{ color: '#dc2626' }}>🎮</span>
            </div>
            <div style={{ color: '#71717a', fontSize: '12px', marginTop: '4px' }}>
              Booking Receipt
            </div>
          </div>

          <div style={{ backgroundColor: '#18181b', borderRadius: '10px', padding: '20px', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center', color: '#4ade80', fontSize: '13px', marginBottom: '6px' }}>
              ✓ PAYMENT CONFIRMED
            </div>
            <div style={{ textAlign: 'center', color: '#a1a1aa', fontSize: '12px', marginBottom: '16px' }}>
              {state.bookingId}
            </div>

            <Row label="Gaming Center" value={state.shopName} />
            <Row label="Game" value={state.gameName} />
            <Row label="Date" value={state.date} />
            <Row label="Time" value={state.time} />
            <Row label="Customer" value={state.guestName || '—'} />
            <Row label="Phone" value={state.guestPhone || '—'} />
            <div style={{ borderTop: '1px solid #27272a', margin: '12px 0' }} />
            <Row label="Amount Paid" value={`₹${state.price}`} bold accent />
          </div>

          <div style={{ textAlign: 'center', color: '#52525b', fontSize: '11px', lineHeight: '1.5' }}>
            Please show this receipt at the gaming center.<br />
            Cancellations: call the shop directly, at least 2 hours before your slot.<br />
            myslots.co.in
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, bold, accent }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '14px',
        padding: '6px 0',
        color: accent ? '#f87171' : '#e4e4e7',
        fontWeight: bold ? 'bold' : 'normal',
      }}
    >
      <span style={{ color: '#a1a1aa', fontWeight: 'normal' }}>{label}</span>
      <span>{value}</span>
    </div>
  )
}
