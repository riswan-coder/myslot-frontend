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
  const [newGameImage, setNewGameImage] = useState(null)
  const [newGamePreview, setNewGamePreview] = useState(null)
  const [submittingGame, setSubmittingGame] = useState(false)

  const [machineInputs, setMachineInputs] = useState({})

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

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (file) {
      setNewGameImage(file)
      setNewGamePreview(URL.createObjectURL(file))
    }
  }

  async function handleAddGame(e) {
    e.preventDefault()
    if (!newGameName.trim() || !newGamePrice) return
    setSubmittingGame(true)
    setError('')
    try {
      await createGame(shopId, {
        name: newGameName,
        price_per_hour: newGamePrice,
        image: newGameImage,
      })
      setNewGameName('')
      setNewGamePrice('')
      setNewGameImage(null)
      setNewGamePreview(null)
      loadGames()
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : 'Could not add game.')
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
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-900 px-6 py-4">
        <Link to="/owner/dashboard" className="text-zinc-400 hover:text-white text-sm">← Back to Dashboard</Link>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        <h1 className="text-2xl font-bold">Manage Games</h1>
        {error && <p className="text-red-400 text-sm break-all">{error}</p>}

        <form onSubmit={handleAddGame} className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-3">
          <p className="text-sm font-medium text-zinc-400">Add a New Game</p>

          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
              {newGamePreview ? (
                <img src={newGamePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-zinc-700 text-2xl">🎮</span>
              )}
            </div>
            <label className="border border-zinc-800 hover:bg-zinc-900 px-4 py-2 rounded-lg text-sm cursor-pointer text-zinc-300">
              Choose Image
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            {newGameImage && (
              <span className="text-zinc-500 text-xs">{newGameImage.name}</span>
            )}
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Game name (e.g. PlayStation 5)"
              value={newGameName}
              onChange={(e) => setNewGameName(e.target.value)}
              className="flex-1 bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
            />
            <input
              type="number"
              placeholder="Price/hr"
              value={newGamePrice}
              onChange={(e) => setNewGamePrice(e.target.value)}
              className="w-28 bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
            />
          </div>

          <button
            type="submit"
            disabled={submittingGame}
            className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 px-4 py-2 rounded-lg text-sm font-medium"
          >
            {submittingGame ? 'Adding...' : '+ Add Game'}
          </button>
        </form>

        {loading && <p className="text-zinc-500">Loading...</p>}

        <div className="space-y-4">
          {games.map((game) => (
            <div key={game.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 bg-zinc-900 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {game.image ? (
                    <img src={game.image} alt={game.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-zinc-700 text-xl">🎮</span>
                  )}
                </div>
                <div className="flex-1 flex justify-between items-center">
                  <h3 className="font-semibold">{game.name}</h3>
                  <span className="text-red-400 text-sm">₹{game.price_per_hour}/hr</span>
                </div>
              </div>

              <p className="text-zinc-500 text-xs mb-2">Machines</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {game.machines.length === 0 && (
                  <span className="text-zinc-600 text-sm">No machines yet.</span>
                )}
                {game.machines.map((m) => (
                  <span key={m.id} className="flex items-center gap-2 bg-zinc-900 text-sm px-3 py-1 rounded-full">
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
                  className="flex-1 bg-black border border-zinc-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-red-500"
                />
                <button
                  onClick={() => handleAddMachine(game.id)}
                  className="border border-zinc-700 hover:bg-zinc-900 px-3 py-1.5 rounded-lg text-sm"
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
