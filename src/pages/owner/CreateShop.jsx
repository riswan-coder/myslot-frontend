import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createShop } from '../../api/owner'

export default function CreateShop() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    area: '',
    phone: '',
    email: '',
    opening_time: '10:00',
    closing_time: '22:00',
    working_days: 'Mon,Tue,Wed,Thu,Fri,Sat,Sun',
    google_maps_url: '',
  })

  const [coverImage, setCoverImage] = useState(null)
  const [preview, setPreview] = useState(null)

  const [coords, setCoords] = useState({
    latitude: null,
    longitude: null,
  })

  const [locating, setLocating] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Update form fields
  function update(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Image upload
  function handleImageChange(e) {
    const file = e.target.files?.[0]

    if (file) {
      setCoverImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  // Get shop GPS location
  function handleUseLocation() {
    if (!navigator.geolocation) {
      setError('Location is not supported by your browser.')
      return
    }

    setLocating(true)
    setError('')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })

        setLocating(false)
      },
      (err) => {
        console.error(err)

        setError(
          'Could not get your location. Please allow location permission and try again.'
        )

        setLocating(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  // Submit shop
  async function handleSubmit(e) {
    e.preventDefault()

    setError('')
    setSubmitting(true)

    try {
      const shopData = {
        ...form,
        latitude: coords.latitude,
        longitude: coords.longitude,
        cover_image: coverImage,
      }

      console.log('Submitting shop:', shopData)

      await createShop(shopData)

      navigate('/owner/dashboard')
    } catch (err) {
      console.error('Create shop error:', err)

      const data = err.response?.data

      let firstError = null

      if (data && typeof data === 'object') {
        const firstValue = Object.values(data)[0]

        if (Array.isArray(firstValue)) {
          firstError = firstValue[0]
        } else if (typeof firstValue === 'string') {
          firstError = firstValue
        }
      }

      setError(
        firstError ||
          err.response?.data?.detail ||
          'Could not create shop. Please check all fields.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Header */}
      <header className="border-b border-zinc-900 px-6 py-4">
        <Link
          to="/owner/dashboard"
          className="text-zinc-400 hover:text-white text-sm"
        >
          ← Back to Dashboard
        </Link>
      </header>

      {/* Main */}
      <div className="max-w-xl mx-auto px-6 py-8">

        <h1 className="text-2xl font-bold mb-2">
          Register a New Shop
        </h1>

        <p className="text-zinc-500 text-sm mb-6">
          Your shop will be reviewed by an admin before it appears publicly.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Cover Image */}
          <div>
            <label className="text-zinc-500 text-xs block mb-2">
              Cover Photo
            </label>

            <div className="flex items-center gap-4">

              <div className="w-24 h-24 bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">

                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-zinc-700 text-2xl">
                    🏢
                  </span>
                )}

              </div>

              <label className="border border-zinc-800 hover:bg-zinc-900 px-4 py-2 rounded-lg text-sm cursor-pointer text-zinc-300">

                Choose Image

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

              </label>

            </div>
          </div>

          {/* Shop Name */}
          <input
            type="text"
            placeholder="Shop Name"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500"
            required
          />

          {/* Description */}
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            rows={3}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500"
          />

          {/* Address */}
          <input
            type="text"
            placeholder="Address"
            value={form.address}
            onChange={(e) => update('address', e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500"
            required
          />

          {/* City + Area */}
          <div className="grid grid-cols-2 gap-3">

            <input
              type="text"
              placeholder="City"
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500"
              required
            />

            <input
              type="text"
              placeholder="Area (optional)"
              value={form.area}
              onChange={(e) => update('area', e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500"
            />

          </div>

          {/* GPS Location */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">

            <div className="flex items-center justify-between gap-4">

              <div>

                <p className="text-sm font-medium">
                  Shop GPS Location
                </p>

                <p className="text-zinc-500 text-xs mt-1">

                  {coords.latitude !== null &&
                  coords.longitude !== null
                    ? `📍 Location set: ${coords.latitude.toFixed(
                        5
                      )}, ${coords.longitude.toFixed(5)}`
                    : 'Stand at your shop and click Use My Location.'}

                </p>

              </div>

              <button
                type="button"
                onClick={handleUseLocation}
                disabled={locating}
                className="border border-zinc-700 hover:bg-zinc-900 disabled:opacity-50 px-4 py-2 rounded-lg text-sm flex-shrink-0"
              >
                {locating
                  ? 'Locating...'
                  : coords.latitude !== null
                  ? 'Update'
                  : 'Use My Location'}
              </button>

            </div>

          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-2 gap-3">

            <input
              type="tel"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500"
              required
            />

            <input
              type="email"
              placeholder="Email (optional)"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500"
            />

          </div>

          {/* Opening + Closing */}
          <div className="grid grid-cols-2 gap-3">

            <div>

              <label className="text-zinc-500 text-xs">
                Opening Time
              </label>

              <input
                type="time"
                value={form.opening_time}
                onChange={(e) =>
                  update('opening_time', e.target.value)
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500"
              />

            </div>

            <div>

              <label className="text-zinc-500 text-xs">
                Closing Time
              </label>

              <input
                type="time"
                value={form.closing_time}
                onChange={(e) =>
                  update('closing_time', e.target.value)
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500"
              />

            </div>

          </div>

          {/* Google Maps Link */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              📍 Google Maps Location
            </label>

            <input
              type="url"
              value={form.google_maps_url}
              onChange={(e) => update('google_maps_url', e.target.value)}
              placeholder="Paste Google Maps link here"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500"
            />

            <p className="text-xs text-zinc-500 mt-2">
              Google Maps → Find your shop → Share → Copy link
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-950/40 border border-red-900 rounded-lg p-3">
              <p className="text-red-400 text-sm">
                {error}
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 py-3 rounded-lg font-medium transition-colors"
          >
            {submitting
              ? 'Submitting...'
              : 'Submit for Approval'}
          </button>

        </form>

      </div>
    </div>
  )
}
