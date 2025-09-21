'use client'
import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

type Item = { id: string; name: string; type: string; lat: number; lng: number }

function Fit({ items }: { items: Item[] }) {
  const map = useMap()
  useEffect(() => {
    if (!items?.length) return
    const latlngs = items.map(p => [p.lat, p.lng]) as any
    if (latlngs.length === 1) map.setView(latlngs[0], 13)
    else map.fitBounds(latlngs, { padding: [40, 40] })
  }, [items, map])
  return null
}

export default function MapClient({ items }: { items: Item[] }) {
  const center: [number, number] = items?.length ? [items[0].lat, items[0].lng] : [48.8566, 2.3522]
  return (
    <div className="h-[360px] rounded-2xl overflow-hidden border">
      <MapContainer center={center as any} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer url={process.env.NEXT_PUBLIC_MAP_TILES_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'} />
        <Fit items={items} />
        {items?.map(item => (
          <Marker key={item.id} position={[item.lat, item.lng]}>
            <Popup>
              <b>{item.name}</b><br />
              {item.type}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}