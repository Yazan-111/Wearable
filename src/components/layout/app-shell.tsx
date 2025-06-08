'use client'

import { useState, useEffect } from 'react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { AddClothingItemDialog } from '@/components/add-clothing-item-dialog'
import { AddClothingFabIcon } from '@/components/icons/add-clothing-fab-icon'
import { 
  Sparkles, 
  Home, 
  Brain, 
  Dna, 
  Shirt, 
  Droplets, 
  Users, 
  Calendar, 
  Palette, 
  QrCode, 
  Settings,
  ScanLine
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface ClothingItem {
  id: string
  name: string
  type: string
  color: string
  season: string
  category: string
  occasion?: string
  washCount: number
  wearCount: number
  onWashList: boolean
  imageUrl: string
  brand?: string
  price?: number
  purchaseLocation?: string
  notes?: string
  condition?: string
  fabric?: string
  secondaryColor?: string
  aiConfidence?: number
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false)
  const [language, setLanguage] = useState('en')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { toast } = useToast()
  const pathname = usePathname()

  useEffect(() => {
    setIsClient(true)
    const savedLanguage = localStorage.getItem('language') || 'en'
    setLanguage(savedLanguage)
  }, [])

  const t = {
    en: {
      appName: 'Wearable 2.0',
      dashboard: 'Dashboard',
      aiAssistant: 'AI Assistant',
      wardrobeDna: 'Wardrobe DNA',
      cupboard: 'Cupboard',
      washCycle: 'Wash Cycle',
      outfits: 'Outfits',
      eventPlanning: 'Event Planning',
      themes: 'Wardrobe Themes',
      scanBarcode: 'Scan Barcode',
      settings: 'Settings',
      userName: 'Sarah Johnson',
      userEmail: 'sarah@example.com',
      scanBarcodeBtn: 'Scan Barcode',
      itemAdded: 'Item added to wardrobe successfully!'
    },
    ar: {
      appName: 'ويربل ٢.٠',
      dashboard: 'لوحة التحكم',
      aiAssistant: 'المساعد الذكي',
      wardrobeDna: 'حمض الخزانة النووي',
      cupboard: 'الخزانة',
      washCycle: 'دورة الغسيل',
      outfits: 'الأطقم',
      eventPlanning: 'تخطيط المناسبات',
      themes: 'ثيمات الخزانة',
      scanBarcode: 'مسح الباركود',
      settings: 'الإعدادات',
      userName: 'سارة أحمد',
      userEmail: 'sarah@example.com',
      scanBarcodeBtn: 'مسح الباركود',
      itemAdded: 'تم إضافة العنصر للخزانة بنجاح!'
    }
  }

  const currentLang = t[language as keyof typeof t] || t.en

  const navigationItems = [
    { href: '/', icon: Home, label: currentLang.dashboard },
    { href: '/assistant', icon: Brain, label: currentLang.aiAssistant },
    { href: '/dna', icon: Dna, label: currentLang.wardrobeDna },
    { href: '/cupboard', icon: Shirt, label: currentLang.cupboard },
    { href: '/wash-cycle', icon: Droplets, label: currentLang.washCycle },
    { href: '/outfits', icon: Users, label: currentLang.outfits },
    { href: '/event-planning', icon: Calendar, label: currentLang.eventPlanning },
    { href: '/themes', icon: Palette, label: currentLang.themes },
    { href: '/scan', icon: QrCode, label: currentLang.scanBarcode },
    { href: '/settings', icon: Settings, label: currentLang.settings },
  ]

  const handleAddItem = (item: ClothingItem) => {
    // Dispatch custom event for pages to listen to
    window.dispatchEvent(new CustomEvent('handleNewClothingItemFromGlobal', { detail: item }))
    
    toast({
      title: currentLang.itemAdded,
      description: `${item.name} has been added to your wardrobe.`,
    })
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center space-x-2 px-4 py-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <span className="font-headline text-xl font-bold">
              {isClient ? currentLang.appName : <Skeleton className="h-6 w-32" />}
            </span>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarMenu>
            {navigationItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href}>
                  <Link href={item.href} className="flex items-center space-x-2">
                    <item.icon className="h-4 w-4" />
                    <span>
                      {isClient ? item.label : <Skeleton className="h-4 w-20" />}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        
        <SidebarFooter>
          <div className="flex items-center space-x-3 px-4 py-2">
            <Avatar>
              <AvatarImage src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg" />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              {isClient ? (
                <>
                  <p className="text-sm font-medium truncate">{currentLang.userName}</p>
                  <p className="text-xs text-muted-foreground truncate">{currentLang.userEmail}</p>
                </>
              ) : (
                <>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </>
              )}
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="ml-auto">
            <Link href="/scan">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <ScanLine className="h-4 w-4" />
                <span>{isClient ? currentLang.scanBarcodeBtn : <Skeleton className="h-4 w-20" />}</span>
              </Button>
            </Link>
          </div>
        </header>
        
        <main className="flex-1 p-6">
          {children}
        </main>
        
        {/* Floating Action Button */}
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-orange-500 hover:bg-orange-600 shadow-lg z-50"
          size="icon"
        >
          <AddClothingFabIcon className="h-6 w-6" />
        </Button>
        
        <AddClothingItemDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddItem={handleAddItem}
        />
      </SidebarInset>
    </SidebarProvider>
  )
}