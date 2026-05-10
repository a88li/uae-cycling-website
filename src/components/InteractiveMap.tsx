'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Bike } from 'lucide-react'

// Fix for default marker icons in Leaflet + Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})



L.Marker.prototype.options.icon = DefaultIcon

interface Track {
  id: string
  nameAr: string
  nameEn: string
  lat: number
  lng: number
  distance: string
  difficulty: 'easy' | 'medium' | 'hard'
  emirate: string
}

const tracks: Track[] = [
  { id: 'qudra', nameAr: 'مسار القدرة', nameEn: 'Al Qudra Cycle Track', lat: 24.8499, lng: 55.3462, distance: '86km+', difficulty: 'medium', emirate: 'Dubai' },
  { id: 'hudayriat', nameAr: 'جزيرة الحديريات', nameEn: 'Hudayriyat Island', lat: 24.4174, lng: 54.3477, distance: '5km - 10km', difficulty: 'easy', emirate: 'Abu Dhabi' },
  { id: 'nas', nameAr: 'ند الشبا (ميدان)', nameEn: 'Nad Al Sheba (Meydan)', lat: 25.1489, lng: 55.2864, distance: '4km - 8km', difficulty: 'easy', emirate: 'Dubai' },
  { id: 'wathba', nameAr: 'مسار الوثبة', nameEn: 'Al Wathba Track', lat: 24.1608, lng: 54.7474, distance: '8km - 30km', difficulty: 'medium', emirate: 'Abu Dhabi' },
  { id: 'hatta', nameAr: 'مدخل مسارات حتا (Wadi Hub)', nameEn: 'Hatta MTB Entrance', lat: 24.8153, lng: 56.1597, distance: '50km+', difficulty: 'hard', emirate: 'Dubai' },
  { id: 'mushrif', nameAr: 'حديقة مشرف (MTB)', nameEn: 'Mushrif Park MTB', lat: 25.2187, lng: 55.4567, distance: '20km+', difficulty: 'medium', emirate: 'Dubai' },
  { id: 'jebel_jais', nameAr: 'مدخل جبل جيس', nameEn: 'Jebel Jais Entrance', lat: 25.9531, lng: 56.1842, distance: '30km (Climb)', difficulty: 'hard', emirate: 'Ras Al Khaimah' },
  { id: 'jebel_hafeet', nameAr: 'مدخل جبل حفيت (بداية الصعود)', nameEn: 'Jebel Hafeet Entrance', lat: 24.0586, lng: 55.7775, distance: '12km (Climb)', difficulty: 'hard', emirate: 'Abu Dhabi' },
  { id: 'musaar', nameAr: 'مسار - مسار الشارقة', nameEn: 'Masaar Sharjah', lat: 25.2622125, lng: 55.5923391, distance: '6km - 10km', difficulty: 'easy', emirate: 'Sharjah' },
  { id: 'batayeh', nameAr: 'مسار البطائح للدراجات', nameEn: 'Al Batayeh Bicycle Track', lat: 25.2033, lng: 55.6573, distance: '24km (48km Total)', difficulty: 'medium', emirate: 'Sharjah' },
]



export default function InteractiveMap({ lang }: { lang: 'ar' | 'en' }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="h-[500px] w-full bg-muted animate-pulse rounded-2xl flex items-center justify-center">Loading Map...</div>

  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-border relative z-0">
      <MapContainer 
        center={[24.8, 55.1]} 
        zoom={8} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {tracks.map((track) => (
          <Marker key={track.id} position={[track.lat, track.lng]}>
            <Popup className="custom-popup">
              <div className={`text-right ${lang === 'en' ? 'text-left' : ''} p-1`}>
                <h3 className="font-bold text-primary text-base mb-1">
                  {lang === 'ar' ? track.nameAr : track.nameEn}
                </h3>
                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Bike className="size-4 text-orange-500" />
                    <span>{lang === 'ar' ? `المسافة: ${track.distance}` : `Distance: ${track.distance}`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bike className="size-4 text-blue-500" />
                    <span>
                      {lang === 'ar' ? `الإمارة: ${track.emirate}` : `Emirate: ${track.emirate}`}
                    </span>
                  </div>
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${track.lat},${track.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block bg-primary text-white text-center py-1.5 rounded-md text-xs font-bold hover:bg-primary/90 transition-colors"
                  >
                    {lang === 'ar' ? 'اذهب الآن' : 'Go Now'}
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}


      </MapContainer>
    </div>
  )
}
