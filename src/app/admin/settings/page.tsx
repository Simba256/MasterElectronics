'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'

interface Settings {
  contact: {
    phone: string
    email: string
    address: string
    businessHours: string
  }
  company: {
    name: string
    tagline: string
    description: string
    mission: string
  }
  social: {
    facebook: string
    twitter: string
    linkedin: string
    instagram: string
  }
}

const defaultSettings: Settings = {
  contact: {
    phone: '',
    email: '',
    address: '',
    businessHours: '',
  },
  company: {
    name: '',
    tagline: '',
    description: '',
    mission: '',
  },
  social: {
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
  },
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings({
          contact: data.contact || defaultSettings.contact,
          company: data.company || defaultSettings.company,
          social: data.social || defaultSettings.social,
        })
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveSetting = async (key: keyof Settings) => {
    setSaving(key)
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: settings[key] }),
      })

      if (!response.ok) {
        throw new Error('Failed to save settings')
      }

      alert('Settings saved successfully!')
    } catch (error) {
      alert('Failed to save settings')
    } finally {
      setSaving(null)
    }
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
        <p className="text-gray-600 mt-1">Manage your website content and contact information</p>
      </div>

      <div className="space-y-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              id="companyName"
              label="Company Name"
              value={settings.company.name}
              onChange={(e) => setSettings({
                ...settings,
                company: { ...settings.company, name: e.target.value }
              })}
              placeholder="MasterElectronics"
            />
            <Input
              id="tagline"
              label="Tagline"
              value={settings.company.tagline}
              onChange={(e) => setSettings({
                ...settings,
                company: { ...settings.company, tagline: e.target.value }
              })}
              placeholder="Your Trusted Partner for Power Solutions"
            />
            <Textarea
              id="description"
              label="Company Description"
              value={settings.company.description}
              onChange={(e) => setSettings({
                ...settings,
                company: { ...settings.company, description: e.target.value }
              })}
              placeholder="Brief description of your company..."
            />
            <Textarea
              id="mission"
              label="Mission Statement"
              value={settings.company.mission}
              onChange={(e) => setSettings({
                ...settings,
                company: { ...settings.company, mission: e.target.value }
              })}
              placeholder="Your company's mission..."
            />
            <div className="flex justify-end">
              <Button onClick={() => saveSetting('company')} isLoading={saving === 'company'}>
                Save Company Info
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="phone"
                label="Phone Number"
                value={settings.contact.phone}
                onChange={(e) => setSettings({
                  ...settings,
                  contact: { ...settings.contact, phone: e.target.value }
                })}
                placeholder="+1 (555) 123-4567"
              />
              <Input
                id="email"
                label="Email Address"
                type="email"
                value={settings.contact.email}
                onChange={(e) => setSettings({
                  ...settings,
                  contact: { ...settings.contact, email: e.target.value }
                })}
                placeholder="info@masterelectronics.com"
              />
            </div>
            <Textarea
              id="address"
              label="Address"
              value={settings.contact.address}
              onChange={(e) => setSettings({
                ...settings,
                contact: { ...settings.contact, address: e.target.value }
              })}
              placeholder="123 Electronics Way, Tech City, TC 12345"
            />
            <Textarea
              id="businessHours"
              label="Business Hours"
              value={settings.contact.businessHours}
              onChange={(e) => setSettings({
                ...settings,
                contact: { ...settings.contact, businessHours: e.target.value }
              })}
              placeholder="Monday - Friday: 9:00 AM - 6:00 PM&#10;Saturday: 10:00 AM - 4:00 PM&#10;Sunday: Closed"
            />
            <div className="flex justify-end">
              <Button onClick={() => saveSetting('contact')} isLoading={saving === 'contact'}>
                Save Contact Info
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="facebook"
                label="Facebook URL"
                value={settings.social.facebook}
                onChange={(e) => setSettings({
                  ...settings,
                  social: { ...settings.social, facebook: e.target.value }
                })}
                placeholder="https://facebook.com/masterelectronics"
              />
              <Input
                id="twitter"
                label="Twitter URL"
                value={settings.social.twitter}
                onChange={(e) => setSettings({
                  ...settings,
                  social: { ...settings.social, twitter: e.target.value }
                })}
                placeholder="https://twitter.com/masterelectronics"
              />
              <Input
                id="linkedin"
                label="LinkedIn URL"
                value={settings.social.linkedin}
                onChange={(e) => setSettings({
                  ...settings,
                  social: { ...settings.social, linkedin: e.target.value }
                })}
                placeholder="https://linkedin.com/company/masterelectronics"
              />
              <Input
                id="instagram"
                label="Instagram URL"
                value={settings.social.instagram}
                onChange={(e) => setSettings({
                  ...settings,
                  social: { ...settings.social, instagram: e.target.value }
                })}
                placeholder="https://instagram.com/masterelectronics"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={() => saveSetting('social')} isLoading={saving === 'social'}>
                Save Social Links
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
