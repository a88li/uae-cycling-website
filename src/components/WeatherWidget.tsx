'use client'

import { useEffect, useState } from 'react'
import { Cloud, Sun, Wind, Thermometer, Droplets } from 'lucide-react'

interface WeatherData {
  temp: number
  windSpeed: number
  condition: string
  humidity: number
}

export default function WeatherWidget({ lat, lng, lang }: { lat: number, lng: number, lang: 'ar' | 'en' }) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWeather() {
      try {
        // Using open-meteo.com (Free, no API key required)
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`)
        const data = await res.json()
        
        setWeather({
          temp: Math.round(data.current.temperature_2m),
          windSpeed: Math.round(data.current.wind_speed_10m),
          humidity: data.current.relative_humidity_2m,
          condition: getWeatherCondition(data.current.weather_code)
        })
      } catch (error) {
        console.error("Failed to fetch weather", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()

    // Auto-refresh every 30 minutes
    const interval = setInterval(fetchWeather, 1800000)
    return () => clearInterval(interval)
  }, [lat, lng])

  function getWeatherCondition(code: number) {
    if (code === 0) return lang === 'ar' ? 'صافٍ' : 'Clear'
    if (code <= 3) return lang === 'ar' ? 'غائم جزئياً' : 'Partly Cloudy'
    return lang === 'ar' ? 'غائم' : 'Cloudy'
  }

  if (loading) return <div className="animate-pulse h-10 w-full bg-muted rounded-lg" />
  if (!weather) return null

  const isWindy = weather.windSpeed > 20
  const isHot = weather.temp > 35

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Thermometer className="size-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{lang === 'ar' ? 'درجة الحرارة' : 'Temperature'}</p>
          <p className="text-lg font-bold">{weather.temp}°C</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          <Wind className="size-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{lang === 'ar' ? 'سرعة الرياح' : 'Wind Speed'}</p>
          <p className="text-lg font-bold">{weather.windSpeed} km/h</p>
        </div>
      </div>

      <div className="hidden sm:flex flex-col items-end">
        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isWindy || isHot ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
          {isWindy || isHot ? (lang === 'ar' ? 'غير مثالي للركوب' : 'Not Ideal') : (lang === 'ar' ? 'مثالي للركوب' : 'Ideal for Cycling')}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{weather.condition}</p>
      </div>
    </div>
  )
}
