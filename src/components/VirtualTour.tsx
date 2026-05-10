'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Maximize2, Move, Compass, Info, View } from 'lucide-react'
import Image from 'next/image'

interface TourPoint {
  id: string
  nameAr: string
  nameEn: string
  image: string
}

const points: TourPoint[] = [
  { id: 'qudra', nameAr: 'جولة افتراضية: مسار القدرة', nameEn: 'Virtual Tour: Al Qudra', image: '/images/tours/qudra-360.jpg' },
  { id: 'jais', nameAr: 'جولة افتراضية: جبل جيس', nameEn: 'Virtual Tour: Jebel Jais', image: '/images/tours/jebel-jais-360.jpg' },
]

export default function VirtualTour({ lang }: { lang: 'ar' | 'en' }) {
  const [activePoint, setActivePoint] = useState<TourPoint | null>(null)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {points.map((point) => (
        <div key={point.id} className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all" onClick={() => setActivePoint(point)}>
          <Image 
            src={point.image} 
            alt={point.nameEn} 
            fill 
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 text-white/70 text-[10px] font-bold uppercase tracking-widest mb-2">
              <View className="size-3" />
              {lang === 'ar' ? 'معاينة 360 درجة' : '360° PREVIEW'}
            </div>
            <h3 className="text-white font-bold text-lg leading-tight">
              {lang === 'ar' ? point.nameAr : point.nameEn}
            </h3>
          </div>

          <div className="absolute top-4 right-4 size-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="size-5" />
          </div>
        </div>
      ))}

      {activePoint && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-white z-20">
            <h2 className="font-bold text-xl">{lang === 'ar' ? activePoint.nameAr : activePoint.nameEn}</h2>
            <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => setActivePoint(null)}>
              {lang === 'ar' ? 'إغلاق' : 'Close'}
            </Button>
          </div>

          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
             <div className="relative w-[300%] h-full animate-slow-pan pointer-events-none">
                <Image 
                  src={activePoint.image} 
                  alt="360 View" 
                  fill 
                  className="object-cover"
                />
             </div>

             <div className="absolute inset-0 bg-black/10 pointer-events-none" />
             
             <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 text-white/60">
                <div className="flex flex-col items-center gap-2">
                  <Move className="size-6 animate-bounce" />
                  <span className="text-[10px] font-bold">{lang === 'ar' ? 'اسحب للتدوير' : 'DRAG TO ROTATE'}</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Compass className="size-6" />
                  <span className="text-[10px] font-bold">{lang === 'ar' ? 'البوصلة' : 'COMPASS'}</span>
                </div>
             </div>
          </div>
          
          <div className="absolute bottom-6 right-6 bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 max-w-xs text-white/80 text-xs flex gap-3">
             <Info className="size-5 shrink-0 text-primary" />
             <p>
                {lang === 'ar' 
                  ? 'هذه معاينة افتراضية للمسار باستخدام تقنية الواقع المعزز لتجربة المكان قبل الذهاب.' 
                  : 'This is a virtual preview of the track using AR technology to experience the location before going.'}
             </p>
          </div>
        </div>
      )}
    </div>
  )
}
