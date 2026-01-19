'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'

interface Category {
  id: string
  name: string
}

interface Product {
  id?: string
  name: string
  description: string
  shortDescription?: string
  price?: string
  categoryId?: string
  images: string[]
  specifications?: Record<string, string>
  featured: boolean
  isActive: boolean
}

interface ProductFormProps {
  product?: Product
  categories: Category[]
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    shortDescription: product?.shortDescription || '',
    price: product?.price || '',
    categoryId: product?.categoryId || '',
    images: product?.images || [],
    specifications: product?.specifications || {},
    featured: product?.featured || false,
    isActive: product?.isActive !== false,
  })

  const [newSpecKey, setNewSpecKey] = useState('')
  const [newSpecValue, setNewSpecValue] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const url = product?.id ? `/api/products/${product.id}` : '/api/products'
      const method = product?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save product')
      }

      router.push('/admin/products')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const { url } = await response.json()
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, url],
      }))
    } catch (err) {
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const addSpecification = () => {
    if (!newSpecKey.trim() || !newSpecValue.trim()) return
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [newSpecKey]: newSpecValue,
      },
    }))
    setNewSpecKey('')
    setNewSpecValue('')
  }

  const removeSpecification = (key: string) => {
    setFormData((prev) => {
      const newSpecs = { ...prev.specifications }
      delete newSpecs[key]
      return { ...prev, specifications: newSpecs }
    })
  }

  const categoryOptions = [
    { value: '', label: 'Select a category' },
    ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          id="name"
          label="Product Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter product name"
          required
        />

        <Input
          id="price"
          label="Price (optional)"
          type="number"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          placeholder="0.00"
        />
      </div>

      <Input
        id="shortDescription"
        label="Short Description"
        value={formData.shortDescription}
        onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
        placeholder="Brief description for product cards"
      />

      <Textarea
        id="description"
        label="Full Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Detailed product description"
        required
        className="min-h-[150px]"
      />

      <Select
        id="categoryId"
        label="Category"
        value={formData.categoryId}
        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
        options={categoryOptions}
      />

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
        <div className="flex flex-wrap gap-4 mb-4">
          {formData.images.map((image, index) => (
            <div key={index} className="relative">
              <img src={image} alt="" className="w-24 h-24 object-cover rounded-lg" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {uploading ? 'Uploading...' : 'Add Image'}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {/* Specifications */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Specifications</label>
        <div className="space-y-2 mb-4">
          {Object.entries(formData.specifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
              <span className="text-sm">
                <strong>{key}:</strong> {value}
              </span>
              <button
                type="button"
                onClick={() => removeSpecification(key)}
                className="text-red-500 hover:text-red-600"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Specification name"
            value={newSpecKey}
            onChange={(e) => setNewSpecKey(e.target.value)}
          />
          <Input
            placeholder="Value"
            value={newSpecValue}
            onChange={(e) => setNewSpecValue(e.target.value)}
          />
          <Button type="button" variant="outline" onClick={addSpecification}>
            Add
          </Button>
        </div>
      </div>

      {/* Toggles */}
      <div className="flex gap-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Featured product</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Active (visible on site)</span>
        </label>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {product?.id ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  )
}
