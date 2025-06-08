'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, Brain, Dna, Droplets } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const [isClient, setIsClient] = useState(false)
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    setIsClient(true)
    const savedLanguage = localStorage.getItem('language') || 'en'
    setLanguage(savedLanguage)
  }, [])

  const t = {
    en: {
      welcome: 'Welcome to Wearable 2.0',
      description: 'Your personal AI-powered wardrobe assistant',
      aiAssistant: 'AI Wardrobe Assistant',
      aiAssistantDesc: 'Get daily outfit suggestions powered by AI',
      wardrobeDna: 'Wardrobe DNA',
      wardrobeDnaDesc: 'Discover patterns and colors that suit your body type and skin tone',
      smartWash: 'Smart Wash Cycle',
      smartWashDesc: 'Track your laundry and get care reminders',
      quickTip: 'Quick Tip',
      quickTipDesc: 'Explore the Settings page to customize your experience and make Wearable 2.0 truly yours!',
      getStarted: 'Get Started'
    },
    ar: {
      welcome: 'مرحباً بك في ويربل ٢.٠',
      description: 'مساعدك الشخصي للأزياء المدعوم بالذكاء الاصطناعي',
      aiAssistant: 'مساعد الخزانة بالذكاء الاصطناعي',
      aiAssistantDesc: 'احصل على اقتراحات يومية للأزياء مدعومة بالذكاء الاصطناعي',
      wardrobeDna: 'حمض الخزانة النووي',
      wardrobeDnaDesc: 'اكتشف الأنماط والألوان التي تناسب نوع جسمك ولون بشرتك',
      smartWash: 'دورة الغسيل الذكية',
      smartWashDesc: 'تتبع الغسيل واحصل على تذكيرات العناية',
      quickTip: 'نصيحة سريعة',
      quickTipDesc: 'استكشف صفحة الإعدادات لتخصيص تجربتك واجعل ويربل ٢.٠ ملكك حقاً!',
      getStarted: 'ابدأ الآن'
    }
  }

  const currentLang = t[language as keyof typeof t] || t.en

  if (!isClient) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-gray-200 animate-pulse rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={currentLang.welcome}
        description={currentLang.description}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-purple-600" />
              <CardTitle className="font-headline">{currentLang.aiAssistant}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Image
              src="https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg"
              alt="AI Assistant"
              width={300}
              height={200}
              className="w-full h-48 object-cover rounded-lg"
            />
            <CardDescription className="font-body">
              {currentLang.aiAssistantDesc}
            </CardDescription>
            <Link href="/assistant">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                {currentLang.getStarted}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Dna className="h-6 w-6 text-pink-600" />
              <CardTitle className="font-headline">{currentLang.wardrobeDna}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Image
              src="https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg"
              alt="Wardrobe DNA"
              width={300}
              height={200}
              className="w-full h-48 object-cover rounded-lg"
            />
            <CardDescription className="font-body">
              {currentLang.wardrobeDnaDesc}
            </CardDescription>
            <Link href="/dna">
              <Button className="w-full bg-pink-600 hover:bg-pink-700">
                {currentLang.getStarted}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Droplets className="h-6 w-6 text-blue-600" />
              <CardTitle className="font-headline">{currentLang.smartWash}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Image
              src="https://images.pexels.com/photos/963278/pexels-photo-963278.jpeg"
              alt="Smart Wash"
              width={300}
              height={200}
              className="w-full h-48 object-cover rounded-lg"
            />
            <CardDescription className="font-body">
              {currentLang.smartWashDesc}
            </CardDescription>
            <Link href="/wash-cycle">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                {currentLang.getStarted}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-lg font-headline">{currentLang.quickTip}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="font-body text-orange-800">
            {currentLang.quickTipDesc}
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}