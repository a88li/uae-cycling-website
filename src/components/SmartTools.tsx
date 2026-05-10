'use client'

import { useState, useEffect } from 'react'
import { Calculator, Zap, Droplets, Mountain } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface WeatherStats {
  temp: number
  wind: number
}

export default function SmartTools({ lang, weather }: { lang: 'ar' | 'en', weather: WeatherStats }) {
  const [weight, setWeight] = useState(70)
  const [distance, setDistance] = useState(10)
  const [speed, setSpeed] = useState(8)
  const [terrain, setTerrain] = useState<'flat' | 'hills' | 'trail'>('flat')
  const [calories, setCalories] = useState(0)
  const [water, setWater] = useState(0)

  useEffect(() => {
    // Calculator Logic - Running MET values
    const timeInHours = distance / speed
    let met = 6.0
    if (speed >= 14) met = 15
    else if (speed >= 12) met = 13
    else if (speed >= 10) met = 11.5
    else if (speed >= 8) met = 10
    else if (speed >= 6) met = 8
    
    // Terrain adjustment
    if (terrain === 'hills') met *= 1.3
    else if (terrain === 'trail') met *= 1.4
    
    const cal = Math.round((met * 3.5 * weight / 200) * (timeInHours * 60))
    setCalories(cal)

    // Improved Water Calculation: Base + intensity + heat
    let waterPerHour = 600 
    if (speed > 10) waterPerHour += 200
    if (speed > 14) waterPerHour += 200
    if (weather.temp > 30) waterPerHour *= 1.25
    if (weather.temp > 38) waterPerHour *= 1.3
    if (terrain === 'trail') waterPerHour *= 1.1
    else if (terrain === 'hills') waterPerHour *= 1.15
    
    setWater(Math.round((waterPerHour * timeInHours) / 50) * 50)
  }, [weight, distance, speed, terrain, weather.temp])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* ─── CALCULATOR ─── */}
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Calculator className="size-5" />
              {lang === 'ar' ? 'حاسبة الجري الذكية' : 'Smart Run Calculator'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
               <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-muted-foreground">{lang === 'ar' ? 'الوزن (كجم)' : 'Weight (kg)'}</label>
                <Input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="h-11" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-muted-foreground">{lang === 'ar' ? 'المسافة (كم)' : 'Distance (km)'}</label>
                <Input type="number" value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="h-11" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-muted-foreground">{lang === 'ar' ? 'السرعة (كم/س)' : 'Pace (km/h)'}</label>
                <Input type="number" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="h-11" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-muted-foreground">{lang === 'ar' ? 'نوع التضاريس' : 'Terrain'}</label>
                <div className="flex gap-1.5 h-11">
                  {[
                    { key: 'flat' as const, labelAr: 'مسطح', labelEn: 'Flat' },
                    { key: 'hills' as const, labelAr: 'تلال', labelEn: 'Hills' },
                    { key: 'trail' as const, labelAr: 'تريل', labelEn: 'Trail' },
                  ].map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setTerrain(t.key)}
                      className={`flex-1 rounded-md text-xs font-bold transition-all ${
                        terrain === t.key
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-muted text-muted-foreground hover:bg-primary/10'
                      }`}
                    >
                      {lang === 'ar' ? t.labelAr : t.labelEn}
                    </button>
                  ))}
                </div>
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
