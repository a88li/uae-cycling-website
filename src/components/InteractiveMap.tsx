'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Custom marker icons for running and cycling
function createRunningIcon() {
  return L.divIcon({
    html: `<div style="width:32px;height:42px;display:flex;flex-direction:column;align-items:center;">
      <div style="width:32px;height:32px;border-radius:50% 50% 50% 0;background:hsl(222.2,47.4%,31.2%);display:flex;align-items:center;justify-content:center;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.3);">
        <span style="transform:rotate(45deg);font-size:14px;">🏃</span>
      </div>
    </div>`,
    className: 'custom-marker',
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  })
}

function createCyclingIcon() {
  return L.divIcon({
    html: `<div style="width:32px;height:42px;display:flex;flex-direction:column;align-items:center;">
      <div style="width:32px;height:32px;border-radius:50% 50% 50% 0;background:#f97316;display:flex;align-items:center;justify-content:center;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.3);">
        <span style="transform:rotate(45deg);font-size:14px;">🚴</span>
      </div>
    </div>`,
    className: 'custom-marker',
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  })
}

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
  type: 'running' | 'cycling'
  amenities?: string[]
}

const amenityIcons: Record<string, { icon: string, nameAr: string, nameEn: string }> = {
  parking: { icon: '🅿️', nameAr: 'مواقف', nameEn: 'Parking' },
  water: { icon: '💧', nameAr: 'مياه شرب', nameEn: 'Water' },
  restroom: { icon: '🚻', nameAr: 'دورات مياه', nameEn: 'Restrooms' },
  cafe: { icon: '☕', nameAr: 'مقهى', nameEn: 'Cafe' },
  rental: { icon: '🚲', nameAr: 'تأجير دراجات', nameEn: 'Rental' },
  shower: { icon: '🚿', nameAr: 'استحمام', nameEn: 'Showers' },
}

const tracks: Track[] = [
  // Running tracks (dedicated running only)
  { id: 'jumeirah_corniche', nameAr: 'كورنيش جميرا', nameEn: 'Jumeirah Corniche Running Track', lat: 25.1550, lng: 55.1980, distance: '14km', difficulty: 'easy', emirate: 'Dubai', type: 'running', amenities: ['parking', 'water', 'restroom', 'shower', 'cafe'] },
  { id: 'marina', nameAr: 'ممشى دبي مارينا', nameEn: 'Dubai Marina Walk', lat: 25.0800, lng: 55.1400, distance: '8.5km', difficulty: 'easy', emirate: 'Dubai', type: 'running', amenities: ['parking', 'restroom', 'cafe'] },
  { id: 'palm_boardwalk', nameAr: 'نخلة جميرا (The Boardwalk)', nameEn: 'Palm Jumeirah Boardwalk', lat: 25.1080, lng: 55.1180, distance: '11km', difficulty: 'easy', emirate: 'Dubai', type: 'running', amenities: ['parking', 'water', 'cafe'] },
  { id: 'ittihad_park', nameAr: 'حديقة الاتحاد', nameEn: 'Al Ittihad Park Running Track', lat: 25.1103, lng: 55.1436, distance: '3.2km', difficulty: 'easy', emirate: 'Dubai', type: 'running', amenities: ['parking', 'water', 'restroom'] },
  { id: 'safa', nameAr: 'حديقة الصفا', nameEn: 'Safa Park Running Track', lat: 25.1852, lng: 55.2466, distance: '1.5km', difficulty: 'easy', emirate: 'Dubai', type: 'running', amenities: ['parking', 'water', 'restroom'] },
  { id: 'zabeel', nameAr: 'حديقة زعبيل', nameEn: 'Zabeel Park Jogging Track', lat: 25.2370, lng: 55.2986, distance: '2.5km', difficulty: 'easy', emirate: 'Dubai', type: 'running', amenities: ['parking', 'water', 'restroom', 'cafe'] },
  { id: 'barsha', nameAr: 'حديقة البرشاء 2', nameEn: 'Al Barsha Pond Park Running Track', lat: 25.1086, lng: 55.1973, distance: '1.5km', difficulty: 'easy', emirate: 'Dubai', type: 'running', amenities: ['parking', 'water', 'restroom'] },
  { id: 'mushrif_run', nameAr: 'حديقة مشرف', nameEn: 'Mushrif Park Running Trails', lat: 25.2250, lng: 55.4506, distance: '13km+', difficulty: 'easy', emirate: 'Dubai', type: 'running', amenities: ['parking', 'water', 'restroom', 'cafe'] },
  { id: 'jbr', nameAr: 'ممشى جي بي آر (The Beach)', nameEn: 'The Beach JBR Running Track', lat: 25.0759, lng: 55.1312, distance: '2km', difficulty: 'easy', emirate: 'Dubai', type: 'running', amenities: ['parking', 'water', 'restroom', 'shower', 'cafe'] },
  { id: 'water_canal', nameAr: 'قناة دبي المائية', nameEn: 'Dubai Water Canal Running Path', lat: 25.1870, lng: 55.2650, distance: '3.2km', difficulty: 'easy', emirate: 'Dubai', type: 'running', amenities: ['parking', 'water', 'restroom', 'cafe'] },
  { id: 'corniche_abu', nameAr: 'كورنيش أبوظبي', nameEn: 'Abu Dhabi Corniche Running', lat: 24.4721, lng: 54.3358, distance: '8km', difficulty: 'easy', emirate: 'Abu Dhabi', type: 'running', amenities: ['parking', 'water', 'restroom', 'cafe', 'rental'] },
  { id: 'hudayriat_run', nameAr: 'جزيرة الحديريات', nameEn: 'Al Hudayriyat Running Track', lat: 24.4174, lng: 54.3487, distance: '5km - 10km', difficulty: 'easy', emirate: 'Abu Dhabi', type: 'running', amenities: ['parking', 'water', 'restroom', 'shower', 'cafe'] },
  { id: 'yas_run', nameAr: 'حلبة مرسى ياس (تدرب في ياس)', nameEn: 'Yas Marina Circuit (TrainYAS)', lat: 24.4672, lng: 54.6031, distance: '5.5km lap', difficulty: 'easy', emirate: 'Abu Dhabi', type: 'running', amenities: ['parking', 'water', 'restroom', 'shower'] },
  { id: 'umm_al_emarat', nameAr: 'حديقة أم الإمارات', nameEn: 'Umm Al Emarat Park Running Track', lat: 24.4538, lng: 54.3891, distance: '1.2km', difficulty: 'easy', emirate: 'Abu Dhabi', type: 'running', amenities: ['parking', 'water', 'restroom', 'cafe'] },
  { id: 'eastern_mangroves', nameAr: 'ممشى القرم الشرقي', nameEn: 'Eastern Mangroves Promenade', lat: 24.4425, lng: 54.4365, distance: '3km', difficulty: 'easy', emirate: 'Abu Dhabi', type: 'running', amenities: ['parking', 'water', 'restroom', 'cafe'] },
  { id: 'szgm_jogging', nameAr: 'ممشى جامع الشيخ زايد الكبير', nameEn: 'Sheikh Zayed Grand Mosque Jogging Trail', lat: 24.4130, lng: 54.4920, distance: '3km', difficulty: 'easy', emirate: 'Abu Dhabi', type: 'running', amenities: ['parking', 'water', 'restroom'] },
  { id: 'masdar', nameAr: 'مدينة مصدر', nameEn: 'Masdar City Running Track', lat: 24.4205, lng: 54.6134, distance: '5.6km', difficulty: 'easy', emirate: 'Abu Dhabi', type: 'running', amenities: ['parking', 'water', 'restroom', 'cafe'] },
  { id: 'majaz', nameAr: 'واجهة المجاز المائي', nameEn: 'Al Majaz Waterfront Running Track', lat: 25.3272, lng: 55.3876, distance: '750m', difficulty: 'easy', emirate: 'Sharjah', type: 'running', amenities: ['parking', 'water', 'restroom', 'cafe'] },
  { id: 'khalid_lagoon', nameAr: 'كورنيش البحيرة', nameEn: 'Khalid Lagoon Corniche Running Track', lat: 25.3180, lng: 55.3780, distance: '6.5km', difficulty: 'easy', emirate: 'Sharjah', type: 'running', amenities: ['parking', 'water', 'restroom', 'cafe'] },
  { id: 'shj_corniche', nameAr: 'كورنيش الشارقة', nameEn: 'Sharjah Corniche Running Track', lat: 25.3550, lng: 55.3900, distance: '5km', difficulty: 'easy', emirate: 'Sharjah', type: 'running', amenities: ['parking', 'water', 'restroom', 'cafe'] },
  { id: 'ittihad_shj', nameAr: 'حديقة الاتحاد', nameEn: 'Al Ittihad Square Park Jogging Track', lat: 25.3400, lng: 55.3850, distance: '2km', difficulty: 'easy', emirate: 'Sharjah', type: 'running', amenities: ['parking', 'water', 'restroom'] },
  { id: 'shj_national_park', nameAr: 'حديقة الشارقة الوطنية', nameEn: 'Sharjah National Park Running Track', lat: 25.3080, lng: 55.4400, distance: '5.2km', difficulty: 'easy', emirate: 'Sharjah', type: 'running', amenities: ['parking', 'water', 'restroom', 'cafe'] },
  { id: 'masaar_run', nameAr: 'مسار الجادة (مسار)', nameEn: 'Masaar Track Al Jada Running', lat: 25.2600, lng: 55.6100, distance: '6.6km', difficulty: 'easy', emirate: 'Sharjah', type: 'running', amenities: ['parking', 'water', 'restroom', 'cafe'] },
  { id: 'hamriyah_beach', nameAr: 'مسار شاطئ الحمرية', nameEn: 'Al Hamriyah Beach Running Track', lat: 25.4700, lng: 55.5100, distance: '1.3km', difficulty: 'easy', emirate: 'Sharjah', type: 'running', amenities: ['parking', 'water', 'restroom', 'shower'] },
  { id: 'kalba_corniche', nameAr: 'كورنيش شاطئ كلباء', nameEn: 'Kalba Beach Corniche Running Track', lat: 25.0600, lng: 56.3500, distance: '7.6km', difficulty: 'easy', emirate: 'Sharjah', type: 'running', amenities: ['parking', 'water', 'restroom', 'cafe'] },
  { id: 'wadi_shees', nameAr: 'مسار وادي شيص', nameEn: 'Wadi Shees Nature Trail', lat: 25.0650, lng: 56.2700, distance: '6km', difficulty: 'medium', emirate: 'Sharjah', type: 'running', amenities: ['parking', 'restroom'] },
  { id: 'al_rafisah', nameAr: 'مسار الرفيصة الجبلي', nameEn: 'Al Rafisah Mountain Trail', lat: 25.0550, lng: 56.2400, distance: '4km', difficulty: 'medium', emirate: 'Sharjah', type: 'running', amenities: ['parking', 'water', 'restroom', 'cafe'] },
  { id: 'al_rabi', nameAr: 'مسار الربي الجبلي', nameEn: 'Al Rabi Mountain Trail', lat: 25.0500, lng: 56.3300, distance: '5.3km', difficulty: 'medium', emirate: 'Sharjah', type: 'running', amenities: ['parking', 'restroom', 'cafe'] },
  { id: 'fossil_rock', nameAr: 'مسار صخرة الأحفور (ملية)', nameEn: 'Fossil Rock Mleiha Trail', lat: 24.8800, lng: 55.8700, distance: '6km', difficulty: 'medium', emirate: 'Sharjah', type: 'running', amenities: ['parking', 'water', 'restroom', 'cafe'] },
  { id: 'marjan', nameAr: 'جزيرة مريجان', nameEn: 'Marjan Island Corniche Running Track', lat: 25.6826, lng: 55.7454, distance: '2km', difficulty: 'easy', emirate: 'Ras Al Khaimah', type: 'running', amenities: ['parking', 'water', 'restroom', 'cafe'] },
  { id: 'al_qawasim', nameAr: 'كورنيش القواسم', nameEn: 'Al Qawasim Corniche Running Track', lat: 25.7910, lng: 55.9520, distance: '3km', difficulty: 'easy', emirate: 'Ras Al Khaimah', type: 'running', amenities: ['parking', 'water', 'restroom', 'cafe'] },
  { id: 'ajman_corniche', nameAr: 'كورنيش عجمان', nameEn: 'Ajman Corniche Running Track', lat: 25.4191, lng: 55.4443, distance: '4km', difficulty: 'easy', emirate: 'Ajman', type: 'running', amenities: ['parking', 'water', 'restroom', 'cafe'] },
  { id: 'fujairah_corniche', nameAr: 'كورنيش الفجيرة', nameEn: 'Fujairah Corniche Running Track', lat: 25.1288, lng: 56.3266, distance: '3km', difficulty: 'easy', emirate: 'Fujairah', type: 'running', amenities: ['parking', 'water', 'restroom', 'cafe'] },
  { id: 'jebel_jais', nameAr: 'جبل جيس', nameEn: 'Jebel Jais Trail Run', lat: 25.9376, lng: 56.1312, distance: '10km+', difficulty: 'hard', emirate: 'Ras Al Khaimah', type: 'running', amenities: ['parking', 'restroom', 'cafe'] },
  { id: 'jebel_hafeet', nameAr: 'جبل حفيت', nameEn: 'Jebel Hafeet Trail Run', lat: 24.0583, lng: 55.7769, distance: '12km', difficulty: 'hard', emirate: 'Abu Dhabi', type: 'running', amenities: ['parking', 'restroom', 'cafe'] },
  { id: 'hatta', nameAr: 'حتا تريل', nameEn: 'Hatta Trail Run', lat: 24.7952, lng: 56.1158, distance: '10km+', difficulty: 'hard', emirate: 'Dubai', type: 'running', amenities: ['parking', 'water', 'restroom', 'cafe', 'rental'] },
  { id: 'wadi_shawka', nameAr: 'وادي شوكة', nameEn: 'Wadi Shawka Trail Run', lat: 25.1040, lng: 56.0470, distance: '6-10km', difficulty: 'medium', emirate: 'Ras Al Khaimah', type: 'running', amenities: ['parking', 'restroom'] },
  { id: 'masfout', nameAr: 'مصفوت', nameEn: 'Masfout Mountain Trail', lat: 24.8400, lng: 56.0520, distance: '5-10km', difficulty: 'hard', emirate: 'Ajman', type: 'running', amenities: ['parking', 'restroom', 'cafe'] },
  { id: 'wadi_wurayah', nameAr: 'وادي الوريعة', nameEn: 'Wadi Wurayah Trail', lat: 25.4000, lng: 56.2500, distance: '7km', difficulty: 'medium', emirate: 'Fujairah', type: 'running', amenities: ['parking'] },
  // Cycling tracks
  { id: 'al_qudra_cycle', nameAr: 'مسار القدرة للدراجات', nameEn: 'Al Qudra Cycle Track', lat: 24.83, lng: 55.33, distance: '18-86km', difficulty: 'medium', emirate: 'Dubai', type: 'cycling', amenities: ['parking', 'water', 'restroom', 'cafe', 'rental'] },
  { id: 'nad_al_sheba', nameAr: 'ند الشبا للدراجات', nameEn: 'Nad Al Sheba Cycle Park', lat: 25.16, lng: 55.35, distance: '4-8km', difficulty: 'easy', emirate: 'Dubai', type: 'cycling', amenities: ['parking', 'water', 'restroom', 'shower', 'cafe'] },
  { id: 'autodrome', nameAr: 'دبي أوتودروم', nameEn: 'Dubai Autodrome', lat: 25.05, lng: 55.24, distance: '4.5km', difficulty: 'medium', emirate: 'Dubai', type: 'cycling', amenities: ['parking', 'water', 'restroom'] },
  { id: 'dubai_water_canal_cycle', nameAr: 'خور دبي للدراجات', nameEn: 'Dubai Water Canal Cycling', lat: 25.19, lng: 55.25, distance: '8km', difficulty: 'easy', emirate: 'Dubai', type: 'cycling', amenities: ['parking', 'water', 'restroom', 'cafe', 'rental'] },
  { id: 'mushrif_mtb', nameAr: 'حديقة مشرف للدراجات', nameEn: 'Mushrif Park MTB', lat: 25.21, lng: 55.45, distance: '13km', difficulty: 'easy', emirate: 'Dubai', type: 'cycling', amenities: ['parking', 'water', 'restroom', 'cafe', 'rental'] },
  { id: 'corniche_cycle', nameAr: 'كورنيش أبوظبي للدراجات', nameEn: 'Abu Dhabi Corniche Cycling', lat: 24.47, lng: 54.34, distance: '12km', difficulty: 'easy', emirate: 'Abu Dhabi', type: 'cycling', amenities: ['parking', 'water', 'restroom', 'cafe', 'rental'] },
  { id: 'hudayriat_cycle', nameAr: 'جزيرة الحديريات للدراجات', nameEn: 'Al Hudayriat Island Cycling', lat: 24.43, lng: 54.35, distance: '5-15km', difficulty: 'easy', emirate: 'Abu Dhabi', type: 'cycling', amenities: ['parking', 'water', 'restroom', 'shower', 'cafe', 'rental'] },
  { id: 'yas_cycle', nameAr: 'حلبة ياس مارينا', nameEn: 'Yas Marina Circuit TrainYAS', lat: 24.47, lng: 54.60, distance: '5.5km', difficulty: 'easy', emirate: 'Abu Dhabi', type: 'cycling', amenities: ['parking', 'water', 'restroom', 'shower', 'rental'] },
  { id: 'masdar_cycle', nameAr: 'مدينة مصدر للدراجات', nameEn: 'Masdar City Cycling', lat: 24.43, lng: 54.61, distance: '5.6km', difficulty: 'easy', emirate: 'Abu Dhabi', type: 'cycling', amenities: ['parking', 'water', 'restroom', 'cafe'] },
  { id: 'wathba_cycle', nameAr: 'الوثبة للدراجات', nameEn: 'Al Wathba Cycle Track', lat: 24.16, lng: 54.73, distance: '8-30km', difficulty: 'medium', emirate: 'Abu Dhabi', type: 'cycling', amenities: ['parking', 'water', 'restroom'] },
  { id: 'masaar_cycle', nameAr: 'مسار الدراجات', nameEn: 'Masaar Cycling Track', lat: 25.26, lng: 55.61, distance: '6.6km', difficulty: 'easy', emirate: 'Sharjah', type: 'cycling', amenities: ['parking', 'water', 'restroom', 'cafe'] },
  { id: 'university_cycle', nameAr: 'مدينة الشارقة الجامعية', nameEn: 'University City Cycling', lat: 25.31, lng: 55.48, distance: '7km', difficulty: 'easy', emirate: 'Sharjah', type: 'cycling', amenities: ['parking', 'water', 'restroom'] },
  { id: 'batayeh_cycle', nameAr: 'مسار البطائح للدراجات', nameEn: 'Al Batayeh Bicycle Track', lat: 25.2033, lng: 55.6573, distance: '24km', difficulty: 'easy', emirate: 'Sharjah', type: 'cycling', amenities: ['parking', 'water', 'restroom', 'cafe'] },
  { id: 'marjan_cycle', nameAr: 'جزيرة مريجان للدراجات', nameEn: 'Marjan Island Cycling', lat: 25.68, lng: 55.74, distance: '3.5km', difficulty: 'easy', emirate: 'Ras Al Khaimah', type: 'cycling', amenities: ['parking', 'water', 'restroom', 'cafe', 'rental'] },
  { id: 'khorfakkan_cycle', nameAr: 'طريق خور فكان الساحلي', nameEn: 'Khor Fakkan Coastal Road Cycling', lat: 25.37, lng: 56.36, distance: '21km', difficulty: 'medium', emirate: 'Fujairah', type: 'cycling', amenities: ['parking', 'water', 'restroom', 'cafe'] },
  { id: 'ajman_cycle', nameAr: 'مسارات عجمان للدراجات', nameEn: 'Ajman Cycling Tracks', lat: 25.41, lng: 55.43, distance: '4,000km+', difficulty: 'easy', emirate: 'Ajman', type: 'cycling', amenities: ['parking', 'water', 'restroom', 'cafe'] },
  { id: 'jebel_jais_cycle', nameAr: 'جبل جيس للدراجات', nameEn: 'Jebel Jais Climb', lat: 25.93, lng: 56.12, distance: '21km', difficulty: 'hard', emirate: 'Ras Al Khaimah', type: 'cycling', amenities: ['parking', 'restroom', 'cafe'] },
  { id: 'jebel_hafeet_cycle', nameAr: 'جبل حفيت للدراجات', nameEn: 'Jebel Hafeet Climb', lat: 24.08, lng: 55.77, distance: '10.6km', difficulty: 'hard', emirate: 'Abu Dhabi', type: 'cycling', amenities: ['parking', 'restroom', 'cafe'] },
  { id: 'hatta_mtb', nameAr: 'حتا للدراجات الجبلية', nameEn: 'Hatta MTB Trail', lat: 24.8153, lng: 56.1597, distance: '52km', difficulty: 'hard', emirate: 'Dubai', type: 'cycling', amenities: ['parking', 'water', 'restroom', 'rental', 'cafe', 'shower'] },
]

// Component to fly map to filtered markers
function MapFlyTo({ filteredTracks }: { filteredTracks: Track[] }) {
  const map = useMap()

  useEffect(() => {
    if (filteredTracks.length === 0) return

    if (filteredTracks.length === 1) {
      map.flyTo([filteredTracks[0].lat, filteredTracks[0].lng], 12, { duration: 1 })
      return
    }

    const bounds = L.latLngBounds(filteredTracks.map(t => [t.lat, t.lng]))
    map.flyToBounds(bounds, { padding: [50, 50], duration: 1 })
  }, [filteredTracks, map])

  return null
}

// Component to handle map resize on fullscreen toggle
function MapResizer({ isFullscreen }: { isFullscreen: boolean }) {
  const map = useMap()
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize()
    }, 300) // Wait for CSS transition
    return () => clearTimeout(timer)
  }, [isFullscreen, map])
  return null
}

export default function InteractiveMap({ lang }: { lang: 'ar' | 'en' }) {
  const [mounted, setMounted] = useState(false)
  const [runningIcon, setRunningIcon] = useState<L.DivIcon | null>(null)
  const [cyclingIcon, setCyclingIcon] = useState<L.DivIcon | null>(null)
  const [typeFilter, setTypeFilter] = useState<'all' | 'running' | 'cycling'>('all')
  const [emirateFilter, setEmirateFilter] = useState<string>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMapVisible, setIsMapVisible] = useState(true)

  useEffect(() => {
    setRunningIcon(createRunningIcon())
    setCyclingIcon(createCyclingIcon())
    setMounted(true)
  }, [])

  const filteredTracks = tracks.filter(track => {
    if (typeFilter !== 'all' && track.type !== typeFilter) return false
    if (emirateFilter !== 'all' && track.emirate !== emirateFilter) return false
    if (difficultyFilter !== 'all' && track.difficulty !== difficultyFilter) return false
    return true
  })

  if (!mounted || !runningIcon || !cyclingIcon) return <div className="h-[500px] w-full bg-muted animate-pulse rounded-2xl flex items-center justify-center">Loading Map...</div>

  const emirates = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ras Al Khaimah', 'Ajman', 'Fujairah']

  const emirateNamesAr: Record<string, string> = {
    'Dubai': 'دبي',
    'Abu Dhabi': 'أبوظبي',
    'Sharjah': 'الشارقة',
    'Ras Al Khaimah': 'رأس الخيمة',
    'Ajman': 'عجمان',
    'Fujairah': 'الفجيرة',
  }

  const difficultyNamesAr: Record<string, string> = {
    'easy': 'سهل',
    'medium': 'متوسط',
    'hard': 'متقدم',
  }

  return (
    <div className="w-full space-y-4">
      {/* Global Header for Map & Filters */}
      <div className="bg-card/80 backdrop-blur-md rounded-2xl border border-border/50 p-4 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            {lang === 'ar' ? 'الخريطة وتصفية المسارات' : 'Map & Route Filters'}
          </h3>
          <button
            onClick={() => setIsMapVisible(!isMapVisible)}
            className="text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-md"
          >
            {isMapVisible ? (lang === 'ar' ? 'إخفاء ▴' : 'Hide ▴') : (lang === 'ar' ? 'إظهار ▾' : 'Show ▾')}
          </button>
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {lang === 'ar' ? `${filteredTracks.length} مسار` : `${filteredTracks.length} routes`}
        </span>
      </div>

      {/* Collapsible Section (Filters + Map) */}
      <div className={`transition-all duration-500 origin-top overflow-hidden flex flex-col gap-4 ${isMapVisible ? 'h-auto opacity-100 scale-y-100' : 'h-0 opacity-0 scale-y-0'}`}>
        
        {/* Filter Controls */}
        <div className="bg-card/80 backdrop-blur-md rounded-2xl border border-border/50 p-4 space-y-3 shadow-lg">
          {/* Type Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              {lang === 'ar' ? 'النوع' : 'Type'}
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${
                  typeFilter === 'all'
                    ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                    : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:border-primary/30'
                }`}
              >
                {lang === 'ar' ? 'الكل' : 'All'}
              </button>
              <button
                onClick={() => setTypeFilter('running')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border flex items-center gap-1 ${
                  typeFilter === 'running'
                    ? 'bg-slate-700 text-white border-slate-700 shadow-md scale-105'
                    : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:border-slate-400/30'
                }`}
              >
                🏃 {lang === 'ar' ? 'جري' : 'Running'}
              </button>
              <button
                onClick={() => setTypeFilter('cycling')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border flex items-center gap-1 ${
                  typeFilter === 'cycling'
                    ? 'bg-orange-500 text-white border-orange-500 shadow-md scale-105'
                    : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:border-orange-400/30'
                }`}
              >
                🚴 {lang === 'ar' ? 'دراجات' : 'Cycling'}
              </button>
            </div>
          </div>

          {/* Emirate Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              {lang === 'ar' ? 'الإمارة' : 'Emirate'}
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setEmirateFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${
                  emirateFilter === 'all'
                    ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                    : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:border-primary/30'
                }`}
              >
                {lang === 'ar' ? 'الكل' : 'All'}
              </button>
              {emirates.map(em => (
                <button
                  key={em}
                  onClick={() => setEmirateFilter(em)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${
                    emirateFilter === em
                      ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                      : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:border-primary/30'
                  }`}
                >
                  {lang === 'ar' ? emirateNamesAr[em] : em}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              {lang === 'ar' ? 'الصعوبة' : 'Difficulty'}
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setDifficultyFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${
                  difficultyFilter === 'all'
                    ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                    : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:border-primary/30'
                }`}
              >
                {lang === 'ar' ? 'الكل' : 'All'}
              </button>
              <button
                onClick={() => setDifficultyFilter('easy')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border flex items-center gap-1 ${
                  difficultyFilter === 'easy'
                    ? 'bg-green-600 text-white border-green-600 shadow-md scale-105'
                    : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:border-green-400/30'
                }`}
              >
                🟢 {lang === 'ar' ? 'سهل' : 'Easy'}
              </button>
              <button
                onClick={() => setDifficultyFilter('medium')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border flex items-center gap-1 ${
                  difficultyFilter === 'medium'
                    ? 'bg-orange-500 text-white border-orange-500 shadow-md scale-105'
                    : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:border-orange-400/30'
                }`}
              >
                🟠 {lang === 'ar' ? 'متوسط' : 'Medium'}
              </button>
              <button
                onClick={() => setDifficultyFilter('hard')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border flex items-center gap-1 ${
                  difficultyFilter === 'hard'
                    ? 'bg-red-600 text-white border-red-600 shadow-md scale-105'
                    : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:border-red-400/30'
                }`}
              >
                🔴 {lang === 'ar' ? 'متقدم' : 'Advanced'}
              </button>
            </div>
          </div>

          {/* Reset button */}
          {(typeFilter !== 'all' || emirateFilter !== 'all' || difficultyFilter !== 'all') && (
            <button
              onClick={() => { setTypeFilter('all'); setEmirateFilter('all'); setDifficultyFilter('all') }}
              className="text-xs text-primary hover:text-primary/80 font-bold underline underline-offset-2 transition-colors"
            >
              {lang === 'ar' ? '↻ إعادة تعيين الفلاتر' : '↻ Reset Filters'}
            </button>
          )}
        </div>

        {/* Map */}
        <div className={`w-full rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-border relative z-0 transition-all duration-300 flex-shrink-0 ${isFullscreen ? 'fixed inset-0 z-[9999] h-[100dvh] w-[100dvw] rounded-none border-none' : 'h-[500px]'}`}>
          
          {/* Fullscreen Toggle Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`absolute z-[1000] bg-background/90 hover:bg-background text-foreground p-2 rounded-xl shadow-lg border border-border/50 transition-colors ${lang === 'ar' ? 'bottom-4 right-4' : 'bottom-4 right-4'}`}
            style={{ bottom: '16px', right: '16px' }}
            title={lang === 'ar' ? (isFullscreen ? 'تصغير' : 'تكبير الخريطة') : (isFullscreen ? 'Exit Fullscreen' : 'Fullscreen')}
          >
            {isFullscreen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
            )}
          </button>

          {isMapVisible && (
            <MapContainer 
              center={[24.8, 55.1]} 
              zoom={8} 
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
            >
              <MapResizer isFullscreen={isFullscreen} />
              <LayersControl position="topright">
                <LayersControl.BaseLayer checked name={lang === 'ar' ? 'خريطة الشوارع (OSM)' : 'Street Map (OSM)'}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name={lang === 'ar' ? 'القمر الصناعي (Satellite)' : 'Satellite Map'}>
                  <TileLayer
                    attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  />
                </LayersControl.BaseLayer>
              </LayersControl>

              <MapFlyTo filteredTracks={filteredTracks} />
              
              {filteredTracks.map((track) => (
                <Marker 
                  key={track.id} 
                  position={[track.lat, track.lng]}
                  icon={track.type === 'cycling' ? cyclingIcon : runningIcon}
                  eventHandlers={{
                    click: () => {
                      setSelectedTrackId(track.id)
                    },
                  }}
                >
                  <Popup className="custom-popup">
                    <div className={`text-right ${lang === 'en' ? 'text-left' : ''} p-1`}>
                      {/* Type Badge */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${track.type === 'cycling' ? 'bg-orange-100 text-orange-700 border border-orange-300' : 'bg-slate-100 text-slate-700 border border-slate-300'}`}>
                          {track.type === 'cycling' ? (
                            <>
                              <span>🚴</span>
                              {lang === 'ar' ? 'الدراجات' : 'Cycling'}
                            </>
                          ) : (
                            <>
                              <span>🏃</span>
                              {lang === 'ar' ? 'الجري' : 'Running'}
                            </>
                          )}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          track.difficulty === 'hard' ? 'bg-red-100 text-red-700 border border-red-300' :
                          track.difficulty === 'medium' ? 'bg-orange-100 text-orange-700 border border-orange-300' :
                          'bg-green-100 text-green-700 border border-green-300'
                        }`}>
                          {track.difficulty === 'hard' ? '🔴' : track.difficulty === 'medium' ? '🟠' : '🟢'}
                          {lang === 'ar' ? difficultyNamesAr[track.difficulty] : track.difficulty.charAt(0).toUpperCase() + track.difficulty.slice(1)}
                        </span>
                      </div>
                      <h3 className={`font-bold text-base mb-1 ${track.type === 'cycling' ? 'text-[#f97316]' : 'text-primary'}`}>
                        {lang === 'ar' ? track.nameAr : track.nameEn}
                      </h3>
                      <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span>{track.type === 'cycling' ? '🚴' : '🏃'}</span>
                          <span>{lang === 'ar' ? `المسافة: ${track.distance}` : `Distance: ${track.distance}`}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>📍</span>
                          <span>
                            {lang === 'ar' ? `الإمارة: ${emirateNamesAr[track.emirate] || track.emirate}` : `Emirate: ${track.emirate}`}
                          </span>
                        </div>
                        {track.amenities && track.amenities.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-border/50">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                              {lang === 'ar' ? 'المرافق والخدمات' : 'Amenities'}
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {track.amenities.map(am => (
                                <span 
                                  key={am} 
                                  title={lang === 'ar' ? amenityIcons[am].nameAr : amenityIcons[am].nameEn}
                                  className="inline-flex items-center justify-center size-6 rounded bg-muted/50 border border-border shadow-sm text-xs hover:scale-110 transition-transform cursor-help"
                                >
                                  {amenityIcons[am].icon}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <a 
                          href={`https://www.google.com/maps/search/${encodeURIComponent(track.nameEn + ' ' + track.emirate)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`mt-2 block text-white text-center py-1.5 rounded-md text-xs font-bold transition-colors ${track.type === 'cycling' ? 'bg-[#f97316] hover:bg-[#ea580c]' : 'bg-primary hover:bg-primary/90'}`}
                        >
                          {lang === 'ar' ? 'اذهب الآن' : 'Go Now'}
                        </a>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 z-[1000] bg-background/90 backdrop-blur-md rounded-xl p-3 shadow-lg border border-border/50">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center justify-center size-5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                  <span className="text-[10px]">🏃</span>
                </span>
                <span className="font-medium">{lang === 'ar' ? 'جري' : 'Running'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center justify-center size-5 rounded-full bg-orange-100 text-orange-700 border border-orange-300">
                  <span className="text-[10px]">🚴</span>
                </span>
                <span className="font-medium">{lang === 'ar' ? 'دراجات' : 'Cycling'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
