import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getMyGames, createGame, createMachine, deleteMachine } from '../../api/owner'

export default function ManageGames() {
  const { shopId } = useParams()
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [newGameName, setNewGameName] = useState('')
  const [newGamePrice, setNewGamePrice] = useState('')
  const [submittingGame, setSubmittingGame] = useState(false)

  const [machineInputs, setMachineInputs] = useState({}) // { [gameId]: "PS5-03" }

  async function loadGames() {
    setLoading(true)
    try {
      const data = await getMyGames(shopId)
      setGames(data)
    } catch {
      setError('Could not load games.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGames()
  }, [shopId])

  async function handleAddGame(e) {
    e.preventDefault()
    if (!newGameName.trim() || !newGamePrice) return
    setSubmittingGame(true)
    try {
      await createGame(shopId, { name: newGameName, price_per_hour: newGamePrice })
      setNewGameName('')
      setNewGamePrice('')
      loadGames()
    } catch {
      setError('Could not add game.')
    } finally {
      setSubmittingGame(false)
    }
  }

  async function handleAddMachine(gameId) {
    const number = machineInputs[gameId]?.trim()
    if (!number) return
    try {
      await createMachine(gameId, { machine_number: number })
      setMachineInputs((prev) => ({ ...prev, [gameId]: '' }))
      loadGames()
    } catch {
      setError('Could not add machine.')
    }
  }

  async function handleDeleteMachine(machineId) {
    try {
      await deleteMachine(machineId)
      loadGames()
    } catch {
      setError('Could not remove machine.')
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 px-6 py-4">
        <Link to="/owner/dashboard" className="text-zinc-400 hover:text-white text-sm">← Back to Dashboard</Link>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        <h1 className="text-2xl font-bold">Manage Games</h1>
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {/* Add new game */}
        <form onSubmit={handleAddGame} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex gap-3">
          <input
            type="text"
            placeholder="Game name (e.g. PlayStation 5)"
            value={newGameName}
            onChange={(e) => setNewGameName(e.target.value)}
            className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
          />
          <input
            type="number"
            placeholder="Price/hr"
            value={newGamePrice}
            onChange={(e) => setNewGamePrice(e.target.value)}
            className="w-28 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
          />
          <button
            type="submit"
            disabled={submittingGame}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 px-4 py-2 rounded-lg text-sm font-medium"
          >
            {submittingGame ? 'Adding...' : '+ Add Game'}
          </button>
        </form>

        {/* Games list */}
        {loading && <p className="text-zinc-500">Loading...</p>}

        <div className="space-y-4">
          {games.map((game) => (
            <div key={game.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">{game.name}</h3>
                <span className="text-orange-400 text-sm">₹{game.price_per_hour}/hr</span>
              </div>

              <p className="text-zinc-500 text-xs mb-2">Machines</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {game.machines.length === 0 && (
                  <span className="text-zinc-600 text-sm">No machines yet.</span>
                )}
                {game.machines.map((m) => (
                  <span
                    key={m.id}
                    className="flex items-center gap-2 bg-zinc-800 text-sm px-3 py-1 rounded-full"
                  >
                    {m.machine_number}
                    <button
                      onClick={() => handleDeleteMachine(m.id)}
                      className="text-zinc-500 hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. PS5-03"
                  value={machineInputs[game.id] || ''}
                  onChange={(e) =>
                    setMachineInputs((prev) => ({ ...prev, [game.id]: e.target.value }))
                  }
                  className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-orange-500"
                />
                <button
                  onClick={() => handleAddMachine(game.id)}
                  className="border border-zinc-700 hover:bg-zinc-800 px-3 py-1.5 rounded-lg text-sm"
                >
                  + Add Machine
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}