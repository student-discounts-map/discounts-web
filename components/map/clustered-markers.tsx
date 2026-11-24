'use client'

import L from 'leaflet'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Marker, useMap, useMapEvents } from 'react-leaflet'
import Supercluster, { type ClusterProperties } from 'supercluster'
import type { Place } from '@/lib/places'

type ClusteredMarkersProps = {
  places: Place[]
  selectedId: string | null
  onSelect: (id: string) => void
}

type PlaceProps = { placeId: string }

function createMarkerIcon(discount: string, active: boolean) {
  return L.divIcon({
    className: '',
    iconSize: [64, 40],
    iconAnchor: [32, 40],
    html: `<div class="discount-marker${active ? ' is-active' : ''}"><span>${discount}</span></div>`,
  })
}

function createClusterIcon(count: number, containsSelected: boolean) {
  const size = count < 10 ? 40 : count < 50 ? 48 : 56
  return L.divIcon({
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div class="cluster-marker${containsSelected ? ' is-active' : ''}" style="width:${size}px;height:${size}px"><span>${count}</span></div>`,
  })
}

export function ClusteredMarkers({ places, selectedId, onSelect }: ClusteredMarkersProps) {
  const map = useMap()
  const [view, setView] = useState(() => ({ bounds: map.getBounds(), zoom: map.getZoom() }))

  const updateView = useCallback(() => {
    setView({ bounds: map.getBounds(), zoom: map.getZoom() })
  }, [map])

  useMapEvents({ moveend: updateView, zoomend: updateView })
  useEffect(updateView, [updateView])

  const index = useMemo(() => {
    const cluster = new Supercluster<PlaceProps>({ radius: 64, maxZoom: 16 })
    cluster.load(
      places.map((place) => {
        const [lat, lng] = place.coords as [number, number]
        return {
          type: 'Feature' as const,
          properties: { placeId: place.id },
          geometry: { type: 'Point' as const, coordinates: [lng, lat] },
        }
      }),
    )
    return cluster
  }, [places])

  const placesById = useMemo(() => new Map(places.map((place) => [place.id, place])), [places])

  const { bounds, zoom } = view
  const clusters = index.getClusters(
    [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
    Math.round(zoom),
  )

  return (
    <>
      {clusters.map((feature) => {
        const [lng, lat] = feature.geometry.coordinates
        const props = feature.properties as ClusterProperties | PlaceProps

        if ('cluster' in props && props.cluster) {
          const clusterId = props.cluster_id
          const leaves = index.getLeaves(clusterId, Infinity)
          const containsSelected = leaves.some((leaf) => leaf.properties.placeId === selectedId)
          return (
            <Marker
              key={`cluster-${clusterId}`}
              position={[lat, lng]}
              icon={createClusterIcon(props.point_count, containsSelected)}
              zIndexOffset={containsSelected ? 1000 : 500}
              title={`${props.point_count} заведений рядом — приблизить`}
              eventHandlers={{
                click: () => {
                  const nextZoom = Math.min(index.getClusterExpansionZoom(clusterId), 18)
                  map.flyTo([lat, lng], nextZoom, { duration: 0.6 })
                },
              }}
            />
          )
        }

        const place = placesById.get((props as PlaceProps).placeId)
        if (!place) return null
        const active = place.id === selectedId
        return (
          <Marker
            key={place.id}
            position={place.coords}
            icon={createMarkerIcon(place.discount, active)}
            zIndexOffset={active ? 1000 : 0}
            title={place.name}
            eventHandlers={{ click: () => onSelect(place.id) }}
          />
        )
      })}
    </>
  )
}
