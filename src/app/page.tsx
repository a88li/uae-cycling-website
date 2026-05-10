'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Footprints,
  Wrench,
  MapPin,
  Phone,
  Mail,
  Menu,
  Home as HomeIcon,
  Activity,
  ChevronUp,
  Search,
  Moon,
  SunMoon,
  Send,
  Map,
  Globe,
  CheckCircle2,
  Building2,
  Sun,
  MountainSnow,
  Shield,
  Share2,
  Wind,
  Thermometer,
  Shirt,
  Lightbulb,
  Cpu,
  Bike,
  Droplets,
  Heart,
  Timer,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import dynamic from 'next/dynamic'
import SmartTools from '@/components/SmartTools'


// Dynamic import for the Map to avoid SSR issues with Leaflet
const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), { 
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-muted animate-pulse rounded-2xl flex items-center justify-center">Loading Map...</div>
})

/* ───────── Fade-in on scroll wrapper ───────── */
function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ───────── Translations ───────── */
type Lang = 'ar' | 'en'

const t = {
  ar: {
    siteName: 'مسارات الإمارات للجري والدراجات',
    navHome: 'الرئيسية',
    navRoutes: 'المسارات',
    navEquipment: 'المعدات',
    navTips: 'نصائح',
    navContact: 'اتصل بنا',
    search: 'بحث',
    searchPlaceholder: 'ابحث عن مسار... (مثال: كايت بيتش، جبلي، دبي)',
    darkMode: 'داكن',
    lightMode: 'فاتح',
    share: 'مشاركة',
    routesNav: 'المسارات',
    heroTitle: 'اكتشف أفضل مسارات الجري والدراجات في الإمارات',
    heroDesc: 'دليلك الشامل لمسارات الجري والدراجات في دبي وأبوظبي والشارقة وباقي إمارات الدولة، مع قائمة الأدوات المهمة ونصائح للسلامة.',
    browseRoutes: 'تصفح المسارات',
    whyUae: 'لماذا الإمارات؟',
    whyUaeDesc: 'تمتاز الإمارات ببنية تحتية متطورة للجري، ومسارات مخصصة وآمنة، وطقس مشمس خلال معظم أشهر السنة. سواء كنت تبحث عن مسار حضري بجانب البحر أو تحدي تسلق الجبال أو مسار صحراوي للتحمل، ستجد خيارات تناسب مستواك.',
    urbanRoutes: 'مسارات حضرية',
    desertRoutes: 'مسارات صحراوية',
    mountainRoutesTitle: 'مسارات جبلية',
    urbanDesc: 'الكورنيش – مارينا – كايت بيتش',
    desertDesc: 'القدرة – الحديريات – الوثبة',
    mountainDesc: 'جبل جيس – جبل حفيت – حتا',
    urbanAlt: 'مسار جري حضري',
    desertAlt: 'مسار جري صحراوي',
    mountainAlt: 'مسار جري جبلي',
    routesTitle: 'أشهر المسارات في الإمارات',
    routesDesc: 'استكشف قائمة بأهم مسارات الجري والدراجات في كل إمارة، مع نبذة عن طول المسار ونوعه ومناسبته للمبتدئين أو المحترفين.',
    regularRoutes: 'المسارات العادية',
    mountainRoutesTab: 'المسارات الجبلية',
    dubai: 'دبي',
    abuDhabi: 'أبوظبي',
    sharjah: 'الشارقة',
    northernEmirates: 'الإمارات الشمالية',
    equipmentTitle: 'دليل المعدات',
    equipmentDesc: 'في بيئة مثل الإمارات، المعدات الصحيحة ليست رفاهية؛ بل جزء أساسي من السلامة والاستمتاع بالجري. هذا الحد الأدنى من الأدوات ننصح بحملها في أي جري.',
    safetyEquip: 'معدات السلامة',
    maintenanceKit: 'طقم الصيانة الطارئة',
    hydration: 'الترطيب والتغذية',
    tipsTitle: 'نصائح',
    tip1: 'راجع الطقس واختر الوقت المناسب — في الصيف اركض قبل الساعة 6 صباحاً أو بعد 9 مساءً، وفي الشتاء أي وقت مناسب',
    tip2: 'احمل معك مياه كافية + شوارد (إلكترولايت) — في حرارة الإمارات تحتاج 500 مل كل 20 دقيقة على الأقل',
    tip3: 'ارتدِ أحذية جري مناسبة لنوع المسار — إسفلت للكورنيش، تريل للجبال، واختار مقاس أكبر بنصف رقم لانتفاخ القدم في الحر',
    tip4: 'ابدأ بإحماء 5-10 دقائق ومشي سريع قبل الجري، وتدرج في السرعة بالتدريج لتجنب إصابات العضلات',
    tip5: 'استخدم أضواء عاكسة وسترة مضيئة في الفجر والمغيب — مسارات الإمارات مزدحمة بالدراجات والمشاة',
    tip6: 'أخبر أحداً بمسارك ووقت العودة المتوقع إذا كنت تركض وحدك في مسار نائي مثل القدرة أو الوثبة',
    tip7: 'ضع واقي شمسي SPF 50+ قبل الجري حتى في الأيام الغائمة — أشعة UV في الإمارات شديدة جداً',
    tip8: 'تجنب الجري في ذروة الحرارة (11 ص – 4 م) من مايو إلى سبتمبر، واستبدله بالجري المغطى أو المسار الداخلي',
    tip9: 'اهتم بتهدئة الجسم بعد الجري بـ 5 دقائق مشي وتمارين إطالة لمنع تشنجات العضلات وتسريع الاستشفاء',
    exploreMap: 'خريطة المسارات التفاعلية',
    exploreMapDesc: 'اكتشف مواقع المسارات الرئيسية في جميع أنحاء الإمارات وابدأ جريك الآن.',
    currentWeather: 'حالة الطقس الحالية',
    smartTools: 'أدوات الجري الذكية',
    smartToolsDesc: 'استخدم أدواتنا الذكية المدعومة بالبيانات الحية لتخطيط جريك القادم وحساب احتياجاتك البدنية.',
    contactUs: 'اتصل بنا',
    contactDesc: 'لديك سؤال أو اقتراح؟ لا تتردد في التواصل معنا',
    nameLabel: 'الاسم',
    namePlaceholder: 'أدخل اسمك',
    emailLabel: 'البريد الإلكتروني',
    messageLabel: 'الرسالة',
    messagePlaceholder: 'اكتب رسالتك هنا...',
    sendMessage: 'إرسال الرسالة',
    emailTitle: 'البريد الإلكتروني',
    phoneTitle: 'الهاتف',
    followUs: 'تابعنا',
    openInMaps: 'افتح في خرائط جوجل',
    close: 'إغلاق',
    noResults: 'لا توجد نتائج لـ',
    backToTop: 'العودة للأعلى',
    openMenu: 'فتح القائمة',
    copyright: 'جميع الحقوق محفوظة – مسارات الإمارات للجري والدراجات',
    privacyPolicy: 'سياسة الخصوصية',
    termsAndConditions: 'الشروط والأحكام',
    desert: 'صحراوي',
    urban: 'حضري',
    mountain: 'جبلي',
    coastal: 'حضري/ساحلي',
    beginner: 'مبتدئ',
    intermediate: 'متوسط',
    advanced: 'متقدم',
  },
  en: {
    siteName: 'UAE Running & Cycling Routes',
    navHome: 'Home',
    navRoutes: 'Routes',
    navEquipment: 'Equipment',
    navTips: 'Tips',
    navContact: 'Contact',
    search: 'Search',
    searchPlaceholder: 'Search for a route... (e.g. Kite Beach, mountain, Dubai)',
    darkMode: 'Dark',
    lightMode: 'Light',
    share: 'Share',
    routesNav: 'Routes',
    heroTitle: 'Discover the Best Running & Cycling Routes in the UAE',
    heroDesc: 'Your comprehensive guide to running and cycling tracks in Dubai, Abu Dhabi, Sharjah, and the rest of the Emirates, with essential gear lists and safety tips.',
    browseRoutes: 'Browse Routes',
    whyUae: 'Why the UAE?',
    whyUaeDesc: 'The UAE boasts world-class running infrastructure, dedicated safe tracks, and sunny weather most of the year. Whether you seek an urban coastal run, a mountain trail challenge, or a desert endurance track, you will find options that match your level.',
    urbanRoutes: 'Urban Routes',
    desertRoutes: 'Desert Routes',
    mountainRoutesTitle: 'Mountain Routes',
    urbanDesc: 'Corniche – Marina – Kite Beach',
    desertDesc: 'Al Qudra – Hudayriyat – Al Wathba',
    mountainDesc: 'Jebel Jais – Jebel Hafeet – Hatta',
    urbanAlt: 'Urban running route',
    desertAlt: 'Desert running route',
    mountainAlt: 'Mountain running route',
    routesTitle: 'Most Popular Routes in the UAE',
    routesDesc: 'Explore a curated list of the top running and cycling tracks in each emirate, with details on track length, type, and suitability for beginners or pros.',
    regularRoutes: 'Regular Routes',
    mountainRoutesTab: 'Mountain Routes',
    dubai: 'Dubai',
    abuDhabi: 'Abu Dhabi',
    sharjah: 'Sharjah',
    northernEmirates: 'Northern Emirates',
    equipmentTitle: 'Gear Guide',
    equipmentDesc: 'In the UAE environment, the right gear is not a luxury — it is essential for safety and enjoyment. Here is the minimum kit we recommend for any run.',
    safetyEquip: 'Safety Gear',
    maintenanceKit: 'Emergency Repair Kit',
    hydration: 'Hydration & Nutrition',
    tipsTitle: 'Tips',
    tip1: 'Check the weather and choose the right time — run before 6 AM or after 9 PM in summer, anytime in winter',
    tip2: 'Carry enough water + electrolytes — in UAE heat you need at least 500ml every 20 minutes',
    tip3: 'Wear proper running shoes for the terrain — asphalt for corniche, trail for mountains, and go half a size up for heat swelling',
    tip4: 'Start with a 5-10 minute warm-up and brisk walk before running, and gradually increase pace to avoid muscle injuries',
    tip5: 'Use reflective lights and an illuminated vest at dawn and dusk — UAE tracks are busy with cyclists and pedestrians',
    tip6: 'Tell someone your route and expected return time if running alone on remote tracks like Al Qudra or Al Wathba',
    tip7: 'Apply SPF 50+ sunscreen before running even on cloudy days — UV rays in the UAE are extremely intense',
    tip8: 'Avoid running during peak heat (11 AM – 4 PM) from May to September; opt for indoor tracks or covered areas instead',
    tip9: 'Cool down after running with 5 minutes of walking and stretching to prevent muscle cramps and speed up recovery',
    exploreMap: 'Interactive Track Map',
    exploreMapDesc: 'Discover major running locations across the UAE and start your run.',
    currentWeather: 'Current Weather',
    smartTools: 'Smart Running Tools',
    smartToolsDesc: 'Use our data-driven tools to plan your next run and calculate your physical needs based on live weather.',
    contactUs: 'Contact Us',
    contactDesc: 'Have a question or suggestion? Do not hesitate to reach out',
    nameLabel: 'Name',
    namePlaceholder: 'Enter your name',
    emailLabel: 'Email',
    messageLabel: 'Message',
    messagePlaceholder: 'Write your message here...',
    sendMessage: 'Send Message',
    emailTitle: 'Email',
    phoneTitle: 'Phone',
    followUs: 'Follow Us',
    openInMaps: 'Open in Google Maps',
    close: 'Close',
    noResults: 'No results for',
    backToTop: 'Back to top',
    openMenu: 'Open menu',
    copyright: 'All Rights Reserved – UAE Running & Cycling Routes',
    privacyPolicy: 'Privacy Policy',
    termsAndConditions: 'Terms & Conditions',
    desert: 'Desert',
    urban: 'Urban',
    mountain: 'Mountain',
    coastal: 'Urban/Coastal',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  },
}

/* ───────── Cycling Translations ───────── */
const ct = {
  ar: {
    cyclingRoutesTitle: 'أشهر مسارات الدراجات في الإمارات',
    cyclingRoutesDesc: 'استكشف قائمة بأهم مضامير الدراجات في كل إمارة، مع نبذة عن طول المسار ونوعه ومناسبته للمبتدئين أو المحترفين.',
    cyclingEquipmentTitle: 'دليل معداتك لكل طلعة',
    cyclingEquipmentDesc: 'في بيئة مثل الإمارات، المعدات الصحيحة ليست رفاهية؛ بل جزء أساسي من السلامة والاستمتاع بالركوب. هذا الحد الأدنى من الأدوات ننصح بحملها في أي طلعة.',
    cyclingWhyUaeDesc: 'تمتاز الإمارات ببنية تحتية متطورة للدراجات، ومسارات مخصصة وآمنة، وطقس مشمس خلال معظم أشهر السنة. سواء كنت تبحث عن مسار حضري بجانب البحر أو تحدي تسلق الجبال أو مضمار صحراوي للسرعة، ستجد خيارات تناسب مستواك.',
    cyclingTipsTitle: 'نصائح لرحلة آمنة وممتعة',
    cyclingTip1: 'راجع الطقس واختر الوقت المناسب (الصباح الباكر في الصيف – أي وقت في الشتاء)',
    cyclingTip2: 'احمل معك مياه كافية + شوارد',
    cyclingTip3: 'تأكد أن دراجتك صالحة (فرامل – إطارات – سلسلة)',
    cyclingTip4: 'ارتدِ الخوذة دائماً',
    cyclingTip5: 'استخدم أضواء واضحة في الصباح الباكر وقبل المغيب',
    cyclingTip6: 'أخبر أحداً بمسارك ووقت المتوقع للعودة إذا كنت تذهب وحدك لمسار نائي',
    cyclingUrbanAlt: 'مسار دراجات حضري',
    cyclingDesertAlt: 'مسار دراجات صحراوي',
    cyclingMountainAlt: 'مسار دراجات جبلي',
    cyclingUrbanDesc: 'الكورنيش – قناة دبي – مصدر',
    cyclingDesertDesc: 'القدرة – ند الشبا – الوثبة',
    cyclingMountainDesc: 'جبل جيس – جبل حفيت – خور فكان',
    cyclingChecklist: 'فحص السلامة قبل كل طلعة',
    cyclingSafetyFirst: 'السلامة أولاً',
    cyclingSafetyDesc: 'تذكر دائماً ارتداء الخوذة والتأكد من صلاحية الدراجة قبل كل طلعة.',
    cyclingSafetyGuide: 'دليل السلامة الشامل',
    cyclingGearUp: 'تجهيزك للأداء',
  },
  en: {
    cyclingRoutesTitle: 'Most Popular Cycling Routes in the UAE',
    cyclingRoutesDesc: 'Explore a curated list of the top cycling tracks in each emirate, with details on track length, type, and suitability for beginners or pros.',
    cyclingEquipmentTitle: 'Your Gear Guide for Every Ride',
    cyclingEquipmentDesc: 'In the UAE environment, the right gear is not a luxury — it is essential for safety and enjoyment. Here is the minimum kit we recommend for any ride.',
    cyclingWhyUaeDesc: 'The UAE boasts world-class cycling infrastructure, dedicated safe tracks, and sunny weather most of the year. Whether you seek an urban coastal ride, a mountain climbing challenge, or a desert speed track, you will find options that match your level.',
    cyclingTipsTitle: 'Tips for a Safe & Enjoyable Ride',
    cyclingTip1: 'Check the weather and choose the right time (early morning in summer – anytime in winter)',
    cyclingTip2: 'Carry enough water + electrolytes',
    cyclingTip3: 'Make sure your bike is roadworthy (brakes – tires – chain)',
    cyclingTip4: 'Always wear a helmet',
    cyclingTip5: 'Use clear lights in the early morning and before sunset',
    cyclingTip6: 'Tell someone your route and expected return time if riding alone on a remote track',
    cyclingUrbanAlt: 'Urban cycling route',
    cyclingDesertAlt: 'Desert cycling route',
    cyclingMountainAlt: 'Mountain cycling route',
    cyclingUrbanDesc: 'Corniche – Dubai Canal – Masdar',
    cyclingDesertDesc: 'Al Qudra – Nad Al Sheba – Al Wathba',
    cyclingMountainDesc: 'Jebel Jais – Jebel Hafeet – Khor Fakkan',
    cyclingChecklist: 'Pre-Ride Safety Checklist',
    cyclingSafetyFirst: 'Safety First',
    cyclingSafetyDesc: 'Always remember to wear a helmet and check your bike before every ride.',
    cyclingSafetyGuide: 'Full Safety Guide',
    cyclingGearUp: 'Gear Up for Performance',
  },
}

/* ───────── Route data ───────── */
type RouteItem = {
  nameAr: string
  nameEn: string
  type: 'صحراوي' | 'حضري' | 'جبلي' | 'حضري/ساحلي' | 'جبلي/طبيعي' | 'صحراوي/جبلي' | 'حضري/طبيعي'
  length: string
  difficulty: string
  features: string[]
  mapsUrl: string
  image: string
  coords: { lat: number; lng: number }
}

const dubaiRoutes: RouteItem[] = [
  {
    nameAr: 'كورنيش جميرا',
    nameEn: 'Jumeirah Corniche Running Track',
    type: 'حضري/ساحلي',
    length: '14 كم مسار إسفنجي ذهاباً وإياباً',
    difficulty: 'مبتدئ–متوسط',
    features: ['مسار إسفنجي مخصص للجري على طول الشاطئ', 'لوحات إرشادية كل 100 متر', 'إطلالات بحرية خلابة على الخليج العربي', 'يمتد من شاطئ مارينا إلى برج العرب', 'مجاني ومفتوح 24 ساعة'],
    mapsUrl: 'https://www.google.com/maps/search/Jumeirah+Corniche+Running+Track+Dubai',
    image: '/images/run-jumeirah-corniche.jpg',
    coords: { lat: 25.1550, lng: 55.1980 },
  },
  {
    nameAr: 'ممشى دبي مارينا',
    nameEn: 'Dubai Marina Walk',
    type: 'حضري',
    length: '8.5 كم (دورة كاملة)',
    difficulty: 'مبتدئ–متوسط',
    features: ['مناظر حضرية وناطحات سحاب', 'مسار ممهّد بجانب الماء', 'مناسب للجري الصباحي والمسائي', 'مطاعم ومقاهي على المسار', 'إطلالات على اليخوت والمرسى'],
    mapsUrl: 'https://www.google.com/maps/search/Dubai+Marina+Walk+Running+Track',
    image: '/images/run-dubai-marina.jpg',
    coords: { lat: 25.0800, lng: 55.1400 },
  },
  {
    nameAr: 'نخلة جميرا (The Boardwalk)',
    nameEn: 'Palm Jumeirah Boardwalk',
    type: 'حضري/ساحلي',
    length: '11 كم ممشى على الهلال الخارجي',
    difficulty: 'مبتدئ–متوسط',
    features: ['ممشى بحري شهير على الهلال الخارجي للنخلة', 'إطلالات بانورامية على البحر ودبي مارينا', 'مسار ممهّد مناسب للجري والمشي', 'مطاعم ومقاهي على طول المسار', 'إضاءة ليلاً'],
    mapsUrl: 'https://www.google.com/maps/search/Palm+Jumeirah+Boardwalk+Dubai',
    image: '/images/run-palm-boardwalk.jpg',
    coords: { lat: 25.1080, lng: 55.1180 },
  },
  {
    nameAr: 'حديقة الاتحاد (نخلة جميرا)',
    nameEn: 'Al Ittihad Park Running Track',
    type: 'حضري',
    length: '3.2 كم مسار مطاطي',
    difficulty: 'مبتدئ',
    features: ['مسار مطاطي أحمر مخصص للجري', 'بيئة خضراء هادئة داخل نخلة جميرا', 'محطات لياقة بدنية على المسار', 'مثالي للعائلات ومحبي الهدوء', 'مسار سهل على المفاصل'],
    mapsUrl: 'https://www.google.com/maps/search/Al+Ittihad+Park+Palm+Jumeirah+Dubai',
    image: '/images/run-ittihad-park.jpg',
    coords: { lat: 25.1103, lng: 55.1436 },
  },
  {
    nameAr: 'حديقة الصفا',
    nameEn: 'Safa Park Running Track',
    type: 'حضري',
    length: '1.5 كم حلقة مطاطية محيطية',
    difficulty: 'مبتدئ',
    features: ['مسار مطاطي مخصص للجري محيط بالحديقة', 'مرافق لياقة بدنية على المسار', 'إضاءة ليلاً', 'مناظر خضراء وهادئة', 'مجاني ومفتوح'],
    mapsUrl: 'https://www.google.com/maps/search/Al+Safa+Park+Running+Track+Dubai',
    image: '/images/run-safa-park.jpg',
    coords: { lat: 25.1852, lng: 55.2466 },
  },
  {
    nameAr: 'حديقة زعبيل',
    nameEn: 'Zabeel Park Jogging Track',
    type: 'حضري',
    length: '2.5 كم مسار جري محيطي',
    difficulty: 'مبتدئ',
    features: ['مسار جري ممهّد محيط بالحديقة', 'سهل الوصول في قلب المدينة', 'مناظر خضراء وأشجار', 'مرافق لياقة بدنية', 'قريب من دبي فريم'],
    mapsUrl: 'https://www.google.com/maps/search/Zabeel+Park+Jogging+Track+Dubai',
    image: '/images/run-zabeel-park.jpg',
    coords: { lat: 25.2370, lng: 55.2986 },
  },
  {
    nameAr: 'حديقة البرشاء 2',
    nameEn: 'Al Barsha Pond Park Running Track',
    type: 'حضري',
    length: '1.5 كم مسار مطاطي',
    difficulty: 'مبتدئ',
    features: ['مسار جري مطاطي شهير', 'مسارات منفصلة للجري والمشي', 'تخفيف وطأة الجري على المفاصل', 'بركة ماء في وسط الحديقة', 'مجاني ومفتوح'],
    mapsUrl: 'https://www.google.com/maps/search/Al+Barsha+Pond+Park+Running+Track+Dubai',
    image: '/images/run-barsha-pond.jpg',
    coords: { lat: 25.1086, lng: 55.1973 },
  },
  {
    nameAr: 'حديقة مشرف',
    nameEn: 'Mushrif Park Running Trails',
    type: 'صحراوي',
    length: 'حوالي 13 كم + مسارات تريل',
    difficulty: 'مبتدئ–متوسط',
    features: ['مسارات تريل للجري بمستويات مختلفة', 'بيئة طبيعية وأشجار غابة', 'مسارات أخضر للمبتدئين', 'مجموع مسارات 39 كم', 'بيئة هادئة ومظللة'],
    mapsUrl: 'https://www.google.com/maps/search/Mushrif+Park+Running+Trails+Dubai',
    image: '/images/run-mushrif-park.jpg',
    coords: { lat: 25.2250, lng: 55.4506 },
  },
  {
    nameAr: 'ممشى جي بي آر (The Beach)',
    nameEn: 'The Beach JBR Running Track',
    type: 'حضري/ساحلي',
    length: '2 كم مسار رملي وممهد',
    difficulty: 'مبتدئ',
    features: ['مسار رملي وممهد على الشاطئ مباشرة', 'إطلالات على خليج دبي وعين دبي', 'مطاعم ومقاهي على المسار', 'مناسب للجري الخفيف والتنزه', 'إضاءة مسائية'],
    mapsUrl: 'https://www.google.com/maps/search/The+Beach+JBR+Running+Track+Dubai',
    image: '/images/run-jbr-beach.jpg',
    coords: { lat: 25.0759, lng: 55.1312 },
  },
  {
    nameAr: 'قناة دبي المائية',
    nameEn: 'Dubai Water Canal Running Path',
    type: 'حضري',
    length: '3.2 كم مسارات على جانبي القناة',
    difficulty: 'مبتدئ–متوسط',
    features: ['مسارات جري جديدة على جانبي القناة', 'جسور مشاة فوق القناة', 'ربط بين مناطق حيوية في المدينة', 'إطلالات على الأبراج والمياه', 'إضاءة مسائية جميلة'],
    mapsUrl: 'https://www.google.com/maps/search/Dubai+Water+Canal+Running+Path',
    image: '/images/run-dubai-canal.jpg',
    coords: { lat: 25.1870, lng: 55.2650 },
  },
]

const abuDhabiRoutes: RouteItem[] = [
  {
    nameAr: 'كورنيش أبوظبي',
    nameEn: 'Abu Dhabi Corniche Running',
    type: 'حضري/ساحلي',
    length: '8 كم مسار مخصص على طول الشاطئ',
    difficulty: 'مبتدئ',
    features: ['يمتد على طول الشاطئ بإطلالة بحرية', 'مسارات مشاة واسعة وآمنة للجري', 'مناظر رائعة على الخليج العربي', 'مجاني ومفتوح طوال اليوم', 'قريب من المطاعم والمرافق والحدائق'],
    mapsUrl: 'https://www.google.com/maps/search/Abu+Dhabi+Corniche+Running+Track',
    image: '/images/run-abudhabi-corniche.jpg',
    coords: { lat: 24.4721, lng: 54.3358 },
  },
  {
    nameAr: 'جزيرة الحديريات',
    nameEn: 'Al Hudayriyat Running Track',
    type: 'حضري/ساحلي',
    length: '5 كم – 10 كم حلقات مخصصة',
    difficulty: 'مبتدئ–متوسط',
    features: ['مسارات جري متطورة بما في ذلك مارفيستا', 'مقطع علوي مرفوع فوق البحر', 'حلقات مخصصة للجري والهرولة', 'مرافق وخدمات متكاملة', 'مجاني ومفتوح 24 ساعة'],
    mapsUrl: 'https://www.google.com/maps/search/Al+Hudayriyat+Running+Track+Abu+Dhabi',
    image: '/images/run-hudayriyat.jpg',
    coords: { lat: 24.4174, lng: 54.3487 },
  },
  {
    nameAr: 'حلبة مرسى ياس (تدرب في ياس)',
    nameEn: 'Yas Marina Circuit (TrainYAS)',
    type: 'حضري',
    length: '5.5 كم لفة على حلبة الفورمولا 1',
    difficulty: 'مبتدئ–متوسط',
    features: ['الجري داخل مضمار الفورمولا 1 الشهير', 'أيام محددة: TrainYAS مجاناً', 'مسار إسفلت عالمي المستوى خالٍ من السيارات', 'إضاءة كاملة ليلاً', 'مناسب لجميع المستويات'],
    mapsUrl: 'https://www.google.com/maps/search/Yas+Marina+Circuit+TrainYAS+Abu+Dhabi',
    image: '/images/run-yas-marina.jpg',
    coords: { lat: 24.4672, lng: 54.6031 },
  },
  {
    nameAr: 'حديقة أم الإمارات',
    nameEn: 'Umm Al Emarat Park Running Track',
    type: 'حضري',
    length: '1.2 كم مسار جري أخضر',
    difficulty: 'مبتدئ',
    features: ['مسار جري أخضر محاط بالنخيل والنباتات', 'بيئة طبيعية هادئة وآمنة للعائلات', 'مسار مخصص للجري داخل الحديقة', 'مرافق وخدمات متكاملة', 'إضاءة ليلاً ومظلات طبيعية'],
    mapsUrl: 'https://www.google.com/maps/search/Umm+Al+Emarat+Park+Running+Track+Abu+Dhabi',
    image: '/images/run-umm-emarat.jpg',
    coords: { lat: 24.4538, lng: 54.3891 },
  },
  {
    nameAr: 'ممشى القرم الشرقي',
    nameEn: 'Eastern Mangroves Promenade',
    type: 'حضري/طبيعي',
    length: '3 كم ممشى على غابات القرم',
    difficulty: 'مبتدئ',
    features: ['مسار خلاب يطل على غابات القرم الطبيعية', 'بيئة هادئة وبعيدة عن صخب المدينة', 'مسار ممهّد ومناسب للجري الهادئ', 'مناظر طبيعية فريدة من نوعها', 'مناسب للجري الصباحي والمسائي'],
    mapsUrl: 'https://www.google.com/maps/search/Eastern+Mangroves+Promenade+Running+Abu+Dhabi',
    image: '/images/run-eastern-mangroves.jpg',
    coords: { lat: 24.4425, lng: 54.4365 },
  },
  {
    nameAr: 'ممشى جامع الشيخ زايد الكبير',
    nameEn: 'Sheikh Zayed Grand Mosque Jogging Trail',
    type: 'حضري',
    length: '3 كم مسار جري حول الجامع',
    difficulty: 'مبتدئ',
    features: ['مسار جري مخصص بإطلالة مميزة على الجامع', 'مسار 3 كم مع 4 مسارات منفصلة', 'منظر خلاب للجامع خاصة عند الغروب والشروق', 'بيئة روحانية وهادئة', 'من أبرز الوجهات الرياضية الجديدة في أبوظبي'],
    mapsUrl: 'https://www.google.com/maps/search/Sheikh+Zayed+Grand+Mosque+Jogging+Trail+Abu+Dhabi',
    image: '/images/run-szg-mosque.jpg',
    coords: { lat: 24.4130, lng: 54.4920 },
  },
  {
    nameAr: 'مدينة مصدر',
    nameEn: 'Masdar City Running Track',
    type: 'حضري',
    length: '5.6 كم حلقة صديقة للبيئة',
    difficulty: 'مبتدئ',
    features: ['مسار أخضر صديق للبيئة', 'ظلال كثيفة وأشجار', 'بيئة مستدامة وهادئة', 'مجاني ومفتوح للجميع', 'مناسب للجري الهادئ'],
    mapsUrl: 'https://www.google.com/maps/search/Masdar+City+Running+Track+Abu+Dhabi',
    image: '/images/run-masdar-city.jpg',
    coords: { lat: 24.4205, lng: 54.6134 },
  },
]

const sharjahRoutes: RouteItem[] = [
  // ─── حضري/ساحلي ───
  {
    nameAr: 'واجهة المجاز المائي',
    nameEn: 'Al Majaz Waterfront Running Track',
    type: 'حضري/ساحلي',
    length: '750 م مسار مخصص للجري والمشي',
    difficulty: 'مبتدئ',
    features: ['مسار مخصص للجري والمشي محاط بالمناظر الطبيعية', 'مناظر نافورة الشارقة الموسيقية', 'مطاعم ومقاهي على المسار', 'إضاءة ليلاً وبيئة آمنة', 'مناسب للعائلات والمبتدئين'],
    mapsUrl: 'https://www.google.com/maps/search/Al+Majaz+Waterfront+Running+Track+Sharjah',
    image: '/images/run-majaz-waterfront.jpg',
    coords: { lat: 25.3272, lng: 55.3876 },
  },
  {
    nameAr: 'كورنيش البحيرة',
    nameEn: 'Khalid Lagoon Corniche Running Track',
    type: 'حضري/ساحلي',
    length: '6.5 كم حلقة حول بحيرة خالد',
    difficulty: 'مبتدئ',
    features: ['يحيط ببحيرة خالد من أشهر مناطق الجري في المدينة', 'مسار ممهّد بالكامل ومناسب للجري', 'إطلالات على الخور والناطحات', 'يربط بين المجاز والقصباء', 'مجاني ومفتوح 24 ساعة'],
    mapsUrl: 'https://www.google.com/maps/search/Khalid+Lagoon+Corniche+Running+Track+Sharjah',
    image: '/images/run-khalid-lagoon.jpg',
    coords: { lat: 25.3180, lng: 55.3780 },
  },
  {
    nameAr: 'كورنيش الشارقة',
    nameEn: 'Sharjah Corniche Running Track',
    type: 'حضري/ساحلي',
    length: '5 كم مسار على طول الساحل',
    difficulty: 'مبتدئ–متوسط',
    features: ['يمتد على طول الساحل بإطلالة بحرية', 'مسار مفضل لعدائي المسافات الطويلة', 'مناظر المدينة والبحر خلابة', 'مسار ممهّد وسهل الجري', 'إضاءة ليلاً ومجاني'],
    mapsUrl: 'https://www.google.com/maps/search/Sharjah+Corniche+Running+Track',
    image: '/images/run-sharjah-corniche.jpg',
    coords: { lat: 25.3550, lng: 55.3900 },
  },
  {
    nameAr: 'حديقة الاتحاد',
    nameEn: 'Al Ittihad Square Park Jogging Track',
    type: 'حضري',
    length: 'حوالي 2 كم مسار جري في الحديقة',
    difficulty: 'مبتدئ',
    features: ['منطقة خضراء توفر مسارات للجري في الهواء الطلق', 'بجوار سوق الأزرق وجامع الملك فيصل', 'بيئة آمنة ومناسبة للعائلات', 'مسارات ممهدة ومظللة', 'مجاني ومفتوح'],
    mapsUrl: 'https://www.google.com/maps/search/Al+Ittihad+Square+Park+Jogging+Sharjah',
    image: '/images/run-sharjah-ittihad.jpg',
    coords: { lat: 25.3400, lng: 55.3850 },
  },
  {
    nameAr: 'حديقة الشارقة الوطنية',
    nameEn: 'Sharjah National Park Running Track',
    type: 'حضري',
    length: '5.2 كم مسارات واسعة ومظللة',
    difficulty: 'مبتدئ',
    features: ['أكبر حديقة في المدينة مع مسارات واسعة ومظللة', 'مسارات مناسبة للجري الهادئ والإحماء', 'مناظر خضراء وبيئة طبيعية هادئة', 'مرافق عائلية متكاملة', 'مسافة قصيرة مثالية للجري السريع'],
    mapsUrl: 'https://www.google.com/maps/search/Sharjah+National+Park+Running+Track',
    image: '/images/run-sharjah-national.jpg',
    coords: { lat: 25.3080, lng: 55.4400 },
  },
  {
    nameAr: 'مسار الجادة (مسار)',
    nameEn: 'Masaar Track Al Jada Running',
    type: 'حضري',
    length: '6.6 كم مسار مخصص مفتوح 24 ساعة',
    difficulty: 'مبتدئ–متوسط',
    features: ['مسار مخصص بطول 6.6 كم يفتح على مدار الساعة', 'شبكة مسارات جري ودراجات بإجمالي 13 كم', 'يمر عبر الغابات والأشجار', 'بيئة طبيعية هادئة خارج المدينة', 'إضاءة ليلاً وآمن'],
    mapsUrl: 'https://www.google.com/maps/search/Masaar+Track+Al+Jada+Sharjah+Running',
    image: '/images/run-aljada-masaar.jpg',
    coords: { lat: 25.2600, lng: 55.6100 },
  },
  {
    nameAr: 'مسار شاطئ الحمرية',
    nameEn: 'Al Hamriyah Beach Running Track',
    type: 'حضري/ساحلي',
    length: '1.3 كم مسار مطاطي على الشاطئ',
    difficulty: 'مبتدئ',
    features: ['مسار مطاطي بطول 1.3 كم ناعم على القدمين', 'يخفف وطأة الجري على المفاصل', 'إطلالة بحرية خلابة', 'مناسب للجري الخفيف والتنزه', 'مجاني ومفتوح'],
    mapsUrl: 'https://www.google.com/maps/search/Al+Hamriyah+Beach+Running+Track+Sharjah',
    image: '/images/run-hamriyah-beach.jpg',
    coords: { lat: 25.4700, lng: 55.5100 },
  },
  // ─── المنطقة الشرقية (كلباء) ───
  {
    nameAr: 'كورنيش شاطئ كلباء',
    nameEn: 'Kalba Beach Corniche Running Track',
    type: 'حضري/ساحلي',
    length: '7.6 كم مسار ساحلي بعرض 4 أمتار',
    difficulty: 'مبتدئ',
    features: ['مسار طويل يمتد على طول الساحل الشرقي', 'بعرض 4 أمتار ومسطح بالكامل', 'هدوء وسكينة بعيداً عن صخب المدينة', 'إطلالات خليج عمان الساحرة', 'مناسب للجري الطويل والمتواصل'],
    mapsUrl: 'https://www.google.com/maps/search/Kalba+Beach+Corniche+Running+Track+Sharjah',
    image: '/images/run-kalba-corniche.jpg',
    coords: { lat: 25.0600, lng: 56.3500 },
  },
]

const northernRegularRoutes: RouteItem[] = [
  // ─── رأس الخيمة ───
  {
    nameAr: 'جزيرة مريجان – رأس الخيمة',
    nameEn: 'Marjan Island Corniche Running Track',
    type: 'حضري/ساحلي',
    length: '2 كم كورنيش مخصص + حلقات حول الجزيرة',
    difficulty: 'مبتدئ',
    features: ['مسار ساحلي مخصص للجري', 'مناظر بحرية خلابة', 'أشجار نخيل على الكورنيش', 'يمر بجانب الفنادق والمنتزهات', 'مناسب للجري الخفيف والعائلات'],
    mapsUrl: 'https://www.google.com/maps/search/Marjan+Island+Corniche+Running+Ras+Al+Khaimah',
    image: '/images/run-marjan-island.jpg',
    coords: { lat: 25.6826, lng: 55.7454 },
  },
  {
    nameAr: 'كورنيش القواسم – رأس الخيمة',
    nameEn: 'Al Qawasim Corniche Running Track',
    type: 'حضري/ساحلي',
    length: '3 كم ممشى بحري مضاء',
    difficulty: 'مبتدئ',
    features: ['ممشى بحري بطول 3 كم مضاء ليلاً ومفتوح 24 ساعة', 'مسار واسع مُهيأ للجري والمشي وركوب الدراجات', 'محاط بمطاعم ومقاهٍ على الواجهة البحرية', 'من أفضل أماكن الجري الصباحي في رأس الخيمة', 'يمكن تمديد المسافة بالجري ذهاباً وإياباً'],
    mapsUrl: 'https://www.google.com/maps/search/Al+Qawasim+Corniche+Ras+Al+Khaimah',
    image: '/images/run-al-qawasim.jpg',
    coords: { lat: 25.7910, lng: 55.9520 },
  },
  // ─── عجمان ───
  {
    nameAr: 'كورنيش عجمان',
    nameEn: 'Ajman Corniche Running Track',
    type: 'حضري/ساحلي',
    length: '4 كم مسار جري على الكورنيش',
    difficulty: 'مبتدئ',
    features: ['مسار جري مخصص على الكورنيش', 'مناظر بحرية على الخليج العربي', 'مسار ممهّد وآمن', 'قريب من المطاعم والمرافق', 'مناسب للجري العائلي والتنزه'],
    mapsUrl: 'https://www.google.com/maps/search/Ajman+Corniche+Running+Track',
    image: '/images/run-ajman-corniche.jpg',
    coords: { lat: 25.4191, lng: 55.4443 },
  },
  // ─── الفجيرة ───
  {
    nameAr: 'كورنيش الفجيرة',
    nameEn: 'Fujairah Corniche Running Track',
    type: 'حضري/ساحلي',
    length: '3 كم مسار جري ساحلي',
    difficulty: 'مبتدئ',
    features: ['مسار جري على الكورنيش', 'مناظر بحرية على خليج عمان', 'بيئة هادئة وبحرية', 'مناسب للجري الصباحي', 'قريب من المرافق والمطاعم'],
    mapsUrl: 'https://www.google.com/maps/search/Fujairah+Corniche+Running+Track',
    image: '/images/run-fujairah-corniche.jpg',
    coords: { lat: 25.1288, lng: 56.3266 },
  },
]

const mountainRoutes: RouteItem[] = [
  {
    nameAr: 'جبل جيس – رأس الخيمة',
    nameEn: 'Jebel Jais Trail Run',
    type: 'جبلي',
    length: '10+ كم مسارات تريل',
    difficulty: 'متقدم',
    features: ['أعلى قمة في الإمارات (1,934 م)', 'مسارات تريل متنوعة الصعوبة', 'مناخ أبرد من الساحل', 'مناظر جبلية خلابة من القمة', 'يتطلب لياقة بدنية عالية'],
    mapsUrl: 'https://www.google.com/maps/search/Jebel+Jais+Trail+Run+Ras+Al+Khaimah',
    image: '/images/run-jebel-jais.jpg',
    coords: { lat: 25.9376, lng: 56.1312 },
  },
  {
    nameAr: 'جبل حفيت – العين',
    nameEn: 'Jebel Hafeet Trail Run',
    type: 'جبلي',
    length: '12 كم تريل صعود',
    difficulty: 'متقدم',
    features: ['تصنيف متقدم عالمياً', 'من أجمل مسارات التريل في المنطقة', 'ميل شديد في بعض الأجزاء', 'منظر خلاب من القمة 1,249 م', 'تجربة جري جبلي فريدة'],
    mapsUrl: 'https://www.google.com/maps/search/Jebel+Hafeet+Trail+Run+Al+Ain',
    image: '/images/run-jebel-hafeet.jpg',
    coords: { lat: 24.0583, lng: 55.7769 },
  },
  {
    nameAr: 'حتا تريل',
    nameEn: 'Hatta Trail Run',
    type: 'جبلي',
    length: '10+ كم مسارات تريل',
    difficulty: 'مبتدئ–متقدم',
    features: ['مسارات تريل بمستويات مختلفة', 'مناظر جبلية ووادي خلابة', 'بيئة طبيعية هادئة', 'مرافق وخدمات متاحة', 'مناسب لجميع المستويات'],
    mapsUrl: 'https://www.google.com/maps/search/Hatta+Trail+Run+Dubai',
    image: '/images/run-hatta-trail.jpg',
    coords: { lat: 24.7952, lng: 56.1158 },
  },
  // ─── مسارات جبلية – الشارقة ───
  {
    nameAr: 'مسار وادي شيص – الشارقة',
    nameEn: 'Wadi Shees Nature Trail',
    type: 'جبلي/طبيعي',
    length: '6 كم مسار طبيعي وسط الجبال',
    difficulty: 'مبتدئ–متوسط',
    features: ['مسار طبيعي للمشي والجري وسط الجبال', 'يمر عبر تاريخ جيولوجي للشارقة', 'أحافير بحرية تعود لملايين السنين', 'تضاريس رملية وصخرية متنوعة', 'مناظر طبيعية خلابة'],
    mapsUrl: 'https://www.google.com/maps/search/Wadi+Shees+Nature+Trail+Sharjah',
    image: '/images/run-wadi-shees.jpg',
    coords: { lat: 25.0650, lng: 56.2700 },
  },
  {
    nameAr: 'مسار الرفيصة الجبلي – خورفكان',
    nameEn: 'Al Rafisah Mountain Trail',
    type: 'جبلي',
    length: 'حوالي 4 كم مسار جبلي بالقرب من السد',
    difficulty: 'مبتدئ–متوسط',
    features: ['يقع بالقرب من سد الرفيصة بإطلالات جبلية', 'مسار واضح مع نقاط استراحة', 'مناسب للمبتدئين لاختبار اللياقة', 'مناظر جبلية خلابة من القمة', 'بيئة طبيعية هادئة'],
    mapsUrl: 'https://www.google.com/maps/search/Al+Rafisah+Mountain+Trail+Khorfakkan',
    image: '/images/run-al-rafisah.jpg',
    coords: { lat: 25.0550, lng: 56.2400 },
  },
  {
    nameAr: 'مسار الربي الجبلي – خورفكان',
    nameEn: 'Al Rabi Mountain Trail',
    type: 'جبلي',
    length: '5.3 كم مسار جبلي مع ارتفاع 395 م',
    difficulty: 'متوسط–متقدم',
    features: ['وجهة شهيرة في خورفكان للمشي والجري', 'مسار واضح المعالم بارتفاع 395 متر', 'إطلالات خلابة على خورفكان والبحر', 'يمر ببرج الربي التاريخي', 'يتطلب لياقة بدنية جيدة'],
    mapsUrl: 'https://www.google.com/maps/search/Al+Rabi+Mountain+Trail+Khorfakkan',
    image: '/images/run-al-rabi.jpg',
    coords: { lat: 25.0500, lng: 56.3300 },
  },
  {
    nameAr: 'مسار صخرة الأحفور (ملية) – الشارقة',
    nameEn: 'Fossil Rock Mleiha Trail',
    type: 'صحراوي/جبلي',
    length: '6 كم مسار في الكثبان الرملية',
    difficulty: 'متوسط',
    features: ['مسار للمشي والجري في مناطق الكثبان الرملية', 'أحافير بحرية قديمة تعود لملايين السنين', 'تسلق صخري ومناظر صحراوية بانورامية', 'تجربة جري صحراوية فريدة', 'يفضل الجري فيه في الأوقات الباردة'],
    mapsUrl: 'https://www.google.com/maps/search/Fossil+Rock+Mleiha+Trail+Sharjah',
    image: '/images/run-fossil-rock.jpg',
    coords: { lat: 24.8800, lng: 55.8700 },
  },
  // ─── مسارات جبلية – رأس الخيمة ───
  {
    nameAr: 'وادي شوكة – رأس الخيمة',
    nameEn: 'Wadi Shawka Trail Run',
    type: 'جبلي',
    length: '6–10 كم مسارات حلقية متنوعة',
    difficulty: 'مبتدئ–متوسط',
    features: ['مسارات حلقية متعددة حول سد شوكة تناسب المبتدئين والمحترفين', 'إطلالات خلابة على جبال الحجر وسد وادي شوكة', 'مسارات مرقّمة (A1–A7) مع تقاطعات واضحة ولوحات إرشادية', 'من أشهر وجهات التريل في الإمارات بتصنيف 4.6/5', 'بيئة طبيعية هادئة تبعد 92 كم عن دبي'],
    mapsUrl: 'https://www.google.com/maps/search/Wadi+Shawka+Dam+Ras+Al+Khaimah',
    image: '/images/run-wadi-shawka.jpg',
    coords: { lat: 25.1040, lng: 56.0470 },
  },
  // ─── مسارات جبلية – عجمان ───
  {
    nameAr: 'مصفوت – عجمان',
    nameEn: 'Masfout Mountain Trail',
    type: 'جبلي',
    length: '5–10 كم مسارات جبلية متعددة',
    difficulty: 'متوسط–متقدم',
    features: ['منطقة جبلية وعرة في جيب عجمان مع ارتفاع أعلى من المدن المحيطة', 'سباق مصفوت تريل الرسمي بمسافات 10 كم و24 كم', 'مسارات مشي متعددة عبر الجبال والوديان مع مناظر طبيعية خلابة', 'اختيرت ضمن أفضل القرى السياحية في العالم 2025', 'تبدأ المسارات من متحف مصفوت مروراً بسد مصفوت'],
    mapsUrl: 'https://www.google.com/maps/search/Masfout+Ajman+UAE',
    image: '/images/run-masfout.jpg',
    coords: { lat: 24.8400, lng: 56.0520 },
  },
  // ─── مسارات جبلية – الفجيرة ───
  {
    nameAr: 'وادي الوريعة – الفجيرة',
    nameEn: 'Wadi Wurayah Trail',
    type: 'جبلي/طبيعي',
    length: '7 كم مسار طبيعي بين الجبال والشلالات',
    difficulty: 'متوسط',
    features: ['محمية طبيعية ومتنزه وطني يمتد على 127 كم² في جبال الحجر', 'يحتوي على الشلال الدائم الوحيد في الإمارات وبرك طبيعية', '⚠️ مغلق حالياً لإعادة التأهيل – يُنصح بالتحقق قبل الزيارة', 'الوصول يتطلب تصاريح خاصة أو جولات منظمة مع مرشدين معتمدين', 'موطن لحيوانات نادرة كالثعلب الأفغاني وقط غوردون البري'],
    mapsUrl: 'https://www.google.com/maps/search/Wadi+Wurayah+National+Park+Fujairah',
    image: '/images/run-wadi-wurayah.jpg',
    coords: { lat: 25.4000, lng: 56.2500 },
  },
]

/* ───────── Equipment data ───────── */
type GearItem = {
  nameAr: string
  nameEn: string
  descAr: string
  descEn: string
  image: string
  category: 'clothing' | 'safety' | 'tech'
  highlights: { ar: string; en: string }[]
  bestForAr: string
  bestForEn: string
}

const gearItems: GearItem[] = [
  {
    nameAr: 'حذاء جري احترافي بلوحة كربون',
    nameEn: 'Carbon-Plated Racing Shoe',
    descAr: 'حذاء سباق عالي الأداء مزود بلوحة كربون ورغوة متجاوبة، مصمم خصيصاً لأقصى سرعة وكفاءة في يوم السباق والماراثونات.',
    descEn: 'High-performance racing shoe with carbon plate and responsive foam, designed for maximum speed and efficiency on race day and marathons.',
    image: '/images/run-equip-carbon-shoe.jpg',
    category: 'clothing',
    highlights: [
      { ar: 'لوحة كربون لتحويل الطاقة لسرعة أكبر', en: 'Carbon plate converts energy into extra speed' },
      { ar: 'رغوة متجاوبة تخفف الوزن وتزيد الارتداد', en: 'Responsive foam reduces weight and increases bounce' },
      { ar: 'اختر مقاس أكبر بنصف رقم لانتفاخ القدم في الحر', en: 'Go half a size up for foot swelling in heat' },
    ],
    bestForAr: 'مسارات الإسفلت الحضرية: كورنيش جميرا، مارينا، أبوظبي',
    bestForEn: 'Urban asphalt tracks: Jumeirah Corniche, Marina, Abu Dhabi',
  },
  {
    nameAr: 'حذاء جري يومي مريح',
    nameEn: 'Daily Comfort Running Shoe',
    descAr: 'حذاء التدريب اليومي المثالي برغوة سميكة وامتصاص صدمات عالي، مصمم للجري لمسافات طويلة دون إرهاق المفاصل.',
    descEn: 'The ultimate daily trainer with thick foam and high cushioning, designed for long-distance running without joint fatigue.',
    image: '/images/run-equip-daily-shoe.jpg',
    category: 'clothing',
    highlights: [
      { ar: 'امتصاص صدمات عالي يحمي الركب والمفاصل', en: 'High cushioning protects knees and joints' },
      { ar: 'رغوة سميكة للجري لمسافات طويلة ب راحة', en: 'Thick foam for comfortable long-distance runs' },
      { ar: 'نعل متين يتحمل الاستخدام اليومي في الإمارات', en: 'Durable sole withstands daily use in the UAE' },
    ],
    bestForAr: 'التدريبات اليومية: كورنيش، حدائق، مسارات ممهدة',
    bestForEn: 'Daily training: corniche, parks, paved tracks',
  },
  {
    nameAr: 'حذاء تريل للمسارات الجبلية',
    nameEn: 'Trail Running Shoe',
    descAr: 'حذاء مخصص للمسارات الوعرة والجبلية بنعل مسنن قوي وحماية للقدم من الصخور والحصى، ضروري لكل عداء تريل.',
    descEn: 'Rugged trail shoe with aggressive tread and rock protection, essential for every trail runner on rough terrain.',
    image: '/images/run-equip-trail-shoe.jpg',
    category: 'clothing',
    highlights: [
      { ar: 'نعل مسنن قوي يمنع الانزلاق على الصخور', en: 'Aggressive tread prevents slipping on rocks' },
      { ar: 'لوح حماية أسفل القدم من الحصى الحاد', en: 'Rock plate protects the bottom of your foot' },
      { ar: 'مقاوم للماء والوحل في أودية الإمارات', en: 'Water and mud resistant for UAE wadis' },
    ],
    bestForAr: 'المسارات الجبلية: جبل جيس، جبل حفيت، حتا، وادي شوكة',
    bestForEn: 'Mountain trails: Jebel Jais, Jebel Hafeet, Hatta, Wadi Shawka',
  },
  {
    nameAr: 'ساعة جري GPS متقدمة',
    nameEn: 'Advanced GPS Running Watch',
    descAr: 'ساعة جري ذكية بتتبع GPS متعدد النطاقات وشاشة ساطعة، تراقب أدائك وتخطط مساراتك بدقة عالية.',
    descEn: 'Smart running watch with multi-band GPS tracking and bright display, monitoring your performance and planning routes precisely.',
    image: '/images/run-equip-gps-watch.jpg',
    category: 'tech',
    highlights: [
      { ar: 'GPS مزدوج النطاق لدقة أعلى في التتبع', en: 'Dual-band GPS for higher tracking accuracy' },
      { ar: 'مراقبة نبض القلب ومؤشر الأداء والاستشفاء', en: 'Heart rate, performance, and recovery monitoring' },
      { ar: 'تخطيط مسارات الإمارات وتسجيل التدريبات', en: 'Plan UAE routes and log training sessions' },
    ],
    bestForAr: 'كل المسارات — ضرورية لتتبع المسافة والسرعة',
    bestForEn: 'All tracks — essential for tracking distance and pace',
  },
  {
    nameAr: 'ملابس جري خفيفة ومتهوية',
    nameEn: 'Lightweight Breathable Running Apparel',
    descAr: 'ملابس جري بتقنية التبريد والتهوية التي تبعد العرق عن الجسم وتحمي من أشعة الشمس الحارقة في مناخ الإمارات.',
    descEn: 'Running apparel with cooling and ventilation technology that wicks sweat and protects from harsh sun in the UAE climate.',
    image: '/images/run-equip-apparel.jpg',
    category: 'clothing',
    highlights: [
      { ar: 'تقنية تبريد تبعد العرق وتبرد الجسم', en: 'Cooling tech wicks sweat and cools the body' },
      { ar: 'حماية UV من أشعة الشمس الحارقة', en: 'UV protection from harsh sun rays' },
      { ar: 'خفيفة الوزن — لا تزيد العبء في الحر', en: 'Lightweight — no extra burden in the heat' },
    ],
    bestForAr: 'كل المسارات — ضرورية في حرارة الإمارات',
    bestForEn: 'All tracks — essential in UAE heat',
  },
  {
    nameAr: 'حزام ترطيب معزول',
    nameEn: 'Insulated Hydration Belt',
    descAr: 'حزام ترطيب معزول يتسع لقوارير الماء مع جيوب للشوارد والهاتف، أساسي للجري في المسارات البعيدة عن نقاط المياه.',
    descEn: 'Insulated hydration belt with water bottles and pockets for electrolytes and phone, essential for running on tracks far from water stations.',
    image: '/images/run-equip-hydration-belt.jpg',
    category: 'safety',
    highlights: [
      { ar: 'عزل حراري يحافظ على برودة الماء', en: 'Thermal insulation keeps water cool' },
      { ar: 'جيوب للشوارد والهاتف والمفاتيح', en: 'Pockets for electrolytes, phone, and keys' },
      { ar: 'تحتاج 500 مل كل 20 دقيقة في حر الإمارات', en: 'You need 500ml every 20 min in UAE heat' },
    ],
    bestForAr: 'المسارات الصحراوية: القدرة، الوثبة، مسارات طويلة',
    bestForEn: 'Desert tracks: Al Qudra, Al Wathba, long routes',
  },
  {
    nameAr: 'سترة عاكسة عالية الرؤية',
    nameEn: 'High-Visibility Reflective Vest',
    descAr: 'سترة عاكسة مضيئة لسلامة العدائين في الأوقات المنخفضة الإضاءة، ضرورية في المسارات المزدحمة بالدراجات والمشاة.',
    descEn: 'Illuminated reflective vest for runner safety during low-light hours, essential on tracks shared with cyclists and pedestrians.',
    image: '/images/run-equip-reflective-vest.jpg',
    category: 'safety',
    highlights: [
      { ar: 'شرائط عاكسة و LED مرئية من 200 متر', en: 'Reflective strips and LED visible from 200m' },
      { ar: 'خفيفة الوزن لا تعيق الحركة', en: 'Lightweight does not restrict movement' },
      { ar: 'مهمة جداً في الفجر والمغيب بمسارات الإمارات', en: 'Crucial at dawn and dusk on UAE tracks' },
    ],
    bestForAr: 'الجري الصباحي والمسائي: كورنيش دبي، أبوظبي',
    bestForEn: 'Morning and evening runs: Dubai, Abu Dhabi corniche',
  },
  {
    nameAr: 'نظارات رياضية واقية من الشمس',
    nameEn: 'Sport Sunglasses with UV Protection',
    descAr: 'نظارات رياضية خفيفة بعدسات مقاومة للانعكاس وحماية كاملة من الأشعة فوق البنفسجية، تحمي العيون من وهج الشمس والرمال.',
    descEn: 'Lightweight sport sunglasses with anti-reflective lenses and full UV protection, protecting eyes from sun glare and sand.',
    image: '/images/run-equip-sunglasses.jpg',
    category: 'safety',
    highlights: [
      { ar: 'حماية 100% من أشعة UV الضارة', en: '100% protection from harmful UV rays' },
      { ar: 'عدسات مقاومة للانعكاس تمنع وهج الشمس', en: 'Anti-reflective lenses prevent sun glare' },
      { ar: 'إطار خفيف مانع للانزلاق أثناء الجري', en: 'Lightweight non-slip frame while running' },
    ],
    bestForAr: 'المسارات المفتوحة: صحراوية، كورنيش، شاطئية',
    bestForEn: 'Open tracks: desert, corniche, beach routes',
  },
  {
    nameAr: 'كريم واقي شمسي رياضي',
    nameEn: 'Sport Sunscreen SPF 50+',
    descAr: 'واقي شمسي مقاوم للعرق بعامل حماية 50+ مصمم للرياضيين، يحمي الجلد من حروق الشمس خلال الجري في الأجواء المفتوحة.',
    descEn: 'Sweat-resistant sunscreen SPF 50+ designed for athletes, protecting skin from sunburn during open-air running.',
    image: '/images/run-equip-sunscreen.jpg',
    category: 'safety',
    highlights: [
      { ar: 'SPF 50+ مقاوم للعرق والماء', en: 'SPF 50+ sweat and water resistant' },
      { ar: 'ضعه قبل 15 دقيقة من الجري لفعالية أفضل', en: 'Apply 15 minutes before running for best results' },
      { ar: 'أشعة UV في الإمارات شديدة جداً — ضروري طول السنة', en: 'UAE UV rays are extreme — essential all year round' },
    ],
    bestForAr: 'كل الأوقات المفتوحة — لا تركض بدونه في الإمارات',
    bestForEn: 'All outdoor times — never run without it in the UAE',
  },
]

/* ───────── Cycling Route data ───────── */
const cyclingDubaiRoutes: RouteItem[] = [
  {
    nameAr: 'مسار القدرة',
    nameEn: 'Al Qudra Cycle Track',
    type: 'صحراوي',
    length: 'حلقات: 18 / 20 / 30 / 50 / 64 / 86 كم',
    difficulty: 'متوسط–متقدم',
    features: ['إسفلت ممتاز وصيانة مستمرة', 'إضاءة ليلاً على أجزاء من المسار', 'منطقة استراحة وخدمات', 'مناظر صحراوية وحياة برية (المها العربي)', 'مجاني ومفتوح 24 ساعة'],
    mapsUrl: 'https://www.google.com/maps/search/Al+Qudra+Cycling+Track+Dubai',
    image: '/images/bike-dubai-al-qudra.jpg',
    coords: { lat: 24.83, lng: 55.33 },
  },
  {
    nameAr: 'ند الشبا للدراجات',
    nameEn: 'Nad Al Sheba Cycle Park',
    type: 'صحراوي',
    length: 'حلقات: 4 / 6 / 8 كم',
    difficulty: 'مبتدئ–متوسط',
    features: ['إضاءة كاملة ليلاً', 'خزائن ومرافق استراحة', 'مسار آمن ومناسب للعائلات', 'مجاني ومفتوح 24 ساعة', 'قريب من مضمار ميدان'],
    mapsUrl: 'https://www.google.com/maps/search/Nad+Al+Sheba+Cycle+Park+Dubai',
    image: '/images/bike-dubai-nad-al-sheba.jpg',
    coords: { lat: 25.16, lng: 55.35 },
  },
  {
    nameAr: 'دبي أوتودروم',
    nameEn: 'Dubai Autodrome',
    type: 'حضري',
    length: 'لفة 4.5 كم (المسار المفتوح)',
    difficulty: 'متوسط–متقدم',
    features: ['إسفلت سباق عالي الجودة', 'أيام مخصصة: الأربعاء من 6:30 مساءً', 'رسوم دخول – يرجى الحجز مسبقاً', 'خالٍ من السيارات أثناء التمرين', 'مضمار مغلق وآمن'],
    mapsUrl: 'https://www.google.com/maps/search/Dubai+Autodrome+Cycling',
    image: '/images/bike-dubai-autodrome.jpg',
    coords: { lat: 25.05, lng: 55.24 },
  },
  {
    nameAr: 'خور دبي',
    nameEn: 'Dubai Water Canal',
    type: 'حضري',
    length: 'حوالي 8 كم (دورة كاملة مع Business Bay)',
    difficulty: 'مبتدئ–متوسط',
    features: ['مناظر حضرية وناطحات سحاب', 'مسار مشترك مع المشاة', 'مناسب للتنزه والركوب الخفيف', 'جسر المشاه الشهير فوق القناة', 'إضاءة مسائية جميلة'],
    mapsUrl: 'https://www.google.com/maps/search/Dubai+Water+Canal+Cycling+Path',
    image: '/images/bike-dubai-water-canal.jpg',
    coords: { lat: 25.19, lng: 55.25 },
  },
  {
    nameAr: 'حديقة مشرف',
    nameEn: 'Mushrif Park MTB',
    type: 'صحراوي',
    length: 'حوالي 13 كم (مسار أخضر) + مسارات جبلية',
    difficulty: 'مبتدئ–متوسط',
    features: ['11 مسار دراجات جبلية بمستويات مختلفة', 'مسار أخضر للمبتدئين 5.6 كم', 'مجموع مسارات 39 كم مع الخوانيج', 'بيئة طبيعية وأشجار غابة', 'تأجير دراجات متاح'],
    mapsUrl: 'https://www.google.com/maps/search/Mushrif+Park+MTB+Trails+Dubai',
    image: '/images/bike-dubai-mushrif-park.jpg',
    coords: { lat: 25.21, lng: 55.45 },
  },
]

const cyclingAbuDhabiRoutes: RouteItem[] = [
  {
    nameAr: 'الكورنيش أبوظبي',
    nameEn: 'Abu Dhabi Corniche Cycle Path',
    type: 'حضري',
    length: '12 كم (من ميناء زايد إلى مارينا مول)',
    difficulty: 'مبتدئ',
    features: ['مسار مخصص وآمن للدراجات', 'مناظر بحرية رائعة على الخليج العربي', 'مجاني ومفتوح طوال اليوم', 'قريب من المطاعم والمرافق', 'مناسب للعائلات والمبتدئين'],
    mapsUrl: 'https://www.google.com/maps/search/Abu+Dhabi+Corniche+Cycling+Track',
    image: '/images/bike-abudhabi-corniche.jpg',
    coords: { lat: 24.47, lng: 54.34 },
  },
  {
    nameAr: 'جزيرة ياس – TrainYAS',
    nameEn: 'Yas Marina Circuit (TrainYAS)',
    type: 'حضري',
    length: 'لفة 5.5 كم على حلبة السباق',
    difficulty: 'مبتدئ–متوسط',
    features: ['حلبة فورمولا 1 – خالٍ من السيارات', 'أيام محددة: TrainYAS مجاناً', 'تأجير خوذ مجاني', 'مسار إسفلت عالمي المستوى', 'إضاءة كاملة ليلاً'],
    mapsUrl: 'https://www.google.com/maps/search/Yas+Marina+Circuit+TrainYAS+Abu+Dhabi',
    image: '/images/bike-abudhabi-yas-marina.jpg',
    coords: { lat: 24.47, lng: 54.60 },
  },
  {
    nameAr: 'مدينة مصدر',
    nameEn: 'Masdar City Cycling Track',
    type: 'حضري',
    length: '5.6 كم حلقة حول المدينة',
    difficulty: 'مبتدئ',
    features: ['مسار أخضر صديق للبيئة', 'ظلال كثيفة وأشجار', 'ينطلق من حديقة مصدر', 'بيئة مستدامة وهادئة', 'مجاني ومفتوح للجميع'],
    mapsUrl: 'https://www.google.com/maps/search/Masdar+City+Cycling+Track+Abu+Dhabi',
    image: '/images/bike-abudhabi-masdar.jpg',
    coords: { lat: 24.43, lng: 54.61 },
  },
  {
    nameAr: 'الوثبة للدراجات',
    nameEn: 'Al Wathba Cycle Track',
    type: 'صحراوي',
    length: 'حلقات: 8 / 16 / 20 / 22 / 30 كم',
    difficulty: 'متوسط–متقدم',
    features: ['42 كم من وسط أبوظبي نحو العين', '3 دوائر رئيسية بمستويات مختلفة', 'مسارات إسفلت في قلب الصحراء', 'تجربة صحراوية أصيلة', 'مجاني ومفتوح 24 ساعة'],
    mapsUrl: 'https://www.google.com/maps/search/Al+Wathba+Cycle+Track+Abu+Dhabi',
    image: '/images/bike-abudhabi-al-wathba.jpg',
    coords: { lat: 24.16, lng: 54.73 },
  },
  {
    nameAr: 'جزيرة الحديريات',
    nameEn: 'Al Hudayriat Island Cycling',
    type: 'حضري',
    length: 'حلقات إسفلت: 5 / 10 / 15 كم | مسار جبلي Trail X: 15 كم',
    difficulty: 'مبتدئ–متقدم',
    features: ['حلقات إسفلت مخصصة: 5 / 10 / 15 كم', 'Trail X – أول مسار دراجات جبلية في أبوظبي', 'مقطع علوي مرفوع فوق البحر بمناظر خلابة', 'تأجير دراجات ابتداءً من 50 درهم/ساعة', 'مجاني ومفتوح 24 ساعة'],
    mapsUrl: 'https://www.google.com/maps/search/Al+Hudayriat+Island+Cycling+Track+Abu+Dhabi',
    image: '/images/bike-abudhabi-hudayriat.jpg',
    coords: { lat: 24.43, lng: 54.35 },
  },
]

const cyclingSharjahRoutes: RouteItem[] = [
  {
    nameAr: 'مجمع مسار – مسار الدراجات',
    nameEn: 'Masaar Track – Al Suyoh',
    type: 'حضري',
    length: '6.6 كم حلقة كاملة',
    difficulty: 'مبتدئ–متوسط',
    features: ['3 أنفاق وجسر مخصص للدراجات', 'إضاءة كاملة 24 ساعة', 'مفتوح على مدار الساعة', 'يخترق غابة الأشجار في المجمع', 'تصميم يناسب المبتدئين والمحترفين'],
    mapsUrl: 'https://www.google.com/maps/search/Masaar+Track+Al+Suyoh+Sharjah+Cycling',
    image: '/images/bike-sharjah-masaar.jpg',
    coords: { lat: 25.26, lng: 55.61 },
  },
  {
    nameAr: 'مدينة الشارقة الجامعية',
    nameEn: 'University City Sharjah',
    type: 'حضري',
    length: 'حوالي 7 كم داخل الحرم الجامعي',
    difficulty: 'مبتدئ',
    features: ['مسارات داخل الحرم الجامعي', 'مناظر خضراء وأشجار', 'بيئة هادئة وآمنة', 'مناسبة للركوب العائلي', 'قريبة من جامعة الشارقة'],
    mapsUrl: 'https://www.google.com/maps/search/University+City+Sharjah+Cycling+Track',
    image: '/images/bike-sharjah-university.jpg',
    coords: { lat: 25.31, lng: 55.48 },
  },
  {
    nameAr: 'مسار البطائح للدراجات',
    nameEn: 'Al Batayeh Bicycle Track',
    type: 'صحراوي',
    length: '24 كم (48 كم ذهاباً وإياباً)',
    difficulty: 'مبتدئ–متوسط',
    features: ['مسار مخصص بطول 24 كم مع جسور علوية', 'عرض المسار 5 أمتار للسلامة القصوى', 'مرافق استراحة ودورات مياه ومصلى', 'مناظر طبيعية خلابة ومناطق مزارع', 'إضاءة وحواجز أمان لمنع دخول السيارات'],
    mapsUrl: 'https://www.google.com/maps/search/Al+Batayeh+Bicycle+Track',
    image: '/images/bike-sharjah-batayeh.jpg',
    coords: { lat: 25.2033, lng: 55.6573 },
  },
]

const cyclingNorthernRoutes: RouteItem[] = [
  {
    nameAr: 'جزيرة مريجان – رأس الخيمة',
    nameEn: 'Marjan Island Corniche',
    type: 'حضري',
    length: '3.5 كم مسار مخصص + حلقات حول الجزيرة',
    difficulty: 'مبتدئ',
    features: ['مسار ساحلي مخصص وآمن', 'عرض 4 أمتار – مشترك مع المشاة', 'يربط بقرية الحمراء', 'مناظر بحرية خلابة', 'يمر بجانب الفنادق والمنتزهات'],
    mapsUrl: 'https://www.google.com/maps/search/Marjan+Island+Corniche+Cycling+Ras+Al+Khaimah',
    image: '/images/bike-rak-marjan.jpg',
    coords: { lat: 25.68, lng: 55.74 },
  },
  {
    nameAr: 'طريق خور فكان الساحلي – الفجيرة',
    nameEn: 'Khor Fakkan Coastal Road',
    type: 'حضري/ساحلي',
    length: 'حوالي 21 كم (الفجيرة – خور فكان)',
    difficulty: 'متوسط',
    features: ['مناظر جبلية وبحرية مذهلة', 'طريق ساحلي ممتع ومنخفض الارتفاع', 'يمر بالأحياء الساحلية', 'أفضل في الصباح الباكر', 'قريب من شاطئ خور فكان'],
    mapsUrl: 'https://www.google.com/maps/search/Khor+Fakkan+Coastal+Road+Cycling',
    image: '/images/bike-fujairah-khor-fakkan.jpg',
    coords: { lat: 25.37, lng: 56.36 },
  },
  {
    nameAr: 'مسارات عجمان للدراجات',
    nameEn: 'Ajman Cycling Tracks',
    type: 'صحراوي',
    length: 'شبكة مسارات تمتد أكثر من 4,000 كم',
    difficulty: 'مبتدئ–متوسط',
    features: ['مسارات متعددة داخل الإمارة', 'بيئة طبيعية هادئة', 'مناسبة لجميع المستويات', 'شبكة واسعة من المسارات الممهدة', 'أفضل في الأشهر الباردة'],
    mapsUrl: 'https://www.google.com/maps/search/Ajman+Cycling+Tracks',
    image: '/images/bike-ajman-cycling.jpg',
    coords: { lat: 25.41, lng: 55.43 },
  },
]

const cyclingMountainRoutes: RouteItem[] = [
  {
    nameAr: 'جبل جيس – رأس الخيمة',
    nameEn: 'Jebel Jais Climb',
    type: 'جبلي',
    length: '21 كم صعود (متوسط ميل 5.5%)',
    difficulty: 'متقدم',
    features: ['أعلى قمة في الإمارات (1,934 م)', 'ارتفاع 1,000 م من نقطة البداية', 'أقصى ميل 6.1% – تصنيف cat 1', 'مرحلة رسمية في UAE Tour', 'مناظر جبلية خلابة من القمة'],
    mapsUrl: 'https://www.google.com/maps/search/Jebel+Jais+Climb+Cycling+Ras+Al+Khaimah',
    image: '/images/bike-rak-jebel-jais.jpg',
    coords: { lat: 25.93, lng: 56.12 },
  },
  {
    nameAr: 'جبل حفيت – العين',
    nameEn: 'Jebel Hafeet Climb',
    type: 'جبلي',
    length: '10.6 كم صعود (متوسط ميل 7%)',
    difficulty: 'متقدم',
    features: ['تصنيف cat 1 عالمياً', 'من أجمل 10 تسلق دراجات في العالم', 'ميل يصل إلى 30% في بعض الأجزاء', 'منظر خلاب من القمة 1,249 م', 'مرحلة رسمية في UAE Tour'],
    mapsUrl: 'https://www.google.com/maps/search/Jebel+Hafeet+Climb+Al+Ain',
    image: '/images/bike-ain-jebel-hafeet.jpg',
    coords: { lat: 24.08, lng: 55.77 },
  },
  {
    nameAr: 'حتا للدراجات الجبلية',
    nameEn: 'Hatta MTB Trail',
    type: 'جبلي',
    length: '52 كم (4 مستويات صعوبة)',
    difficulty: 'مبتدئ–متقدم',
    features: ['86 كم إجمالي شبكة المسارات', '4 مستويات: أخضر / أزرق / أحمر / أسود', 'تأجير 60 دراجة في الموقع', 'ورشة صيانة وغسيل وتخزين', 'مناظر جبلية خلابة'],
    mapsUrl: 'https://www.google.com/maps/search/Hatta+Mountain+Bike+Trail+Dubai',
    image: '/images/bike-dubai-hatta-mtb.jpg',
    coords: { lat: 24.81, lng: 56.12 },
  },
]

/* ───────── Cycling Gear data ───────── */
const cyclingGearItems: GearItem[] = [
  {
    nameAr: 'طقم فريق الإمارات 2026 (Pissei)',
    nameEn: 'UAE Team Emirates 2026 Kit',
    descAr: 'الطقم الرسمي المعتمد لموسم 2026، يتميز باللون الأبيض الناصع مع أكمام سوداء وشعارات الرعاة الرسميين.',
    descEn: 'The official 2026 season kit, featuring clinical white with black sleeves and official sponsor logos.',
    image: '/images/uae-team-kit-official.png',
    category: 'clothing',
    highlights: [
      { ar: 'قماش Pissei الإيطالي يبعد العرق ويبرد الجسم', en: 'Italian Pissei fabric wicks sweat and cools the body' },
      { ar: 'أكمام مضغوطة تحسين الديناميكية الهوائية', en: 'Compressed sleeves improve aerodynamics' },
      { ar: 'جيوب خلفية للأغذية والهاتف', en: 'Rear pockets for nutrition and phone' },
    ],
    bestForAr: 'كل الطلعات — الطقم الرسمي لفريق الإمارات',
    bestForEn: 'All rides — the official UAE Team kit',
  },
  {
    nameAr: 'خوذة الفريق الاحترافية',
    nameEn: 'Official Team Helmet',
    descAr: 'خوذة كربونية خفيفة الوزن بألوان الفريق، تدمج بين الأمان العالي والديناميكية الهوائية المثالية.',
    descEn: 'Lightweight carbon helmet in team colors, merging high safety with optimal aerodynamics.',
    image: '/images/uae-team-helmet.png',
    category: 'safety',
    highlights: [
      { ar: 'كربون خفيف الوزن مع حماية عالية', en: 'Lightweight carbon with high protection' },
      { ar: 'تصميم هوائي يقلل مقاومة الريح', en: 'Aerodynamic design reduces wind resistance' },
      { ar: 'فتحات تهوية تحافظ على برودة الرأس', en: 'Ventilation keeps the head cool' },
    ],
    bestForAr: 'كل الطلعات — الخوذة ضرورية قانونياً',
    bestForEn: 'All rides — helmet is legally required',
  },
  {
    nameAr: 'قفازات الأداء العالي',
    nameEn: 'High Performance Gloves',
    descAr: 'القفازات الرسمية للفريق بتصميم نصفي، توفر حماية فائقة وتهوية مثالية لليدين.',
    descEn: 'Official team fingerless gloves, providing superior protection and optimal ventilation.',
    image: '/images/uae-team-gloves-official.png',
    category: 'clothing',
    highlights: [
      { ar: 'تصميم نصفي لتهوية وحرية حركة أفضل', en: 'Fingerless design for better ventilation and movement' },
      { ar: 'حشوة جلدية في الكف لامتصاص الصدمات', en: 'Leather palm padding absorbs shock' },
      { ar: 'مادة مانعة للانزلاق لقبضة محكمة', en: 'Non-slip material for a secure grip' },
    ],
    bestForAr: 'الطلعات الطويلة والمسارات الوعرة',
    bestForEn: 'Long rides and rough terrain',
  },
  {
    nameAr: 'أحذية الفريق (الإصدار الأبيض)',
    nameEn: 'Team Edition Shoes (White)',
    descAr: 'أحذية احترافية باللون الأبيض الناصع مع نعل كربوني صلب لأقصى درجات نقل القوة.',
    descEn: 'Professional shoes in clinical white with stiff carbon soles for maximum power transfer.',
    image: '/images/uae-team-shoes-white.png',
    category: 'clothing',
    highlights: [
      { ar: 'نعل كربوني صلب لنقل القوة بكفاءة عالية', en: 'Stiff carbon sole for efficient power transfer' },
      { ar: 'نظام ربط BOA لضبط سريع ومحكم', en: 'BOA dial system for quick and secure fit' },
      { ar: 'تهوية ممتازة في مناخ الإمارات الحار', en: 'Excellent ventilation in the hot UAE climate' },
    ],
    bestForAr: 'السباقات والطلعات السريعة',
    bestForEn: 'Racing and fast rides',
  },
  {
    nameAr: 'نظام الإنارة الذكي',
    nameEn: 'Smart Lighting System',
    descAr: 'إنارات LED عالية الكثافة مدمجة مع دراجات الفريق لضمان الرؤية الواضحة في التمارين الليلية.',
    descEn: 'High-intensity LED lights integrated with team bikes to ensure clear visibility during night training.',
    image: '/images/uae-team-lights.png',
    category: 'safety',
    highlights: [
      { ar: 'LED عالي الكثافة مرئي من 500 متر', en: 'High-intensity LED visible from 500m' },
      { ar: 'وضع يومي ووضع ليلي مع وميض تحذيري', en: 'Day mode and night mode with warning flash' },
      { ar: 'بطارية تدوم حتى 10 ساعات', en: 'Battery lasts up to 10 hours' },
    ],
    bestForAr: 'الركوب قبل الفجر وبعد المغيب',
    bestForEn: 'Riding before dawn and after sunset',
  },
  {
    nameAr: 'كمبيوتر الدراجة (Team GPS)',
    nameEn: 'Team GPS Computer',
    descAr: 'أحدث أجهزة التتبع بشعار الفريق، توفر خرائط حية لمسارات الإمارات وتحليل دقيق للأداء.',
    descEn: 'Latest tracking devices with team logo, providing live maps of UAE tracks and precise performance analysis.',
    image: '/images/uae-team-gps.png',
    category: 'tech',
    highlights: [
      { ar: 'خرائط حية لمسارات الإمارات مع تنقل صوتي', en: 'Live maps of UAE tracks with turn-by-turn navigation' },
      { ar: 'مراقبة نبض القلب والطاقة والسرعة', en: 'Heart rate, power, and speed monitoring' },
      { ar: 'ربط مع Strava وتطبيقات التدريب', en: 'Syncs with Strava and training apps' },
    ],
    bestForAr: 'كل الطلعات — لتتبع المسافة والأداء',
    bestForEn: 'All rides — for tracking distance and performance',
  },
]


/* ───────── Type badge color helper ───────── */
function typeBadgeClass(type: string) {
  switch (type) {
    case 'صحراوي':
    case 'Desert':
      return 'bg-amber-100 text-amber-800 border-amber-300'
    case 'حضري':
    case 'Urban':
      return 'bg-sky-100 text-sky-800 border-sky-300'
    case 'جبلي':
    case 'Mountain':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300'
    case 'حضري/ساحلي':
    case 'Urban/Coastal':
      return 'bg-cyan-100 text-cyan-800 border-cyan-300'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300'
  }
}

function difficultyBadgeClass(diff: string) {
  if (diff.includes('متقدم') || diff.includes('Advanced')) return 'bg-red-100 text-red-700 border-red-300'
  if (diff.includes('متوسط') || diff.includes('Intermediate')) return 'bg-orange-100 text-orange-700 border-orange-300'
  return 'bg-green-100 text-green-700 border-green-300'
}

/* ───────── Translate route type ───────── */
function translateType(type: string, lang: Lang) {
  if (lang === 'en') {
    switch (type) {
      case 'صحراوي': return 'Desert'
      case 'حضري': return 'Urban'
      case 'جبلي': return 'Mountain'
      case 'حضري/ساحلي': return 'Urban/Coastal'
      default: return type
    }
  }
  return type
}

function translateDifficulty(diff: string, lang: Lang) {
  if (lang === 'en') {
    if (diff.includes('متقدم')) return diff.replace('متقدم', 'Advanced').replace('متوسط', 'Intermediate').replace('مبتدئ', 'Beginner')
    if (diff.includes('متوسط')) return diff.replace('متوسط', 'Intermediate').replace('مبتدئ', 'Beginner')
    if (diff.includes('مبتدئ')) return diff.replace('مبتدئ', 'Beginner')
  }
  return diff
}

/* ───────── Route Weather Component ───────── */
function RouteWeather({ lat, lng, lang }: { lat: number; lng: number; lang: Lang }) {
  const [data, setData] = useState<{ temp: number; wind: number } | null>(null)

  useEffect(() => {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`)
      .then(res => res.json())
      .then(d => {
        if (d && d.current_weather) {
          setData({
            temp: d.current_weather.temperature,
            wind: d.current_weather.windspeed
          })
        }
      })
      .catch(() => {})
  }, [lat, lng])

  if (!data) return null

  return (
    <div className="flex items-center gap-3 bg-background/60 backdrop-blur-sm border border-border/40 px-2 py-1 rounded-md mt-2 w-fit">
      <div className="flex items-center gap-1">
        <Thermometer className="size-3 text-[#f97316]" />
        <span className="text-[10px] font-bold">{Math.round(data.temp)}°C</span>
      </div>
      <div className="w-px h-3 bg-border/50" />
      <div className="flex items-center gap-1">
        <Wind className="size-3 text-blue-500" />
        <span className="text-[10px] font-bold">{Math.round(data.wind)} {lang === 'ar' ? 'كم/س' : 'km/h'}</span>
      </div>
    </div>
  )
}


/* ───────── Route Card ───────── */


function RouteCard({ route, lang }: { route: RouteItem; lang: Lang }) {
  const txt = t[lang]
  const displayName = lang === 'en' ? route.nameEn : route.nameAr
  const displayType = translateType(route.type, lang)
  const displayDifficulty = translateDifficulty(route.difficulty, lang)
  return (
    <motion.div whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }} transition={{ duration: 0.2 }}>
      <Card className="h-full overflow-hidden border-border/60">
        <div className="relative h-56 w-full overflow-hidden group">
          <Image
            src={route.image}
            alt={displayName}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Gallery Indicator */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full border border-white/20">
            <Activity className="size-3" />
            <span>{lang === 'ar' ? '5+ صور' : '5+ Photos'}</span>
          </div>
        </div>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <CardTitle className="text-lg font-bold text-primary leading-tight">
                {displayName}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">{lang === 'en' ? route.nameAr : route.nameEn}</p>
              
              {/* Route Specific Weather */}
              <RouteWeather lat={route.coords.lat} lng={route.coords.lng} lang={lang} />
            </div>
            <Badge variant="outline" className={typeBadgeClass(route.type)}>
              {displayType}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-4 text-primary" />
              {route.length}
            </span>
            <Badge variant="outline" className={difficultyBadgeClass(route.difficulty)}>
              {displayDifficulty}
            </Badge>
          </div>
          <Separator />
          <ul className="space-y-1.5">
            {route.features.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="size-4 text-secondary shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <a
            href={route.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-[#f97316]/10 px-4 py-2.5 text-sm font-bold text-[#f97316] hover:bg-[#f97316]/20 transition-colors"
          >
            <Map className="size-4" />
            {txt.openInMaps}
          </a>
        </CardContent>
      </Card>
    </motion.div>
  )
}


/* ───────── Gear Card ───────── */
function GearCard({ item, lang }: { item: GearItem; lang: Lang }) {
  const getIcon = (category: string) => {
    switch (category) {
      case 'clothing': return <Shirt className="size-5 text-primary" />
      case 'safety': return <Shield className="size-5 text-primary" />
      case 'tech': return <Cpu className="size-5 text-primary" />
      default: return <Footprints className="size-5 text-primary" />
    }
  }

  const categoryLabel = (category: string) => {
    if (lang === 'ar') {
      switch (category) {
        case 'clothing': return 'ملابس'
        case 'safety': return 'سلامة'
        case 'tech': return 'تقنية'
        default: return ''
      }
    }
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  return (
    <Card className="h-full overflow-hidden border-border/60 group hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={item.image}
          alt={lang === 'ar' ? item.nameAr : item.nameEn}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg shadow-lg border border-border/50 flex items-center gap-1.5">
          {getIcon(item.category)}
          <span className="text-[10px] font-bold text-primary">{categoryLabel(item.category)}</span>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-primary leading-tight">
          {lang === 'ar' ? item.nameAr : item.nameEn}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {lang === 'ar' ? item.descAr : item.descEn}
        </p>

        {/* Highlights */}
        <div className="space-y-1.5">
          {item.highlights.map((h, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="mt-1.5 size-1.5 rounded-full bg-primary flex-shrink-0" />
              <span className="text-xs text-foreground/80 leading-relaxed">{lang === 'ar' ? h.ar : h.en}</span>
            </div>
          ))}
        </div>

        {/* Best For */}
        <div className="flex items-start gap-2 pt-2 border-t border-border/40">
          <MapPin className="size-3.5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
              {lang === 'ar' ? 'أفضل لـ' : 'Best for'}
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
              {lang === 'ar' ? item.bestForAr : item.bestForEn}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Home() {


  const [mobileOpen, setMobileOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [lang, setLang] = useState<Lang>('ar')

  const txt = t[lang]

  /* Track scroll for back-to-top button */
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* Dark mode toggle */
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  /* Language direction toggle */
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang])

  /* Search logic */
  const allRoutes = [...dubaiRoutes, ...abuDhabiRoutes, ...sharjahRoutes, ...northernRegularRoutes, ...mountainRoutes, ...cyclingDubaiRoutes, ...cyclingAbuDhabiRoutes, ...cyclingSharjahRoutes, ...cyclingNorthernRoutes, ...cyclingMountainRoutes]
  const searchResults = searchQuery.trim()
    ? allRoutes.filter(r =>
        r.nameAr.includes(searchQuery) ||
        r.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.type.includes(searchQuery) ||
        r.length.includes(searchQuery) ||
        r.features.some(f => f.includes(searchQuery))
      )
    : []

  /* Advanced Share Function */
  function shareSite() {
    const shareData = {
      title: txt.siteName,
      text: lang === 'ar' ? 'اكتشف أفضل مسارات الجري في الإمارات' : 'Discover the best running routes in the UAE',
      url: typeof window !== 'undefined' ? window.location.href : '',
    }

    if (navigator.share) {
      navigator.share(shareData).catch(console.error)
    } else {
      // Fallback for social sharing if native share is not available
      const encodedUrl = encodeURIComponent(shareData.url)
      const encodedText = encodeURIComponent(shareData.text)
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`
      window.open(whatsappUrl, '_blank')
    }
  }

  const navLinks = [
    { label: txt.navHome, href: '#home' },
    { label: txt.exploreMap, href: '#map' },
    { label: txt.navRoutes, href: '#routes' },
    { label: txt.smartTools, href: '#tools' },
    { label: txt.navEquipment, href: '#equipment' },
    { label: txt.navTips, href: '#tips' },
    { label: txt.navContact, href: '#contact' },
  ]

  function scrollTo(id: string) {
    const el = document.querySelector(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  /* ───────── RENDER ───────── */
  return (
    <div className="min-h-screen flex flex-col">
      {/* ════════ HEADER ════════ */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md shadow-sm">
        {/* ── Tools Bar: Language | Dark Mode | Share ── */}
        <div className="bg-primary/5 border-b border-border/50">
          <div className="mx-auto max-w-7xl flex items-center justify-end px-4 sm:px-6 lg:px-8 h-10 gap-1">
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              suppressHydrationWarning
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-foreground/70 hover:text-primary hover:bg-primary/10 transition-all"
              aria-label={lang === 'ar' ? 'English' : 'العربية'}
            >
              <Globe className="size-3.5" />
              <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
            </button>
            <div className="w-px h-4 bg-border/60" />
            {/* Dark Mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              suppressHydrationWarning
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-foreground/70 hover:text-primary hover:bg-primary/10 transition-all"
              aria-label={darkMode ? txt.lightMode : txt.darkMode}
            >
              {darkMode ? <SunMoon className="size-3.5" /> : <Moon className="size-3.5" />}
              <span>{darkMode ? txt.lightMode : txt.darkMode}</span>
            </button>
            <div className="w-px h-4 bg-border/60" />
            <button
              onClick={shareSite}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-foreground/70 hover:text-primary hover:bg-primary/10 transition-all"
              aria-label={txt.share}
            >
              <Share2 className="size-3.5" />
              <span>{txt.share}</span>
            </button>

          </div>
        </div>

        {/* ── Main Nav Bar ── */}
        <div className="border-b border-border">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <button onClick={() => scrollTo('#home')} className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt={txt.siteName}
                width={40}
                height={40}
                className="size-10 rounded"
              />
              <span className="text-lg font-bold text-primary hidden sm:inline">
                {txt.siteName}
              </span>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <Separator orientation="vertical" className="h-6 mx-1" />
              {/* Search in nav */}
              <button
                onClick={() => setShowSearch(true)}
                className="flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors"
                aria-label={txt.search}
              >
                <Search className="size-4" />
                <span className="hidden lg:inline">{txt.search}</span>
              </button>
            </nav>

            {/* Mobile: search + menu */}
            <div className="flex md:hidden items-center gap-1">
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 text-foreground/80 hover:text-primary transition-colors"
                aria-label={txt.search}
              >
                <Search className="size-5" />
              </button>
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="size-6" />
                    <span className="sr-only">{txt.openMenu}</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side={lang === 'ar' ? 'right' : 'left'} className="w-72">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-3">
                      <Image
                        src="/images/logo.png"
                        alt={txt.siteName}
                        width={32}
                        height={32}
                        className="size-8 rounded"
                      />
                      {txt.siteName}
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-1 mt-4">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.href}>
                        <button
                          onClick={() => scrollTo(link.href)}
                          className={`px-4 py-3 rounded-md text-base font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                        >
                          {link.label}
                        </button>
                      </SheetClose>
                    ))}
                    <Separator className="my-2" />
                    {/* Tools in mobile menu */}
                    <button
                      onClick={() => { setLang(lang === 'ar' ? 'en' : 'ar'); setMobileOpen(false) }}
                      suppressHydrationWarning
                      className={`px-4 py-3 rounded-md text-base font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors flex items-center gap-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                    >
                      <Globe className="size-5" />
                      {lang === 'ar' ? 'English' : 'عربي'}
                    </button>
                    <button
                      onClick={() => { setDarkMode(!darkMode); setMobileOpen(false) }}
                      suppressHydrationWarning
                      className={`px-4 py-3 rounded-md text-base font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors flex items-center gap-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                    >
                      {darkMode ? <SunMoon className="size-5" /> : <Moon className="size-5" />}
                      {darkMode ? txt.lightMode : txt.darkMode}
                    </button>
                    <SheetClose asChild>
                      <button
                        onClick={shareSite}
                        className={`px-4 py-3 rounded-md text-base font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors flex items-center gap-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                      >
                        <Share2 className="size-5" />
                        {txt.share}
                      </button>
                    </SheetClose>

                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* ════════ HERO ════════ */}
      <section id="home" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/hero-cycling.jpg"
          alt={lang === 'ar' ? 'مسار جري في الإمارات' : 'Running track in the UAE'}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a365d]/80 via-[#1a365d]/60 to-[#1a365d]/80" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight"
          >
            {txt.heroTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed"
          >
            {txt.heroDesc}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8"
          >
            <Button
              size="lg"
              className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold text-lg px-8 py-6 rounded-xl shadow-lg shadow-orange-500/30 transition-transform hover:scale-105"
              onClick={() => scrollTo('#routes')}
            >
              <Footprints className={`size-5 ${lang === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {txt.browseRoutes}
            </Button>
          </motion.div>
        </div>
      </section>



      <main className="flex-1">
        {/* ════════ WHY UAE ════════ */}
        <section id="why-uae" className="py-16 sm:py-20 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-primary">{txt.whyUae}</h2>
                <p className="mt-4 text-muted-foreground max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
                  {txt.whyUaeDesc}
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  img: '/images/urban-cycling.jpg',
                  alt: txt.urbanAlt,
                  title: txt.urbanRoutes,
                  desc: txt.urbanDesc,
                  icon: Building2,
                },
                {
                  img: '/images/desert-cycling.jpg',
                  alt: txt.desertAlt,
                  title: txt.desertRoutes,
                  desc: txt.desertDesc,
                  icon: Sun,
                },
                {
                  img: '/images/mountain-cycling.jpg',
                  alt: txt.mountainAlt,
                  title: txt.mountainRoutesTitle,
                  desc: txt.mountainDesc,
                  icon: MountainSnow,
                },
              ].map((card, i) => (
                <FadeIn key={card.title} delay={i * 0.15}>
                  <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
                    <Card className="overflow-hidden h-full border-border/60">
                      <div className="relative h-52">
                        <Image src={card.img} alt={card.alt} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-3 right-4 flex items-center gap-2">
                          <div className="flex size-9 items-center justify-center rounded-full bg-card/90 text-primary">
                            <card.icon className="size-5" />
                          </div>
                          <span className="text-white font-bold text-lg">{card.title}</span>
                        </div>
                      </div>
                      <CardContent className="pt-4">
                        <p className="text-muted-foreground text-sm">{card.desc}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ════════ INTERACTIVE MAP ════════ */}
        <section id="map" className="py-16 sm:py-20 bg-muted/30 border-y border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-primary">
                  {txt.exploreMap}
                </h2>
                <p className="mt-4 text-muted-foreground max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
                  {txt.exploreMapDesc}
                </p>
              </div>
            </FadeIn>
            <InteractiveMap lang={lang} />
          </div>
        </section>

        {/* ════════ ROUTES (MERGED) ════════ */}
        <section id="routes" className="py-16 sm:py-20 bg-muted/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-primary">
                  {txt.routesTitle}
                </h2>
                <p className="mt-4 text-muted-foreground max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
                  {txt.routesDesc}
                </p>
              </div>
            </FadeIn>

            {/* ─── TOP LEVEL: Cycling vs Running ─── */}
            <Tabs defaultValue="cycling" dir={lang === 'ar' ? 'rtl' : 'ltr'} className="w-full">
              <TabsList className="mx-auto flex w-full max-w-md mb-8 bg-card shadow-sm rounded-xl h-auto p-1 border border-border">
                <TabsTrigger value="cycling" className="flex-1 py-2.5 text-sm font-bold rounded-lg data-[state=active]:bg-[#f97316] data-[state=active]:text-white">
                  <Bike className={`size-4 ${lang === 'ar' ? 'ml-1.5' : 'mr-1.5'} inline`} />
                  🚴 {lang === 'ar' ? 'الدراجات' : 'Cycling'}
                </TabsTrigger>
                <TabsTrigger value="running" className="flex-1 py-2.5 text-sm font-bold rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Footprints className={`size-4 ${lang === 'ar' ? 'ml-1.5' : 'mr-1.5'} inline`} />
                  🏃 {lang === 'ar' ? 'الجري' : 'Running'}
                </TabsTrigger>
              </TabsList>

              {/* ─── CYCLING Routes ─── */}
              <TabsContent value="cycling">
                <Tabs defaultValue="regular" dir={lang === 'ar' ? 'rtl' : 'ltr'} className="w-full">
                  <TabsList className="mx-auto flex w-full max-w-md mb-8 bg-card shadow-sm rounded-xl h-auto p-1 border border-border">
                    <TabsTrigger value="regular" className="flex-1 py-2.5 text-sm font-bold rounded-lg data-[state=active]:bg-[#f97316] data-[state=active]:text-white">
                      <Bike className={`size-4 ${lang === 'ar' ? 'ml-1.5' : 'mr-1.5'} inline`} />
                      {txt.regularRoutes}
                    </TabsTrigger>
                    <TabsTrigger value="mountain" className="flex-1 py-2.5 text-sm font-bold rounded-lg data-[state=active]:bg-[#f97316] data-[state=active]:text-white">
                      <MountainSnow className={`size-4 ${lang === 'ar' ? 'ml-1.5' : 'mr-1.5'} inline`} />
                      {txt.mountainRoutesTab}
                    </TabsTrigger>
                  </TabsList>

                  {/* Cycling Regular Routes (by Emirate) */}
                  <TabsContent value="regular">
                    <Tabs defaultValue="dubai" dir={lang === 'ar' ? 'rtl' : 'ltr'} className="w-full">
                      <TabsList className="mx-auto flex w-full max-w-xl mb-8 bg-card shadow-sm rounded-xl h-auto p-1 border border-border">
                        <TabsTrigger value="dubai" className="flex-1 py-2.5 text-sm font-bold rounded-lg data-[state=active]:bg-[#f97316] data-[state=active]:text-white">
                          {txt.dubai}
                        </TabsTrigger>
                        <TabsTrigger value="abudhabi" className="flex-1 py-2.5 text-sm font-bold rounded-lg data-[state=active]:bg-[#f97316] data-[state=active]:text-white">
                          {txt.abuDhabi}
                        </TabsTrigger>
                        <TabsTrigger value="sharjah" className="flex-1 py-2.5 text-sm font-bold rounded-lg data-[state=active]:bg-[#f97316] data-[state=active]:text-white">
                          {txt.sharjah}
                        </TabsTrigger>
                        <TabsTrigger value="northern" className="flex-1 py-2.5 text-sm font-bold rounded-lg data-[state=active]:bg-[#f97316] data-[state=active]:text-white">
                          {txt.northernEmirates}
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="dubai">
                        <TabContent routes={cyclingDubaiRoutes} lang={lang} />
                      </TabsContent>
                      <TabsContent value="abudhabi">
                        <TabContent routes={cyclingAbuDhabiRoutes} lang={lang} />
                      </TabsContent>
                      <TabsContent value="sharjah">
                        <TabContent routes={cyclingSharjahRoutes} lang={lang} />
                      </TabsContent>
                      <TabsContent value="northern">
                        <TabContent routes={cyclingNorthernRoutes} lang={lang} />
                      </TabsContent>
                    </Tabs>
                  </TabsContent>

                  {/* Cycling Mountain Routes */}
                  <TabsContent value="mountain">
                    <TabContent routes={cyclingMountainRoutes} lang={lang} />
                  </TabsContent>
                </Tabs>
              </TabsContent>

              {/* ─── RUNNING Routes ─── */}
              <TabsContent value="running">
                <Tabs defaultValue="regular" dir={lang === 'ar' ? 'rtl' : 'ltr'} className="w-full">
                  <TabsList className="mx-auto flex w-full max-w-md mb-8 bg-card shadow-sm rounded-xl h-auto p-1 border border-border">
                    <TabsTrigger value="regular" className="flex-1 py-2.5 text-sm font-bold rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                      <Footprints className={`size-4 ${lang === 'ar' ? 'ml-1.5' : 'mr-1.5'} inline`} />
                      {txt.regularRoutes}
                    </TabsTrigger>
                    <TabsTrigger value="mountain" className="flex-1 py-2.5 text-sm font-bold rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                      <MountainSnow className={`size-4 ${lang === 'ar' ? 'ml-1.5' : 'mr-1.5'} inline`} />
                      {txt.mountainRoutesTab}
                    </TabsTrigger>
                  </TabsList>

                  {/* Running Regular Routes (by Emirate) */}
                  <TabsContent value="regular">
                    <Tabs defaultValue="dubai" dir={lang === 'ar' ? 'rtl' : 'ltr'} className="w-full">
                      <TabsList className="mx-auto flex w-full max-w-xl mb-8 bg-card shadow-sm rounded-xl h-auto p-1 border border-border">
                        <TabsTrigger value="dubai" className="flex-1 py-2.5 text-sm font-bold rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                          {txt.dubai}
                        </TabsTrigger>
                        <TabsTrigger value="abudhabi" className="flex-1 py-2.5 text-sm font-bold rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                          {txt.abuDhabi}
                        </TabsTrigger>
                        <TabsTrigger value="sharjah" className="flex-1 py-2.5 text-sm font-bold rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                          {txt.sharjah}
                        </TabsTrigger>
                        <TabsTrigger value="northern" className="flex-1 py-2.5 text-sm font-bold rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                          {txt.northernEmirates}
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="dubai">
                        <TabContent routes={dubaiRoutes} lang={lang} />
                      </TabsContent>
                      <TabsContent value="abudhabi">
                        <TabContent routes={abuDhabiRoutes} lang={lang} />
                      </TabsContent>
                      <TabsContent value="sharjah">
                        <TabContent routes={sharjahRoutes} lang={lang} />
                      </TabsContent>
                      <TabsContent value="northern">
                        <TabContent routes={northernRegularRoutes} lang={lang} />
                      </TabsContent>
                    </Tabs>
                  </TabsContent>

                  {/* Running Mountain Routes */}
                  <TabsContent value="mountain">
                    <TabContent routes={mountainRoutes} lang={lang} />
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* ════════ SMART TOOLS ════════ */}
        <section id="tools" className="py-16 sm:py-20 bg-background overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-primary">
                  {txt.smartTools}
                </h2>
                <p className="mt-4 text-muted-foreground max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
                  {txt.smartToolsDesc}
                </p>
              </div>
            </FadeIn>
            <SmartTools lang={lang} weather={{ temp: 28, wind: 12 }} />
          </div>
        </section>

        {/* ════════ EQUIPMENT (MERGED) ════════ */}
        <section id="equipment" className="py-16 sm:py-20 bg-muted/30 relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#f97316] rounded-full blur-3xl" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <FadeIn>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-primary">
                  {txt.equipmentTitle}
                </h2>
              </div>
            </FadeIn>

            {/* ─── TOP LEVEL: Cycling vs Running ─── */}
            <Tabs defaultValue="cycling" dir={lang === 'ar' ? 'rtl' : 'ltr'} className="w-full">
              <TabsList className="mx-auto flex w-full max-w-md mb-8 bg-card shadow-sm rounded-xl h-auto p-1 border border-border">
                <TabsTrigger value="cycling" className="flex-1 py-2.5 text-sm font-bold rounded-lg data-[state=active]:bg-[#f97316] data-[state=active]:text-white">
                  <Bike className={`size-4 ${lang === 'ar' ? 'ml-1.5' : 'mr-1.5'} inline`} />
                  🚴 {lang === 'ar' ? 'الدراجات' : 'Cycling'}
                </TabsTrigger>
                <TabsTrigger value="running" className="flex-1 py-2.5 text-sm font-bold rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Footprints className={`size-4 ${lang === 'ar' ? 'ml-1.5' : 'mr-1.5'} inline`} />
                  🏃 {lang === 'ar' ? 'الجري' : 'Running'}
                </TabsTrigger>
              </TabsList>

              {/* ─── Cycling Equipment ─── */}
              <TabsContent value="cycling">
                <FadeIn>
                  <div className="text-center mb-8">
                    <Badge className="mb-4 bg-[#f97316]/10 text-[#f97316] hover:bg-[#f97316]/20 border-[#f97316]/20">
                      {ct[lang].cyclingGearUp}
                    </Badge>
                    <p className="text-muted-foreground max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
                      {ct[lang].cyclingEquipmentDesc}
                    </p>
                  </div>
                </FadeIn>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {cyclingGearItems.map((item, idx) => (
                    <FadeIn key={idx} delay={idx * 0.1}>
                      <GearCard item={item} lang={lang} />
                    </FadeIn>
                  ))}
                </div>

                {/* Pre-Ride Checklist */}
                <FadeIn delay={0.4}>
                  <div className="mt-16 bg-background/60 backdrop-blur-md rounded-3xl border border-[#f97316]/10 overflow-hidden shadow-xl">
                    <div className="bg-[#f97316] px-6 py-4">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <CheckCircle2 className="size-6" />
                        {ct[lang].cyclingChecklist}
                      </h3>
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[
                        { titleAr: 'الخوذة (Helmet)', titleEn: 'Helmet', descAr: 'ارتدِ خوذة معتمدة دائماً – إلزامية قانونياً في الإمارات.', descEn: 'Always wear a certified helmet — legally required in the UAE.', icon: <Shield className="size-5" /> },
                        { titleAr: 'الدراجة (Bike)', titleEn: 'Bike Check', descAr: 'تأكد من الفرامل والإطارات والسلسلة قبل كل طلعة.', descEn: 'Check brakes, tires, and chain before every ride.', icon: <Wrench className="size-5" /> },
                        { titleAr: 'الإضاءة (Lights)', titleEn: 'Lights', descAr: 'أضواء أمامية وخلفية إلزامية قبل المغيب وفي الليل.', descEn: 'Front and rear lights are mandatory after sunset.', icon: <Lightbulb className="size-5" /> },
                        { titleAr: 'الترطيب (Hydration)', titleEn: 'Hydration', descAr: 'احمل قارورة ماء أو حزام ترطيب خاصة في الأجواء الحارة.', descEn: 'Carry a water bottle or hydration belt, especially in hot weather.', icon: <Wind className="size-5" /> },
                        { titleAr: 'الهاتف (Phone)', titleEn: 'Phone', descAr: 'احمل هاتفك لمشاركة موقعك في حال الطوارئ.', descEn: 'Carry your phone to share your location in emergencies.', icon: <Shield className="size-5" /> },
                        { titleAr: 'الطقس (Weather)', titleEn: 'Weather', descAr: 'راجع حالة الطقس وخطط مسارك وفقاً للرياح ودرجة الحرارة.', descEn: 'Check the weather and plan your route based on wind and temperature.', icon: <Wind className="size-5" /> },
                      ].map((check, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-[#f97316]/5 transition-colors border border-transparent hover:border-[#f97316]/10 group">
                          <div className="flex-shrink-0 size-10 rounded-full bg-[#f97316]/10 text-[#f97316] flex items-center justify-center group-hover:bg-[#f97316] group-hover:text-white transition-all">
                            {check.icon}
                          </div>
                          <div>
                            <h4 className="font-bold text-primary mb-1">{lang === 'ar' ? check.titleAr : check.titleEn}</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">{lang === 'ar' ? check.descAr : check.descEn}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeIn>

                <FadeIn delay={0.6}>
                  <div className="mt-12 p-6 rounded-2xl bg-[#f97316]/5 border border-[#f97316]/10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 text-center md:text-right">
                      <div className="p-3 rounded-full bg-[#f97316]/10 text-[#f97316]">
                        <Shield className="size-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#f97316]">{ct[lang].cyclingSafetyFirst}</h4>
                        <p className="text-sm text-muted-foreground">{ct[lang].cyclingSafetyDesc}</p>
                      </div>
                    </div>
                    <Button className="rounded-full px-8 bg-[#f97316] hover:bg-[#ea580c] text-white shadow-lg shadow-orange-500/20">
                      {ct[lang].cyclingSafetyGuide}
                    </Button>
                  </div>
                </FadeIn>
              </TabsContent>

              {/* ─── Running Equipment ─── */}
              <TabsContent value="running">
                <FadeIn>
                  <div className="text-center mb-8">
                    <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                      {lang === 'ar' ? 'تجهيزك للأداء' : 'Gear Up for Performance'}
                    </Badge>
                    <p className="text-muted-foreground max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
                      {txt.equipmentDesc}
                    </p>
                  </div>
                </FadeIn>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {gearItems.map((item, idx) => (
                    <FadeIn key={idx} delay={idx * 0.1}>
                      <GearCard item={item} lang={lang} />
                    </FadeIn>
                  ))}
                </div>

                {/* Pre-Run Checklist Section */}
                <FadeIn delay={0.4}>
                  <div className="mt-16 bg-background/60 backdrop-blur-md rounded-3xl border border-primary/10 overflow-hidden shadow-xl">
                    <div className="bg-primary px-6 py-4">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <CheckCircle2 className="size-6" />
                        {lang === 'ar' ? 'فحص السلامة قبل كل جري' : 'Pre-Run Safety Checklist'}
                      </h3>
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[
                        { titleAr: 'الأحذية', titleEn: 'Shoes', descAr: 'تأكد من سلامة الحذاء وملاءمته لنوع المسار — إسفلت للكورنيش، تريل للجبال.', descEn: 'Check your shoes are in good condition and suited for the terrain — asphalt for corniche, trail for mountains.', icon: <Footprints className="size-5" /> },
                        { titleAr: 'الترطيب', titleEn: 'Hydration', descAr: 'احمل مياه كافية أو حزام ترطيب — تحتاج 500 مل كل 20 دقيقة في حرارة الإمارات.', descEn: 'Carry enough water or a hydration belt — you need 500ml every 20 min in UAE heat.', icon: <Droplets className="size-5" /> },
                        { titleAr: 'الرؤية', titleEn: 'Visibility', descAr: 'استخدم أضواء أو عاكسات وسترة مضيئة في الفجر والمغيب — المسارات مزدحمة.', descEn: 'Use lights, reflectors, and an illuminated vest at dawn and dusk — tracks are busy.', icon: <Lightbulb className="size-5" /> },
                        { titleAr: 'الإحماء', titleEn: 'Warm-up', descAr: 'ابدأ بإحماء 5-10 دقائق مشي سريع قبل الجري لتجنب إصابات العضلات والمفاصل.', descEn: 'Start with a 5-10 minute brisk walk warm-up to avoid muscle and joint injuries.', icon: <Activity className="size-5" /> },
                        { titleAr: 'الهاتف', titleEn: 'Phone', descAr: 'احمل هاتفك في حزام أو جيب لمشاركة موقعك في حال الطوارئ — مهم في المسارات النائية.', descEn: 'Carry your phone in a belt or pocket for emergencies — crucial on remote tracks.', icon: <Shield className="size-5" /> },
                        { titleAr: 'الطقس', titleEn: 'Weather', descAr: 'راجع حالة الطقس والرطوبة — الرطوبة فوق 70% تجعل الجري خطيراً حتى في درجات حرارة معتدلة.', descEn: 'Check the weather and humidity — humidity above 70% makes running dangerous even at moderate temps.', icon: <Thermometer className="size-5" /> },
                        { titleAr: 'واقي الشمس', titleEn: 'Sunscreen', descAr: 'ضع واقي شمسي SPF 50+ قبل 15 دقيقة من الجري — أشعة UV في الإمارات شديدة جداً.', descEn: 'Apply SPF 50+ sunscreen 15 minutes before running — UV rays in the UAE are extremely intense.', icon: <Sun className="size-5" /> },
                        { titleAr: 'الإلكترولايت', titleEn: 'Electrolytes', descAr: 'احمل أقراص أو مسحوق إلكترولايت لتعويض الأملاح المفقودة بالعرق — الماء وحده لا يكفي.', descEn: 'Carry electrolyte tablets or powder to replace lost salts — water alone is not enough.', icon: <Heart className="size-5" /> },
                        { titleAr: 'التهدئة', titleEn: 'Cool-down', descAr: 'اختم بـ 5 دقائق مشي بطيء وتمارين إطالة لمنع التشنجات وتسريع الاستشفاء.', descEn: 'Finish with 5 minutes of slow walking and stretching to prevent cramps and speed up recovery.', icon: <Timer className="size-5" /> },
                      ].map((check, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/10 group">
                          <div className="flex-shrink-0 size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                            {check.icon}
                          </div>
                          <div>
                            <h4 className="font-bold text-primary mb-1">{lang === 'ar' ? check.titleAr : check.titleEn}</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">{lang === 'ar' ? check.descAr : check.descEn}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeIn>

                <FadeIn delay={0.6}>
                  <div className="mt-12 p-6 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 text-center md:text-right">
                      <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <Shield className="size-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-primary">{lang === 'ar' ? 'السلامة أولاً' : 'Safety First'}</h4>
                        <p className="text-sm text-muted-foreground">{lang === 'ar' ? 'تذكر دائماً ارتداء أحذية مناسبة والبدء بإحماء قبل كل جري.' : 'Always remember to wear proper shoes and warm up before every run.'}</p>
                      </div>
                    </div>
                    <Button className="rounded-full px-8 shadow-lg shadow-primary/20">
                      {lang === 'ar' ? 'دليل السلامة الشامل' : 'Full Safety Guide'}
                    </Button>
                  </div>
                </FadeIn>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* ════════ TIPS (MERGED) ════════ */}
        <section id="tips" className="py-16 sm:py-20 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-primary">
                  {txt.tipsTitle}
                </h2>
              </div>
            </FadeIn>

            {/* ─── TOP LEVEL: Cycling vs Running ─── */}
            <Tabs defaultValue="cycling" dir={lang === 'ar' ? 'rtl' : 'ltr'} className="w-full">
              <TabsList className="mx-auto flex w-full max-w-md mb-8 bg-card shadow-sm rounded-xl h-auto p-1 border border-border">
                <TabsTrigger value="cycling" className="flex-1 py-2.5 text-sm font-bold rounded-lg data-[state=active]:bg-[#f97316] data-[state=active]:text-white">
                  <Bike className={`size-4 ${lang === 'ar' ? 'ml-1.5' : 'mr-1.5'} inline`} />
                  🚴 {lang === 'ar' ? 'الدراجات' : 'Cycling'}
                </TabsTrigger>
                <TabsTrigger value="running" className="flex-1 py-2.5 text-sm font-bold rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Footprints className={`size-4 ${lang === 'ar' ? 'ml-1.5' : 'mr-1.5'} inline`} />
                  🏃 {lang === 'ar' ? 'الجري' : 'Running'}
                </TabsTrigger>
              </TabsList>

              {/* ─── Cycling Tips ─── */}
              <TabsContent value="cycling">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {[
                    { tip: ct[lang].cyclingTip1, icon: <Sun className="size-6" /> },
                    { tip: ct[lang].cyclingTip2, icon: <Wind className="size-6" /> },
                    { tip: ct[lang].cyclingTip3, icon: <Wrench className="size-6" /> },
                    { tip: ct[lang].cyclingTip4, icon: <Shield className="size-6" /> },
                    { tip: ct[lang].cyclingTip5, icon: <Lightbulb className="size-6" /> },
                    { tip: ct[lang].cyclingTip6, icon: <Shield className="size-6" /> },
                  ].map((item, i) => (
                    <FadeIn key={i} delay={i * 0.1}>
                      <Card className="h-full border-border/60 hover:shadow-md transition-shadow">
                        <CardContent className="p-6 flex items-start gap-4">
                          <div className="flex-shrink-0 size-12 rounded-full bg-[#f97316]/10 text-[#f97316] flex items-center justify-center">
                            {item.icon}
                          </div>
                          <p className="text-sm leading-relaxed text-foreground">
                            {item.tip}
                          </p>
                        </CardContent>
                      </Card>
                    </FadeIn>
                  ))}
                </div>
              </TabsContent>

              {/* ─── Running Tips ─── */}
              <TabsContent value="running">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {[
                    { tip: txt.tip1, icon: <Sun className="size-6" /> },
                    { tip: txt.tip2, icon: <Droplets className="size-6" /> },
                    { tip: txt.tip3, icon: <Footprints className="size-6" /> },
                    { tip: txt.tip4, icon: <Activity className="size-6" /> },
                    { tip: txt.tip5, icon: <Lightbulb className="size-6" /> },
                    { tip: txt.tip6, icon: <Shield className="size-6" /> },
                    { tip: txt.tip7, icon: <Thermometer className="size-6" /> },
                    { tip: txt.tip8, icon: <Wind className="size-6" /> },
                    { tip: txt.tip9, icon: <Heart className="size-6" /> },
                  ].map((item, i) => (
                    <FadeIn key={i} delay={i * 0.08}>
                      <Card className="h-full border-border/60 hover:shadow-md transition-shadow">
                        <CardContent className="p-6 flex items-start gap-4">
                          <div className="flex-shrink-0 size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                            {item.icon}
                          </div>
                          <p className="text-sm leading-relaxed text-foreground">
                            {item.tip}
                          </p>
                        </CardContent>
                      </Card>
                    </FadeIn>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* ════════ CONTACT ════════ */}
        <section id="contact" className="py-16 sm:py-20 bg-muted/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-primary">{txt.contactUs}</h2>
                <p className="mt-3 text-muted-foreground">
                  {txt.contactDesc}
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
              <FadeIn delay={0.1}>
                <Card className="border-border/60">
                  <CardContent className="p-6 space-y-5">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-foreground">
                        {txt.nameLabel}
                      </label>
                      <Input id="name" placeholder={txt.namePlaceholder} className="bg-card" suppressHydrationWarning />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-foreground">
                        {txt.emailLabel}
                      </label>
                      <Input id="email" type="email" placeholder="example@email.com" className="bg-card" dir="ltr" suppressHydrationWarning />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-foreground">
                        {txt.messageLabel}
                      </label>
                      <Textarea
                        id="message"
                        placeholder={txt.messagePlaceholder}
                        rows={5}
                        className="bg-card resize-none"
                        suppressHydrationWarning
                      />
                    </div>
                    <Button
                      className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white font-bold py-5 rounded-xl shadow-lg shadow-orange-500/20 transition-transform hover:scale-[1.02]"
                      onClick={() => {
                        /* placeholder */
                      }}
                    >
                      <Send className={`size-4 ${lang === 'ar' ? 'ml-2' : 'mr-2'}`} />
                      {txt.sendMessage}
                    </Button>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className="flex flex-col justify-center gap-6">
                  <div className="flex items-center gap-4 bg-card rounded-xl p-5 shadow-sm border border-border">
                    <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Mail className="size-5" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{txt.emailTitle}</p>
                      <p className="text-muted-foreground text-sm" dir="ltr">info@uaerunningroutes.ae</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-card rounded-xl p-5 shadow-sm border border-border">
                    <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Phone className="size-5" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{txt.phoneTitle}</p>
                      <p className="text-muted-foreground text-sm" dir="ltr">+971 2 123 4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-card rounded-xl p-5 shadow-sm border border-border">
                    <div className="flex size-12 items-center justify-center rounded-full bg-[#f97316]/10 text-[#f97316]">
                      <Footprints className="size-5" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{txt.followUs}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
                          <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </a>
                        <a href="#" aria-label="X (Twitter)" className="text-muted-foreground hover:text-primary transition-colors">
                          <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </a>
                        <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
                          <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
      </main>

      {/* ════════ FOOTER ════════ */}
      <footer className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt={txt.siteName}
                width={32}
                height={32}
                className="size-8 rounded"
              />
              <span className="font-bold text-lg">{txt.siteName}</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              {txt.copyright}
            </p>
            <div className="flex items-center gap-4 mt-1">
              <a href="#" aria-label="Facebook" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" aria-label="X (Twitter)" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ════════ SCROLL TO TOP ════════ */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed bottom-6 ${lang === 'ar' ? 'left-6' : 'right-6'} z-50 flex size-12 items-center justify-center rounded-full bg-[#f97316] text-white shadow-lg shadow-orange-500/30 hover:bg-[#ea580c] transition-colors`}
          aria-label={txt.backToTop}
        >
          <ChevronUp className="size-6" />
        </motion.button>
      )}



      {/* ════════ SEARCH OVERLAY ════════ */}
      {showSearch && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-sm"
          onClick={() => { setShowSearch(false); setSearchQuery('') }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-card rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b">
              <Search className="size-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={txt.searchPlaceholder}
                className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
                autoFocus
              />
              <button
                onClick={() => { setShowSearch(false); setSearchQuery('') }}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {txt.close}
              </button>
            </div>

            {/* Results */}
            {searchQuery.trim() && (
              <div className="max-h-80 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((route) => (
                    <button
                      key={route.nameEn}
                      onClick={() => {
                        setShowSearch(false)
                        setSearchQuery('')
                        window.open(route.mapsUrl, '_blank')
                      }}
                      className="w-full flex items-center gap-3 px-5 py-3 hover:bg-muted/50 transition-colors text-right"
                    >
                      <MapPin className="size-4 text-[#f97316] shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-foreground">{lang === 'en' ? route.nameEn : route.nameAr}</p>
                        <p className="text-xs text-muted-foreground">{lang === 'en' ? route.nameAr : route.nameEn} • {translateType(route.type, lang)} • {route.length}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-5 py-8 text-center text-muted-foreground text-sm">
                    {txt.noResults} &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            )}

            {/* Quick filters */}
            {!searchQuery.trim() && (
              <div className="px-5 py-4 space-y-3">
                <p className="text-xs font-medium text-muted-foreground">بحث سريع</p>
                <div className="flex flex-wrap gap-2">
                  {['صحراوي', 'حضري', 'جبلي', 'متقدم', 'مبتدئ', 'دبي', 'أبوظبي'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground hover:bg-primary hover:text-white transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
      {/* Bottom padding */}
      <div className="h-12" />
    </div>
  )
}

/* ───────── Tab Content helper ───────── */
function TabContent({
  routes,
  lang,
}: {
  routes: RouteItem[]
  lang: Lang
}) {
  return (
    <FadeIn>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {routes.map((route, i) => (
          <FadeIn key={route.nameEn} delay={i * 0.1}>
            <RouteCard route={route} lang={lang} />
          </FadeIn>
        ))}
      </div>
    </FadeIn>
  )
}
