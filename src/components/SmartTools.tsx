'use client'

import { useState, useEffect } from 'react'
import { Calculator, Zap, Droplets } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface WeatherStats {
  temp: number
  wind: number
}

export default function SmartTools({ lang, weather }: { lang: 'ar' | 'en', weather: WeatherStats }) {
  const [weight, setWeight] = useState(70)
  const [distance, setDistance] = useState(30)
  const [speed, setSpeed] = useState(25)
  const [calories, setCalories] = useState(0)
  const [water, setWater] = useState(0)

  useEffect(() => {
    // Calculator Logic
    const timeInHours = distance / speed
    let met = 4.0
    if (speed >= 30.6) met = 15.8
    else if (speed >= 25.7) met = 12.0
    else if (speed >= 22.5) met = 10.0
    else if (speed >= 19.3) met = 8.0
    else if (speed >= 16.1) met = 6.8
    
    const cal = Math.round((met * 3.5 * weight / 200) * (timeInHours * 60))
    setCalories(cal)

    // Improved Water Calculation: Base + intensity + heat
    let waterPerHour = 600 
    if (speed > 25) waterPerHour += 200
    if (speed > 30) waterPerHour += 200
    if (weather.temp > 30) waterPerHour *= 1.25
    if (weather.temp > 38) waterPerHour *= 1.3
    
    setWater(Math.round((waterPerHour * timeInHours) / 50) * 50)
  }, [weight, distance, speed, weather.temp])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* ─── CALCULATOR ─── */}
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Calculator className="size-5" />
              {lang === 'ar' ? 'حاسبة الرحلة الذكية' : 'Smart Ride Calculator'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
               <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-muted-foreground">{lang === 'ar' ? 'الوزن (كجم)' : 'Weight (kg)'}</label>
                <Input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="h-11" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-muted-foreground">{lang === 'ar' ? 'المسافة (كم)' : 'Distance (km)'}</label>
                <Input type="number" value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="h-11" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-muted-foreground">{lang === 'ar' ? 'السرعة (كم/س)' : 'Speed (km/h)'}</label>
                <Input type="number" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="h-11" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-950/10 border border-orange-100 flex items-center gap-3">
                <Zap className="size-6 text-orange-500" />
                <div>
                  <p className="text-[10px] font-bold text-orange-600 uppercase">{lang === 'ar' ? 'السعرات' : 'Calories'}</p>
                  <p className="text-xl font-black text-orange-700">{calories} kcal</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/10 border border-blue-100 flex items-center gap-3">
                <Droplets className="size-6 text-blue-500" />
                <div>
                  <p className="text-[10px] font-bold text-blue-600 uppercase">{lang === 'ar' ? 'الماء' : 'Water'}</p>
                  <p className="text-xl font-black text-blue-700">{water / 1000} L</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
