'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bike,
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
  Facebook,
  Twitter,
  Instagram,
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
  Footprints,
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
    siteName: 'مسارات الإمارات للدراجات',
    navHome: 'الرئيسية',
    navRoutes: 'المسارات',
    navEquipment: 'المعدات',
    navTips: 'نصائح',
    navContact: 'اتصل بنا',
    search: 'بحث',
    searchPlaceholder: 'ابحث عن مسار... (مثال: القدرة، جبلي، دبي)',
    darkMode: 'داكن',
    lightMode: 'فاتح',
    share: 'مشاركة',
    routesNav: 'المسارات',
    heroTitle: 'اكتشف أفضل مسارات الدراجات في الإمارات',
    heroDesc: 'دليلك الشامل لمضامير الدراجات في دبي وأبوظبي والشارقة وباقي إمارات الدولة، مع قائمة الأدوات المهمة في كل طلعة ونصائح للسلامة.',
    browseRoutes: 'تصفح المسارات',
    whyUae: 'لماذا الإمارات؟',
    whyUaeDesc: 'تمتاز الإمارات ببنية تحتية متطورة للدراجات، ومسارات مخصصة وآمنة، وطقس مشمس خلال معظم أشهر السنة. سواء كنت تبحث عن مسار حضري بجانب البحر أو تحدي تسلق الجبال أو مضمار صحراوي للسرعة، ستجد خيارات تناسب مستواك.',
    urbanRoutes: 'مسارات حضرية',
    desertRoutes: 'مسارات صحراوية',
    mountainRoutesTitle: 'مسارات جبلية',
    urbanDesc: 'الكورنيش – قناة دبي – مصدر',
    desertDesc: 'القدرة – ند الشبا – الوثبة',
    mountainDesc: 'جبل جيس – جبل حفيت – خور فكان',
    urbanAlt: 'مسار دراجات حضري',
    desertAlt: 'مسار دراجات صحراوي',
    mountainAlt: 'مسار دراجات جبلي',
    routesTitle: 'أشهر مسارات الدراجات في الإمارات',
    routesDesc: 'استكشف قائمة بأهم المضامير في كل إمارة، مع نبذة عن طول المسار ونوعه ومناسبته للمبتدئين أو المحترفين.',
    regularRoutes: 'المسارات العادية',
    mountainRoutesTab: 'المسارات الجبلية',
    dubai: 'دبي',
    abuDhabi: 'أبوظبي',
    sharjah: 'الشارقة',
    northernEmirates: 'الإمارات الشمالية',
    equipmentTitle: 'دليل معداتك لكل طلعة',
    equipmentDesc: 'في بيئة مثل الإمارات، المعدات الصحيحة ليست رفاهية؛ بل جزء أساسي من السلامة والاستمتاع بالركوب. هذا الحد الأدنى من الأدوات ننصح بحملها في أي طلعة.',
    safetyEquip: 'معدات السلامة',
    maintenanceKit: 'طقم الصيانة الطارئة',
    hydration: 'الترطيب والتغذية',
    tipsTitle: 'نصائح لرحلة آمنة وممتعة',
    tip1: 'راجع الطقس واختر الوقت المناسب (الصباح الباكر في الصيف – أي وقت في الشتاء)',
    tip2: 'احمل معك مياه كافية + شوارد',
    tip3: 'تأكد أن دراجتك صالحة (فرامل – إطارات – سلسلة)',
    tip4: 'ارتدِ الخوذة دائماً',
    tip5: 'استخدم أضواء واضحة في الصباح الباكر وقبل المغيب',
    tip6: 'أخبر أحداً بمسارك ووقت المتوقع للعودة إذا كنت تذهب وحدك لمسار نائي',
    usefulLinks: 'روابط مفيدة',
    usefulLinksDesc: 'مجموعة من المواقع والمراجع الرسمية والموثوقة لمساعدتك في رحلتك',
    mapsAndRoutes: 'خرائط ومسارات',
    officialEntities: 'جهات رسمية',
    safetyAndLaws: 'سلامة وقوانين',
    exploreMap: 'خريطة المسارات التفاعلية',
    exploreMapDesc: 'اكتشف مواقع المسارات الرئيسية في جميع أنحاء الإمارات وابدأ رحلتك الآن.',
    currentWeather: 'حالة الطقس الحالية',
    smartTools: 'أدوات الدراج الذكية',
    smartToolsDesc: 'استخدم أدواتنا الذكية المدعومة بالبيانات الحية لتخطيط رحلتك القادمة وحساب احتياجاتك البدنية.',
    virtualTour: 'جولات افتراضية 360 درجة',
    virtualTourDesc: 'استكشف تضاريس المسارات قبل الذهاب من خلال الجولات الافتراضية عالية الدقة.',
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
    copyright: 'جميع الحقوق محفوظة – مسارات الإمارات للدراجات',
    privacyPolicy: 'سياسة الخصوصية',
    termsAndConditions: 'الشروط والأحكام',
    desert: 'صحراوي',
    urban: 'حضري',
    urban: 'حضري',
    mountain: 'جبلي',
    coastal: 'حضري/ساحلي',
    beginner: 'مبتدئ',
    intermediate: 'متوسط',
    advanced: 'متقدم',
  },
  en: {
    siteName: 'UAE Cycling Routes',
    navHome: 'Home',
    navRoutes: 'Routes',
    navEquipment: 'Equipment',
    navTips: 'Tips',
    navContact: 'Contact',
    search: 'Search',
    searchPlaceholder: 'Search for a route... (e.g. Al Qudra, mountain, Dubai)',
    darkMode: 'Dark',
    lightMode: 'Light',
    share: 'Share',
    routesNav: 'Routes',
    heroTitle: 'Discover the Best Cycling Routes in the UAE',
    heroDesc: 'Your comprehensive guide to cycling tracks in Dubai, Abu Dhabi, Sharjah, and the rest of the Emirates, with essential gear lists and safety tips.',
    browseRoutes: 'Browse Routes',
    whyUae: 'Why the UAE?',
    whyUaeDesc: 'The UAE boasts world-class cycling infrastructure, dedicated safe tracks, and sunny weather most of the year. Whether you seek an urban coastal ride, a mountain climbing challenge, or a desert speed track, you will find options that match your level.',
    urbanRoutes: 'Urban Routes',
    desertRoutes: 'Desert Routes',
    mountainRoutesTitle: 'Mountain Routes',
    urbanDesc: 'Corniche – Dubai Canal – Masdar',
    desertDesc: 'Al Qudra – Nad Al Sheba – Al Wathba',
    mountainDesc: 'Jebel Jais – Jebel Hafeet – Khor Fakkan',
    urbanAlt: 'Urban cycling route',
    desertAlt: 'Desert cycling route',
    mountainAlt: 'Mountain cycling route',
    routesTitle: 'Most Popular Cycling Routes in the UAE',
    routesDesc: 'Explore a curated list of the top tracks in each emirate, with details on track length, type, and suitability for beginners or pros.',
    regularRoutes: 'Regular Routes',
    mountainRoutesTab: 'Mountain Routes',
    dubai: 'Dubai',
    abuDhabi: 'Abu Dhabi',
    sharjah: 'Sharjah',
    northernEmirates: 'Northern Emirates',
    equipmentTitle: 'Your Gear Guide for Every Ride',
    equipmentDesc: 'In the UAE environment, the right gear is not a luxury — it is essential for safety and enjoyment. Here is the minimum kit we recommend for any ride.',
    safetyEquip: 'Safety Gear',
    maintenanceKit: 'Emergency Repair Kit',
    hydration: 'Hydration & Nutrition',
    tipsTitle: 'Tips for a Safe & Enjoyable Ride',
    tip1: 'Check the weather and choose the right time (early morning in summer – anytime in winter)',
    tip2: 'Carry enough water + electrolytes',
    tip3: 'Make sure your bike is roadworthy (brakes – tires – chain)',
    tip4: 'Always wear a helmet',
    tip5: 'Use clear lights in the early morning and before sunset',
    tip6: 'Tell someone your route and expected return time if riding alone on a remote track',
    usefulLinks: 'Useful Links',
    usefulLinksDesc: 'A collection of official and trusted websites and references to help you on your journey',
    mapsAndRoutes: 'Maps & Routes',
    officialEntities: 'Official Entities',
    safetyAndLaws: 'Safety & Laws',
    exploreMap: 'Interactive Track Map',
    exploreMapDesc: 'Discover major cycling locations across the UAE and start your journey.',
    currentWeather: 'Current Weather',
    smartTools: 'Smart Cycling Tools',
    smartToolsDesc: 'Use our data-driven tools to plan your next ride and calculate your physical needs based on live weather.',
    virtualTour: '360° Virtual Tours',
    virtualTourDesc: 'Explore track terrains before you go with our high-definition virtual tours.',
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
    copyright: 'All Rights Reserved – UAE Cycling Routes',
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

/* ───────── Route data ───────── */
type RouteItem = {
  nameAr: string
  nameEn: string
  type: 'صحراوي' | 'حضري' | 'جبلي' | 'حضري/ساحلي'
  length: string
  difficulty: string
  features: string[]
  mapsUrl: string
  image: string
  coords: { lat: number; lng: number }
}

const dubaiRoutes: RouteItem[] = [
  {
    nameAr: 'مسار القدرة',
    nameEn: 'Al Qudra Cycle Track',
    type: 'صحراوي',
    length: 'حلقات: 18 / 20 / 30 / 50 / 64 / 86 كم',
    difficulty: 'متوسط–متقدم',
    features: ['إسفلت ممتاز وصيانة مستمرة', 'إضاءة ليلاً على أجزاء من المسار', 'منطقة استراحة وخدمات', 'مناظر صحراوية وحياة برية (المها العربي)', 'مجاني ومفتوح 24 ساعة'],
    mapsUrl: 'https://www.google.com/maps/search/Al+Qudra+Cycling+Track+Dubai',
    image: '/images/dubai-al-qudra.jpg',
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
    image: '/images/dubai-nad-al-sheba.jpg',
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
    image: '/images/dubai-autodrome.jpg',
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
    image: '/images/dubai-water-canal.jpg',
    coords: { lat: 25.19, lng: 55.25 },
  },
  {
    nameAr: 'حديقة مشرف',
    nameEn: 'Mushrif Park',
    type: 'صحراوي',
    length: 'حوالي 13 كم (مسار أخضر) + مسارات جبلية',
    difficulty: 'مبتدئ–متوسط',
    features: ['11 مسار دراجات جبلية بمستويات مختلفة', 'مسار أخضر للمبتدئين 5.6 كم', 'مجموع مسارات 39 كم مع الخوانيج', 'بيئة طبيعية وأشجار غابة', 'تأجير دراجات متاح'],
    mapsUrl: 'https://www.google.com/maps/search/Mushrif+Park+MTB+Trails+Dubai',
    image: '/images/dubai-mushrif-park.jpg',
    coords: { lat: 25.21, lng: 55.45 },
  },
]

const abuDhabiRoutes: RouteItem[] = [
  {
    nameAr: 'الكورنيش أبوظبي',
    nameEn: 'Abu Dhabi Corniche Cycle Path',
    type: 'حضري',
    length: '12 كم (من ميناء زايد إلى مارينا مول)',
    difficulty: 'مبتدئ',
    features: ['مسار مخصص وآمن للدراجات', 'مناظر بحرية رائعة على الخليج العربي', 'مجاني ومفتوح طوال اليوم', 'قريب من المطاعم والمرافق', 'مناسب للعائلات والمبتدئين'],
    mapsUrl: 'https://www.google.com/maps/search/Abu+Dhabi+Corniche+Cycling+Track',
    image: '/images/abudhabi-corniche.jpg',
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
    image: '/images/abudhabi-yas-marina.jpg',
    coords: { lat: 24.47, lng: 54.60 },
  },
  {
    nameAr: 'مدينة مصدر',
    nameEn: 'Masdar City Running & Cycling Track',
    type: 'حضري',
    length: '5.6 كم حلقة حول المدينة',
    difficulty: 'مبتدئ',
    features: ['مسار أخضر صديق للبيئة', 'ظلال كثيفة وأشجار', 'ينطلق من حديقة مصدر', 'بيئة مستدامة وهادئة', 'مجاني ومفتوح للجميع'],
    mapsUrl: 'https://www.google.com/maps/search/Masdar+City+Cycling+Track+Abu+Dhabi',
    image: '/images/abudhabi-masdar.jpg',
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
    image: '/images/abudhabi-al-wathba.jpg',
    coords: { lat: 24.16, lng: 54.73 },
  },
  {
    nameAr: 'جزيرة الحديريات',
    nameEn: 'Al Hudayriat Island Cycling Track',
    type: 'حضري',
    length: 'حلقات إسفلت: 5 / 10 / 15 كم | مسار جبلي Trail X: 15 كم (إجمالي 28 كم)',
    difficulty: 'مبتدئ–متقدم',
    features: ['حلقات إسفلت مخصصة: 5 كم / 10 كم / 15 كم', 'Trail X – أول مسار دراجات جبلية في أبوظبي (أخضر 8.9 كم / أزرق 2.8 كم / أحمر 1.9 كم / أسود 1.9 كم)', 'مقطع علوي مرفوع فوق البحر بمناظر خلابة', 'تأجير دراجات ابتداءً من 50 درهم/ساعة', 'نادي أبوظبي للدراجات ADCC مع مقهى وغرف تغيير', 'مجاني ومفتوح 24 ساعة', 'ربط مع شبكة الدراجات الرئيسية في أبوظبي'],
    mapsUrl: 'https://www.google.com/maps/search/Al+Hudayriat+Island+Cycling+Track+Abu+Dhabi',
    image: '/images/abudhabi-hudayriat.jpg',
    coords: { lat: 24.43, lng: 54.35 },
  },
]

const sharjahRoutes: RouteItem[] = [
  {
    nameAr: 'مجمع مسار – مسار الدراجات',
    nameEn: 'Masaar Track – Al Suyoh',
    type: 'حضري',
    length: '6.6 كم حلقة كاملة',
    difficulty: 'مبتدئ–متوسط',
    features: ['3 أنفاق وجسر مخصص للدراجات', 'إضاءة كاملة 24 ساعة', 'مفتوح على مدار الساعة', 'يخترق غابة الأشجار في المجمع', 'تصميم يناسب المبتدئين والمحترفين'],
    mapsUrl: 'https://www.google.com/maps/search/Masaar+Track+Al+Suyoh+Sharjah+Cycling',
    image: '/images/sharjah-masaar.jpg',
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
    image: '/images/sharjah-university.jpg',
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
    image: '/images/sharjah-batayeh.jpg',
    coords: { lat: 25.2033, lng: 55.6573 },
  },
]

const northernRegularRoutes: RouteItem[] = [
  {
    nameAr: 'جزيرة مريجان – رأس الخيمة',
    nameEn: 'Marjan Island Corniche',
    type: 'حضري',
    length: '3.5 كم مسار مخصص + حلقات حول الجزيرة',
    difficulty: 'مبتدئ',
    features: ['مسار ساحلي مخصص وآمن', 'عرض 4 أمتار – مشترك مع المشاة', 'يربط بقرية الحمراء', 'مناظر بحرية خلابة', 'يمر بجانب الفنادق والمنتزهات'],
    mapsUrl: 'https://www.google.com/maps/search/Marjan+Island+Corniche+Cycling+Ras+Al+Khaimah',
    image: '/images/rak-marjan.jpg',
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
    image: '/images/fujairah-khor-fakkan.jpg',
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
    image: '/images/ajman-cycling.jpg',
    coords: { lat: 25.41, lng: 55.43 },
  },
]

const mountainRoutes: RouteItem[] = [
  {
    nameAr: 'جبل جيس – رأس الخيمة',
    nameEn: 'Jebel Jais Climb',
    type: 'جبلي',
    length: '21 كم صعود (متوسط ميل 5.5%)',
    difficulty: 'متقدم',
    features: ['أعلى قمة في الإمارات (1,934 م)', 'ارتفاع 1,000 م من نقطة البداية', 'أقصى ميل 6.1% – تصنيف.cat 1', 'مرحلة رسمية في UAE Tour', 'مناظر جبلية خلابة من القمة'],
    mapsUrl: 'https://www.google.com/maps/search/Jebel+Jais+Climb+Cycling+Ras+Al+Khaimah',
    image: '/images/rak-jebel-jais.jpg',
    coords: { lat: 25.93, lng: 56.12 },
  },
  {
    nameAr: 'جبل حفيت – العين',
    nameEn: 'Jebel Hafeet Climb',
    type: 'جبلي',
    length: '10.6 كم صعود (متوسط ميل 7%)',
    difficulty: 'متقدم',
    features: ['تصنيف.cat 1 عالمياً', 'من أجمل 10 تسلق دراجات في العالم', 'ميل يصل إلى 30% في بعض الأجزاء', 'منظر خلاب من القمة 1,249 م', 'مرحلة رسمية في UAE Tour'],
    mapsUrl: 'https://www.google.com/maps/search/Jebel+Hafeet+Climb+Al+Ain',
    image: '/images/abudhabi-jebel-hafeet.jpg',
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
    image: '/images/dubai-hatta-mtb.jpg',
    coords: { lat: 24.81, lng: 56.12 },
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
}

const gearItems: GearItem[] = [
  {
    nameAr: 'طقم فريق الإمارات 2026 (Pissei)',
    nameEn: 'UAE Team Emirates 2026 Kit',
    descAr: 'الطقم الرسمي المعتمد لموسم 2026، يتميز باللون الأبيض الناصع مع أكمام سوداء وشعارات الرعاة الرسميين.',
    descEn: 'The official 2026 season kit, featuring clinical white with black sleeves and official sponsor logos.',
    image: '/images/uae-team-kit-official.png',
    category: 'clothing',
  },
  {
    nameAr: 'خوذة الفريق الاحترافية',
    nameEn: 'Official Team Helmet',
    descAr: 'خوذة كربونية خفيفة الوزن بألوان الفريق، تدمج بين الأمان العالي والديناميكية الهوائية المثالية.',
    descEn: 'Lightweight carbon helmet in team colors, merging high safety with optimal aerodynamics.',
    image: '/images/uae-team-helmet.png',
    category: 'safety',
  },
  {
    nameAr: 'قفازات الأداء العالي',
    nameEn: 'High Performance Gloves',
    descAr: 'القفازات الرسمية للفريق بتصميم نصفي، توفر حماية فائقة وتهوية مثالية لليدين.',
    descEn: 'Official team fingerless gloves, providing superior protection and optimal ventilation.',
    image: '/images/uae-team-gloves-official.png',
    category: 'clothing',
  },
  {
    nameAr: 'أحذية الفريق (الإصدار الأبيض)',
    nameEn: 'Team Edition Shoes (White)',
    descAr: 'أحذية احترافية باللون الأبيض الناصع مع نعل كربوني صلب لأقصى درجات نقل القوة.',
    descEn: 'Professional shoes in clinical white with stiff carbon soles for maximum power transfer.',
    image: '/images/uae-team-shoes-white.png',
    category: 'clothing',
  },
  {
    nameAr: 'نظام الإنارة الذكي',
    nameEn: 'Smart Lighting System',
    descAr: 'إنارات LED عالية الكثافة مدمجة مع دراجات الفريق لضمان الرؤية الواضحة في التمارين الليلية.',
    descEn: 'High-intensity LED lights integrated with team bikes to ensure clear visibility during night training.',
    image: '/images/uae-team-lights.png',
    category: 'safety',
  },
  {
    nameAr: 'كمبيوتر الدراجة (Team GPS)',
    nameEn: 'Team GPS Computer',
    descAr: 'أحدث أجهزة التتبع بشعار الفريق، توفر خرائط حية لمسارات الإمارات وتحليل دقيق للأداء.',
    descEn: 'Latest tracking devices with team logo, providing live maps of UAE tracks and precise performance analysis.',
    image: '/images/uae-team-gps.png',
    category: 'tech',
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
          
          {/* Gallery Indicator [Point 8] */}
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
      case 'clothing': return <Shirt className="size-6 text-primary" />
      case 'safety': return <Shield className="size-6 text-primary" />
      case 'tech': return <Cpu className="size-6 text-primary" />
      default: return <Bike className="size-6 text-primary" />
    }
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
        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-border/50">
          {getIcon(item.category)}
        </div>
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary">
          {lang === 'ar' ? item.nameAr : item.nameEn}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {lang === 'ar' ? item.descAr : item.descEn}
        </p>
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
  const allRoutes = [...dubaiRoutes, ...abuDhabiRoutes, ...sharjahRoutes, ...northernRegularRoutes, ...mountainRoutes]
  const searchResults = searchQuery.trim()
    ? allRoutes.filter(r =>
        r.nameAr.includes(searchQuery) ||
        r.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.type.includes(searchQuery) ||
        r.length.includes(searchQuery) ||
        r.features.some(f => f.includes(searchQuery))
      )
    : []

  /* Advanced Share Function [Point 6] */
  function shareSite() {
    const shareData = {
      title: txt.siteName,
      text: lang === 'ar' ? 'اكتشف أفضل مسارات الدراجات في الإمارات' : 'Discover the best cycling routes in the UAE',
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
    { label: lang === 'ar' ? 'المعدات' : 'Equipment', href: '#equipment' },
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
          alt={lang === 'ar' ? 'مسار دراجات صحراوي في الإمارات' : 'Desert cycling track in the UAE'}
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
              <Bike className={`size-5 ${lang === 'ar' ? 'ml-2' : 'mr-2'}`} />
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

        {/* ════════ ROUTES ════════ */}
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

            {/* ─── Main Tabs: Regular vs Mountain ─── */}
            <Tabs defaultValue="regular" dir={lang === 'ar' ? 'rtl' : 'ltr'} className="w-full">
              <TabsList className="mx-auto flex w-full max-w-md mb-8 bg-card shadow-sm rounded-xl h-auto p-1 border border-border">
                <TabsTrigger value="regular" className="flex-1 py-2.5 text-sm font-bold rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Bike className={`size-4 ${lang === 'ar' ? 'ml-1.5' : 'mr-1.5'} inline`} />
                  {txt.regularRoutes}
                </TabsTrigger>
                <TabsTrigger value="mountain" className="flex-1 py-2.5 text-sm font-bold rounded-lg data-[state=active]:bg-[#f97316] data-[state=active]:text-white">
                  <MountainSnow className={`size-4 ${lang === 'ar' ? 'ml-1.5' : 'mr-1.5'} inline`} />
                  {txt.mountainRoutesTab}
                </TabsTrigger>
              </TabsList>

              {/* ─── Regular Routes (by Emirate) ─── */}
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

              {/* ─── Mountain Routes ─── */}
              <TabsContent value="mountain">
                <TabContent routes={mountainRoutes} lang={lang} />
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

        {/* ════════ EQUIPMENT SECTION [Point 5] ════════ */}
        <section id="equipment" className="py-16 sm:py-20 bg-muted/30 relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary rounded-full blur-3xl" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <FadeIn>
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                  {lang === 'ar' ? 'تجهيزك للأداء' : 'Gear Up for Performance'}
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-primary">
                  {txt.equipmentTitle}
                </h2>
                <p className="mt-4 text-muted-foreground max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
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

            {/* Pre-Ride Checklist Section */}
            <FadeIn delay={0.4}>
              <div className="mt-16 bg-background/60 backdrop-blur-md rounded-3xl border border-primary/10 overflow-hidden shadow-xl">
                <div className="bg-primary px-6 py-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="size-6" />
                    {lang === 'ar' ? 'فحص السلامة قبل كل طلعة' : 'Pre-Ride Safety Checklist'}
                  </h3>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { titleAr: 'الإطارات (Air)', titleEn: 'Tires (Air)', descAr: 'تأكد من ضغط الهواء المناسب وعدم وجود تشققات.', descEn: 'Check for proper air pressure and no cracks.', icon: <Wind className="size-5" /> },
                    { titleAr: 'الفرامل (Brakes)', titleEn: 'Brakes', descAr: 'جرب المكابح الأمامية والخلفية للتأكد من استجابتها.', descEn: 'Test front and rear brakes for responsiveness.', icon: <Shield className="size-5" /> },
                    { titleAr: 'السلسلة (Chain)', titleEn: 'Chain', descAr: 'تأكد أن السلسلة مشحمة وتتحرك بسلاسة دون ضجيج.', descEn: 'Ensure the chain is lubed and moves smoothly.', icon: <Activity className="size-5" /> },
                    { titleAr: 'الخوذة (Helmet)', titleEn: 'Helmet', descAr: 'يجب ارتداء الخوذة دائماً وتثبيتها بشكل صحيح.', descEn: 'Always wear a helmet and fasten it correctly.', icon: <Shield className="size-5" /> },
                    { titleAr: 'الإنارة (Lights)', titleEn: 'Lights', descAr: 'تأكد من شحن الأضواء ووضوحها (خاصة فجراً ومساءً).', descEn: 'Check lights are charged and visible.', icon: <Lightbulb className="size-5" /> },
                    { titleAr: 'الماء (Hydration)', titleEn: 'Hydration', descAr: 'احمل مياه كافية وبعض الأملاح لتعويض السوائل.', descEn: 'Carry enough water and electrolytes.', icon: <Activity className="size-5" /> },
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
                    <p className="text-sm text-muted-foreground">{lang === 'ar' ? 'تذكر دائماً فحص دراجتك وارتداء الخوذة قبل كل طلعة.' : 'Always remember to check your bike and wear a helmet before every ride.'}</p>
                  </div>
                </div>
                <Button className="rounded-full px-8 shadow-lg shadow-primary/20">
                  {lang === 'ar' ? 'دليل السلامة الشامل' : 'Full Safety Guide'}
                </Button>
              </div>
            </FadeIn>
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
                      <p className="text-muted-foreground text-sm" dir="ltr">info@uaecyclingroutes.ae</p>
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
                      <Bike className="size-5" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{txt.followUs}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
                          <Facebook className="size-5" />
                        </a>
                        <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors">
                          <Twitter className="size-5" />
                        </a>
                        <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
                          <Instagram className="size-5" />
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
                <Facebook className="size-5" />
              </a>
              <a href="#" aria-label="Twitter" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Twitter className="size-5" />
              </a>
              <a href="#" aria-label="Instagram" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Instagram className="size-5" />
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
