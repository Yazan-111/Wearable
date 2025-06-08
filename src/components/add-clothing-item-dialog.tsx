'use client'

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Upload, Sparkles, QrCode, Download, Printer, ArrowLeft, ArrowRight } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { v4 as uuidv4 } from 'uuid'
import Image from 'next/image'

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

interface AddClothingItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddItem: (item: ClothingItem) => void
  editItem?: ClothingItem
}

export function AddClothingItemDialog({ open, onOpenChange, onAddItem, editItem }: AddClothingItemDialogProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState<Partial<ClothingItem>>({
    id: editItem?.id || uuidv4(),
    name: editItem?.name || '',
    type: editItem?.type || '',
    color: editItem?.color || '',
    season: editItem?.season || '',
    category: editItem?.category || '',
    occasion: editItem?.occasion || '',
    washCount: editItem?.washCount || 0,
    wearCount: editItem?.wearCount || 0,
    onWashList: editItem?.onWashList || false,
    imageUrl: editItem?.imageUrl || '',
    brand: editItem?.brand || '',
    price: editItem?.price || 0,
    purchaseLocation: editItem?.purchaseLocation || '',
    notes: editItem?.notes || '',
    condition: editItem?.condition || 'Good',
    fabric: editItem?.fabric || '',
    secondaryColor: editItem?.secondaryColor || '',
    aiConfidence: editItem?.aiConfidence || 0
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB')
        return
      }
      
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData(prev => ({ ...prev, imageUrl: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAIScan = async () => {
    if (!selectedImage) return
    
    setIsAnalyzing(true)
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockAnalysis = {
        type: 'T-Shirt',
        color: 'Blue',
        secondaryColor: 'White',
        fabric: 'Cotton',
        season: 'Summer',
        category: 'Top',
        aiConfidence: 85
      }
      
      setFormData(prev => ({ ...prev, ...mockAnalysis }))
      setIsAnalyzing(false)
    }, 2000)
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    const newItem: ClothingItem = {
      id: formData.id!,
      name: formData.name || `${formData.type} ${formData.color}`,
      type: formData.type!,
      color: formData.color!,
      season: formData.season!,
      category: formData.category!,
      occasion: formData.occasion,
      washCount: formData.washCount!,
      wearCount: formData.wearCount!,
      onWashList: formData.onWashList!,
      imageUrl: formData.imageUrl || 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
      brand: formData.brand,
      price: formData.price,
      purchaseLocation: formData.purchaseLocation,
      notes: formData.notes,
      condition: formData.condition,
      fabric: formData.fabric,
      secondaryColor: formData.secondaryColor,
      aiConfidence: formData.aiConfidence
    }
    
    onAddItem(newItem)
    onOpenChange(false)
    
    // Reset form
    setCurrentStep(1)
    setSelectedImage(null)
    setImagePreview('')
    setFormData({
      id: uuidv4(),
      name: '',
      type: '',
      color: '',
      season: '',
      category: '',
      occasion: '',
      washCount: 0,
      wearCount: 0,
      onWashList: false,
      imageUrl: '',
      brand: '',
      price: 0,
      purchaseLocation: '',
      notes: '',
      condition: 'Good',
      fabric: '',
      secondaryColor: '',
      aiConfidence: 0
    })
  }

  const downloadQR = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const svg = document.querySelector('#qr-code svg') as SVGElement
    
    if (svg && ctx) {
      const data = new XMLSerializer().serializeToString(svg)
      const img = new Image()
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        
        const link = document.createElement('a')
        link.download = `${formData.name || 'clothing-item'}-qr.png`
        link.href = canvas.toDataURL()
        link.click()
      }
      img.src = 'data:image/svg+xml;base64,' + btoa(data)
    }
  }

  const printTag = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Clothing Tag - ${formData.name}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .tag { border: 2px solid #000; padding: 20px; width: 300px; text-align: center; }
              .qr { margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="tag">
              <h3>${formData.name}</h3>
              <div class="qr" id="print-qr"></div>
              <p>ID: ${formData.id}</p>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const progressPercentage = (currentStep / 3) * 100

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-orange-600">
            {editItem ? 'Edit Clothing Item' : 'Add New Clothing Item'}
          </DialogTitle>
          <Progress value={progressPercentage} className="w-full mt-4" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>Step {currentStep} of 3</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
        </DialogHeader>

        {currentStep === 1 && (
          <div className="space-y-6">
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5 text-orange-600" />
                  <span>Upload & AI Scan</span>
                </CardTitle>
                <CardDescription>
                  Upload a photo of your clothing item and let AI analyze it
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="image-upload">Clothing Image</Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Max file size: 5MB. Supported formats: JPG, PNG, WebP
                  </p>
                </div>

                {imagePreview && (
                  <div className="space-y-4">
                    <div>
                      <Label>Image Preview</Label>
                      <div className="mt-2 border rounded-lg overflow-hidden">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleAIScan}
                      disabled={isAnalyzing}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing with AI...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          {formData.aiConfidence ? 'Re-Scan with AI' : 'Scan with AI'}
                        </>
                      )}
                    </Button>

                    {formData.aiConfidence && (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-green-800">AI Analysis Complete</span>
                          <Badge variant="secondary">{formData.aiConfidence}% Confidence</Badge>
                        </div>
                        <p className="text-sm text-green-700">
                          AI has analyzed your image and filled in the details below. You can edit them if needed.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="T-Shirt">T-Shirt</SelectItem>
                        <SelectItem value="Shirt">Shirt</SelectItem>
                        <SelectItem value="Pants">Pants</SelectItem>
                        <SelectItem value="Jeans">Jeans</SelectItem>
                        <SelectItem value="Dress">Dress</SelectItem>
                        <SelectItem value="Jacket">Jacket</SelectItem>
                        <SelectItem value="Sweater">Sweater</SelectItem>
                        <SelectItem value="Shoes">Shoes</SelectItem>
                        <SelectItem value="Accessories">Accessories</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="color">Primary Color *</Label>
                    <Select value={formData.color} onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Red">Red</SelectItem>
                        <SelectItem value="Blue">Blue</SelectItem>
                        <SelectItem value="Green">Green</SelectItem>
                        <SelectItem value="Yellow">Yellow</SelectItem>
                        <SelectItem value="Black">Black</SelectItem>
                        <SelectItem value="White">White</SelectItem>
                        <SelectItem value="Gray">Gray</SelectItem>
                        <SelectItem value="Brown">Brown</SelectItem>
                        <SelectItem value="Pink">Pink</SelectItem>
                        <SelectItem value="Purple">Purple</SelectItem>
                        <SelectItem value="Orange">Orange</SelectItem>
                        <SelectItem value="Navy">Navy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <Select value={formData.secondaryColor} onValueChange={(value) => setFormData(prev => ({ ...prev, secondaryColor: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select secondary color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        <SelectItem value="Red">Red</SelectItem>
                        <SelectItem value="Blue">Blue</SelectItem>
                        <SelectItem value="Green">Green</SelectItem>
                        <SelectItem value="Yellow">Yellow</SelectItem>
                        <SelectItem value="Black">Black</SelectItem>
                        <SelectItem value="White">White</SelectItem>
                        <SelectItem value="Gray">Gray</SelectItem>
                        <SelectItem value="Brown">Brown</SelectItem>
                        <SelectItem value="Pink">Pink</SelectItem>
                        <SelectItem value="Purple">Purple</SelectItem>
                        <SelectItem value="Orange">Orange</SelectItem>
                        <SelectItem value="Navy">Navy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="fabric">Fabric Type</Label>
                    <Select value={formData.fabric} onValueChange={(value) => setFormData(prev => ({ ...prev, fabric: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fabric" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cotton">Cotton</SelectItem>
                        <SelectItem value="Polyester">Polyester</SelectItem>
                        <SelectItem value="Wool">Wool</SelectItem>
                        <SelectItem value="Silk">Silk</SelectItem>
                        <SelectItem value="Linen">Linen</SelectItem>
                        <SelectItem value="Denim">Denim</SelectItem>
                        <SelectItem value="Leather">Leather</SelectItem>
                        <SelectItem value="Synthetic">Synthetic</SelectItem>
                        <SelectItem value="Mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="season">Season *</Label>
                    <Select value={formData.season} onValueChange={(value) => setFormData(prev => ({ ...prev, season: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select season" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Summer">Summer</SelectItem>
                        <SelectItem value="Winter">Winter</SelectItem>
                        <SelectItem value="Spring">Spring</SelectItem>
                        <SelectItem value="Fall">Fall</SelectItem>
                        <SelectItem value="Spring/Fall">Spring/Fall</SelectItem>
                        <SelectItem value="All Season">All Season</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Top">Top</SelectItem>
                        <SelectItem value="Bottom">Bottom</SelectItem>
                        <SelectItem value="Outerwear">Outerwear</SelectItem>
                        <SelectItem value="Shoes">Shoes</SelectItem>
                        <SelectItem value="Accessories">Accessories</SelectItem>
                        <SelectItem value="Full Outfit">Full Outfit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle>Customizable Details</CardTitle>
                <CardDescription>
                  Add additional information about your clothing item
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Item Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Blue Cotton T-Shirt"
                    />
                  </div>

                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                      placeholder="e.g., Nike, Zara"
                    />
                  </div>

                  <div>
                    <Label htmlFor="condition">Condition</Label>
                    <Select value={formData.condition} onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Excellent">Excellent</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                        <SelectItem value="Poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="price">Purchase Price</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="purchaseLocation">Purchase Location</Label>
                    <Input
                      id="purchaseLocation"
                      value={formData.purchaseLocation}
                      onChange={(e) => setFormData(prev => ({ ...prev, purchaseLocation: e.target.value }))}
                      placeholder="e.g., Mall, Online"
                    />
                  </div>

                  <div>
                    <Label htmlFor="occasion">Occasion</Label>
                    <Select value={formData.occasion} onValueChange={(value) => setFormData(prev => ({ ...prev, occasion: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select occasion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        <SelectItem value="Casual">Casual</SelectItem>
                        <SelectItem value="Work">Work</SelectItem>
                        <SelectItem value="Formal">Formal</SelectItem>
                        <SelectItem value="Party">Party</SelectItem>
                        <SelectItem value="Sport">Sport</SelectItem>
                        <SelectItem value="Sleep">Sleep</SelectItem>
                        <SelectItem value="Beach">Beach</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="washCount">Wash Count</Label>
                    <Input
                      id="washCount"
                      type="number"
                      value={formData.washCount}
                      onChange={(e) => setFormData(prev => ({ ...prev, washCount: Number(e.target.value) }))}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="wearCount">Wear Count</Label>
                    <Input
                      id="wearCount"
                      type="number"
                      value={formData.wearCount}
                      onChange={(e) => setFormData(prev => ({ ...prev, wearCount: Number(e.target.value) }))}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any additional notes about this item..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <QrCode className="h-5 w-5 text-orange-600" />
                  <span>Your Item Tag & Confirmation</span>
                </CardTitle>
                <CardDescription>
                  Review your item details and get your unique QR code
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Item Details</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Name:</strong> {formData.name || `${formData.type} ${formData.color}`}</div>
                      <div><strong>Type:</strong> {formData.type}</div>
                      <div><strong>Color:</strong> {formData.color}</div>
                      {formData.secondaryColor && <div><strong>Secondary Color:</strong> {formData.secondaryColor}</div>}
                      <div><strong>Season:</strong> {formData.season}</div>
                      <div><strong>Category:</strong> {formData.category}</div>
                      {formData.brand && <div><strong>Brand:</strong> {formData.brand}</div>}
                      {formData.fabric && <div><strong>Fabric:</strong> {formData.fabric}</div>}
                      {formData.condition && <div><strong>Condition:</strong> {formData.condition}</div>}
                    </div>
                  </div>

                  <div className="text-center">
                    <h4 className="font-semibold mb-3">QR Code</h4>
                    <div id="qr-code" className="inline-block p-4 bg-white border rounded-lg">
                      <QRCodeSVG
                        value={`https://wearable.app/item/${formData.id}`}
                        size={150}
                        level="M"
                        includeMargin={true}
                      />
                    </div>
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-muted-foreground">
                        Item ID: {formData.id}
                      </p>
                      <div className="flex space-x-2 justify-center">
                        <Button size="sm" variant="outline" onClick={downloadQR}>
                          <Download className="h-4 w-4 mr-1" />
                          Download QR
                        </Button>
                        <Button size="sm" variant="outline" onClick={printTag}>
                          <Printer className="h-4 w-4 mr-1" />
                          Print Tag
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-semibold mb-2">Printable Tag Preview</h4>
                  <div className="border-2 border-dashed border-gray-300 p-4 bg-white text-center max-w-xs mx-auto">
                    <h5 className="font-bold">{formData.name || `${formData.type} ${formData.color}`}</h5>
                    <div className="my-2">
                      <QRCodeSVG
                        value={`https://wearable.app/item/${formData.id}`}
                        size={80}
                        level="M"
                      />
                    </div>
                    <p className="text-xs">ID: {formData.id?.slice(0, 8)}...</p>
                  </div>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-800">
                    <strong>Ready to add to wardrobe!</strong> Your item has been analyzed and tagged. 
                    Click "Add Item to Wardrobe" to save it to your collection.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {currentStep < 3 ? (
            <Button
              onClick={handleNext}
              disabled={!formData.type || !formData.color || !formData.season || !formData.category}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {editItem ? 'Save Changes' : 'Add Item to Wardrobe'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}