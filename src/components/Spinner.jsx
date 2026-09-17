export default function Spinner({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-zinc-500">
      <div className="w-8 h-8 border-2 border-zinc-700 border-t-orange-500 rounded-full animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
