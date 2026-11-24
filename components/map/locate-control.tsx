'use client'

import L from 'leaflet'
import { LocateFixed, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Circle, CircleMarker, useMap } from 'react-leaflet'

type Position = { lat: number; lng: number; accuracy: number }

const ERROR_MESSAGES: Record<number, string> = {
  1: 'Доступ к геолокации запрещён. Разрешите его в настройках браузера.',
  2: 'Не удалось определить местоположение.',
  3: 'Превышено время ожидания. Попробуйте ещё раз.',
}

export function LocateControl() {
  const map = useMap()
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<Position | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (containerRef.current) {
      L.DomEvent.disableClickPropagation(containerRef.current)
      L.DomEvent.disableScrollPropagation(containerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!error) return
    const timer = setTimeout(() => setError(null), 5000)
    return () => clearTimeout(timer)
  }, [error])

  function locate() {
    if (!('geolocation' in navigator)) {
      setError('Ваш браузер не поддерживает геолокацию.')
      return
    }
    setLoading(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const next = { lat: coords.latitude, lng: coords.longitude, accuracy: coords.accuracy }
        setPosition(next)
        setLoading(false)
        map.flyTo([next.lat, next.lng], Math.max(map.getZoom(), 15), { duration: 0.8 })
      },
      (geoError) => {
        setLoading(false)
        setError(ERROR_MESSAGES[geoError.code] ?? ERROR_MESSAGES[2])
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  }

  return (
    <>
      {position && (
        <>
          <Circle
            center={[position.lat, position.lng]}
            radius={position.accuracy}
            interactive={false}
            pathOptions={{ color: '#3b82f6', weight: 1, fillColor: '#3b82f6', fillOpacity: 0.12 }}
          />
          <CircleMarker
            center={[position.lat, position.lng]}
            radius={8}
            interactive={false}
            pathOptions={{ color: '#ffffff', weight: 3, fillColor: '#3b82f6', fillOpacity: 1 }}
          />
        </>
      )}
      <div
        ref={containerRef}
        className="absolute right-2.5 bottom-24 z-[1000] flex items-center gap-2"
      >
        {error && (
          <p
            role="alert"
            className="max-w-60 rounded-xl bg-background px-3 py-2 text-xs font-medium text-foreground shadow-lg"
          >
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={locate}
          disabled={loading}
          aria-label="Показать моё местоположение"
          title="Моё местоположение"
          className="flex size-[34px] items-center justify-center rounded-xl bg-background text-foreground shadow-lg transition-colors hover:bg-muted disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <LocateFixed className={`size-4 ${position ? 'text-primary' : ''}`} aria-hidden="true" />
          )}
        </button>
      </div>
    </>
  )
}
