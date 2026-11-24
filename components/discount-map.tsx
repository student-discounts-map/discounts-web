'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useMemo } from 'react'
import { AttributionControl, MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet'
import { MAP_CENTER, type Place } from '@/lib/places'
import { ClusteredMarkers } from '@/components/map/clustered-markers'
import { LocateControl } from '@/components/map/locate-control'

type DiscountMapProps = {
  places: Place[]
  selectedId: string | null
  focusNonce: number
  onSelect: (id: string) => void
}

function FlyToSelected({ place, focusNonce }: { place: Place | undefined; focusNonce: number }) {
  const map = useMap()
  useEffect(() => {
    if (place) {
      const zoom = focusNonce > 0 ? 16 : Math.max(map.getZoom(), 14)
      map.flyTo(place.coords as L.LatLngExpression, zoom, { duration: 0.8 })
    }
  }, [map, place, focusNonce])
  return null
}

export default function DiscountMap({ places, selectedId, focusNonce, onSelect }: DiscountMapProps) {
  const selectedPlace = useMemo(
    () => places.find((place) => place.id === selectedId),
    [places, selectedId],
  )

  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={13}
      zoomControl={false}
      attributionControl={false}
      className="h-full w-full"
      aria-label="Карта заведений со скидками"
    >
      <AttributionControl position="bottomright" prefix={false} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="map-tiles"
      />
      <ZoomControl position="bottomright" />
      <LocateControl />
      <ClusteredMarkers places={places} selectedId={selectedId} onSelect={onSelect} />
      <FlyToSelected place={selectedPlace} focusNonce={focusNonce} />
    </MapContainer>
  )
}
