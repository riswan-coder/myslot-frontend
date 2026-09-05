import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getMyGames, getMySlots, createSlot, bulkCreateSlots, deleteSlot } from '../../api/owner'

export default function ManageSlots() {
  const { shopId } = useParams()
  const [games, setGames] = useState([])
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [selectedMachine, setSelectedMachine] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [price, setPrice] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [bulkMachine, setBulkMachine] = useState('')
  const [bulkStartDate, setBulkStartDate] = useState('')
  const [bulkEndDate, setBulkEndDate] = useState('')
  const [bulkStartTime, setBulkStartTime] = useState('10:00')
  const [bulkEndTime, setBulkEndTime] = useState('22:00')
  const [bulkDuration, setBulkDuration] = useState('60')
  const [bulkPrice, setBulkPrice] = useState('')
  const [bulkSubmitting, setBulkSubmitting] = useState(false)

  async function loadData() {
    setLoading(true)
    try {
      const gamesData = await getMyGames(shopId)
      const slotsData = await getMySlots()
      setGames(gamesData)
      setSlots(slotsData)
    } catch {
      setError('Could not load data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [shopId])

  const allMachines = games.flatMap((g) =>
    g.machines.map((m) => ({ ...m, gameName: g.name, gamePrice: g.price_per_hour }))
  )

  async function handleAddSlot(e) {
    e.preventDefault()
    if (!selectedMachine || !date || !startTime || !endTime || !price) return
    setSubmitting(true)
    setError('')
    try {
      await createSlot(selectedMachine, { date, start_time: startTime, end_time: endTime, price })
      setDate('')
      setStartTime('')
      setEndTime('')
      setPrice('')
      loadData()
    } catch (err) {
      setError(err.response?.data?.machine?.[0] || 'Could not add slot. Check for duplicate time.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleBulkGenerate(e) {
    e.preventDefault()
    if (!bulkMachine || !bulkStartDate || !bulkEndDate || !bulkStartTime || !bulkEndTime || !bulkPrice) return
    setBulkSubmitting(true)
    setError('')
    setSuccess('')
    try {
      const result = await bulkCreateSlots({
        machine: bulkMachine,
        start_date: bulkStartDate,
        end_date: bulkEndDate,
        start_time: bulkStartTime,
        end_time: bulkEndTime,
        duration_minutes: bulkDuration,
        price: bulkPrice,
      })
      setSuccess(result.message)
      loadData()
    } catch (err) {
      setError(err.response?.data?.error || 'Could not generate slots.')
    } finally {
      setBulkSubmitting(false)
    }
  }

  async function handleDeleteSlot(slotId) {
    try {
      await deleteSlot(slotId)
      loadData()
    } catch {
      setError('Could not remove slot.')
    }
  }

  const machineIdsOwned = new Set(allMachines.map((m) => m.id))
  const mySlots = slots.filter((s) => machineIdsOwned.has(s.machine))

  function fillBulkPriceFromMachine(machineId) {
    setBulkMachine(machineId)
    const machine = allMachines.find((m) => String(m.id) === String(machineId))
    if (machine) setBulkPrice(machine.gamePrice)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-900 px-6 py-4">
        <Link to="/owner/dashboard" className="text-zinc-400 hover:text-white text-sm">← Back to Dashboard</Link>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        <h1 className="text-2xl font-bold">Manage Slots</h1>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">{success}</p>}

        {/* Bulk generator */}
        <form onSubmit={handleBulkGenerate} className="bg-zinc-950 border border-red-900/40 rounded-xl p-5 space-y-3">
          <p className="text-sm font-medium">⚡ Bulk Generate Slots</p>
          <p className="text-zinc-500 text-xs">Create many slots at once across a date range.</p>

          <select
            value={bulkMachine}
            onChange={(e) => fillBulkPriceFromMachine(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
          >
            <option value="">Select a machine</option>
            {allMachines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.gameName} — {m.machine_number}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-500 text-xs">From Date</label>
              <input
                type="date"
                value={bulkStartDate}
                onChange={(e) => setBulkStartDate(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="text-zinc-500 text-xs">To Date</label>
              <input
                type="date"
                value={bulkEndDate}
                onChange={(e) => setBulkEndDate(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-500 text-xs">Daily Start Time</label>
              <input
                type="time"
                value={bulkStartTime}
                onChange={(e) => setBulkStartTime(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="text-zinc-500 text-xs">Daily End Time</label>
              <input
                type="time"
                value={bulkEndTime}
                onChange={(e) => setBulkEndTime(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-500 text-xs">Slot Duration</label>
              <select
                value={bulkDuration}
                onChange={(e) => setBulkDuration(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
              >
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>
            <div>
              <label className="text-zinc-500 text-xs">Price per Slot</label>
              <input
                type="number"
                value={bulkPrice}
                onChange={(e) => setBulkPrice(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={bulkSubmitting}
            className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 py-2.5 rounded-lg text-sm font-medium"
          >
            {bulkSubmitting ? 'Generating...' : 'Generate Slots'}
          </button>
        </form>

        {/* Single slot add */}
        <form onSubmit={handleAddSlot} className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-3">
          <p className="text-sm font-medium text-zinc-400">Or add a single slot</p>
          <select
            value={selectedMachine}
            onChange={(e) => setSelectedMachine(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
          >
            <option value="">Select a machine</option>
            {allMachines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.gameName} — {m.machine_number}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
            />
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
            />
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="border border-zinc-700 hover:bg-zinc-900 disabled:opacity-50 px-4 py-2 rounded-lg text-sm"
          >
            {submitting ? 'Adding...' : '+ Add Single Slot'}
          </button>
        </form>

        {loading && <p className="text-zinc-500">Loading...</p>}

        <div>
          <h2 className="text-lg font-semibold mb-3">Existing Slots ({mySlots.length})</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {mySlots.length === 0 && <p className="text-zinc-500 text-sm">No slots yet.</p>}
            {mySlots.map((slot) => {
              const machine = allMachines.find((m) => m.id === slot.machine)
              return (
                <div
                  key={slot.id}
                  className="flex justify-between items-center bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3"
                >
                  <div className="text-sm">
                    <span className="font-medium">{machine?.gameName} — {machine?.machine_number}</span>
                    <span className="text-zinc-500 ml-3">
                      {slot.date} · {slot.start_time.slice(0, 5)}–{slot.end_time.slice(0, 5)} · ₹{slot.price}
                    </span>
                    {slot.is_booked && (
                      <span className="ml-3 text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                        Booked
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteSlot(slot.id)}
                    disabled={slot.is_booked}
                    className="text-zinc-500 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                  >
                    Remove
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
