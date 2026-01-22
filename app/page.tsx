"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StoreCard } from "@/components/store-card"
import { Plus, Store, Edit2, Check, X } from "lucide-react"
import type { ProductCategory, Product, StoreData, CategoryNames } from "@/lib/database.types"

const defaultCategoryNames: CategoryNames = {
  category1: "Електроніка",
  category2: "Аксесуари",
  category3: "Послуги",
}

export default function InventoryTracker() {
  const [categoryNames, setCategoryNames] = useState<CategoryNames>(defaultCategoryNames)
  const [editingCategory, setEditingCategory] = useState<"category1" | "category2" | "category3" | null>(null)
  const [editedCategoryName, setEditedCategoryName] = useState("")
  const [stores, setStores] = useState<StoreData[]>([])
  const [loading, setLoading] = useState(true)

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadData()
    setupRealtimeSync()
    
    // Очистка подписки при размонтировании
    return () => {
      // Подписки будут очищены автоматически
    }
  }, [])

  // Настройка синхронизации в реальном времени
  const setupRealtimeSync = async () => {
    try {
      const { getSupabaseClient } = await import('@/lib/supabase-client')
      const supabase = getSupabaseClient()
      
      if (!supabase) {
        console.warn('Supabase не настроен. Данные не будут синхронизироваться между устройствами.')
        console.warn('Добавьте переменные окружения NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY в Vercel.')
        return
      }

      // Подписка на изменения в таблице stores
      const storesChannel = supabase
        .channel('stores-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'stores',
          },
          (payload) => {
            console.log('Stores changed:', payload)
            loadData() // Перезагружаем данные при изменении
          }
        )
        .subscribe()

      // Подписка на изменения в таблице category_names
      const categoriesChannel = supabase
        .channel('categories-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'category_names',
          },
          (payload) => {
            console.log('Categories changed:', payload)
            loadData() // Перезагружаем данные при изменении
          }
        )
        .subscribe()

      return () => {
        storesChannel.unsubscribe()
        categoriesChannel.unsubscribe()
      }
    } catch (error) {
      console.error('Error setting up realtime sync:', error)
    }
  }

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Загружаем категории
      const categoryResponse = await fetch('/api/category-names')
      if (categoryResponse.ok) {
        const categories = await categoryResponse.json()
        setCategoryNames(categories)
      } else {
        console.error('Failed to load categories:', categoryResponse.statusText)
        // Fallback на значения по умолчанию
        setCategoryNames(defaultCategoryNames)
      }

      // Загружаем позиции
      const storesResponse = await fetch('/api/stores')
      if (storesResponse.ok) {
        const storesData = await storesResponse.json()
        setStores(storesData || [])
      } else {
        console.error('Failed to load stores:', storesResponse.statusText)
        // Оставляем пустой массив
        setStores([])
      }
    } catch (error) {
      console.error('Error loading data:', error)
      // Fallback на значения по умолчанию при ошибке
      setCategoryNames(defaultCategoryNames)
      setStores([])
    } finally {
      setLoading(false)
    }
  }

  const addStore = async () => {
    const newStore: StoreData = {
      id: `store-${Date.now()}`,
      name: `Нова позиція ${stores.length + 1}`,
      products: [],
    }
    
    try {
      const response = await fetch('/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStore),
      })
      
      if (response.ok) {
        const createdStore = await response.json()
        setStores([...stores, createdStore])
      }
    } catch (error) {
      console.error('Error adding store:', error)
    }
  }

  const startEditCategory = (category: "category1" | "category2" | "category3") => {
    setEditingCategory(category)
    setEditedCategoryName(categoryNames[category])
  }

  const saveCategoryName = async () => {
    if (editingCategory && editedCategoryName.trim()) {
      const updated = {
        ...categoryNames,
        [editingCategory]: editedCategoryName.trim(),
      }
      
      try {
        const response = await fetch('/api/category-names', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        })
        
        if (response.ok) {
          const saved = await response.json()
          setCategoryNames(saved)
        }
      } catch (error) {
        console.error('Error saving category name:', error)
      }
    }
    setEditingCategory(null)
  }

  const updateStoreName = async (storeId: string, name: string) => {
    const store = stores.find((s) => s.id === storeId)
    if (!store) return

    const updatedStore = { ...store, name }
    
    try {
      const response = await fetch('/api/stores', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedStore),
      })
      
      if (response.ok) {
        const saved = await response.json()
        setStores(stores.map((s) => (s.id === storeId ? saved : s)))
      }
    } catch (error) {
      console.error('Error updating store name:', error)
    }
  }

  const deleteStore = async (storeId: string) => {
    try {
      const response = await fetch(`/api/stores?id=${storeId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setStores(stores.filter((s) => s.id !== storeId))
      }
    } catch (error) {
      console.error('Error deleting store:', error)
    }
  }

  const addProduct = async (storeId: string, category: ProductCategory) => {
    const store = stores.find((s) => s.id === storeId)
    if (!store) return

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: `Новий товар ${store.products.length + 1}`,
      quantity: 0,
      category,
    }

    const updatedStore = {
      ...store,
      products: [...store.products, newProduct],
    }
    
    try {
      const response = await fetch('/api/stores', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedStore),
      })
      
      if (response.ok) {
        const saved = await response.json()
        setStores(stores.map((s) => (s.id === storeId ? saved : s)))
      }
    } catch (error) {
      console.error('Error adding product:', error)
    }
  }

  const updateProduct = async (storeId: string, productId: string, name: string, quantity: number) => {
    const store = stores.find((s) => s.id === storeId)
    if (!store) return

    const updatedStore = {
      ...store,
      products: store.products.map((p) =>
        p.id === productId ? { ...p, name, quantity } : p
      ),
    }
    
    try {
      const response = await fetch('/api/stores', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedStore),
      })
      
      if (response.ok) {
        const saved = await response.json()
        setStores(stores.map((s) => (s.id === storeId ? saved : s)))
      }
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  const deleteProduct = async (storeId: string, productId: string) => {
    const store = stores.find((s) => s.id === storeId)
    if (!store) return

    const updatedStore = {
      ...store,
      products: store.products.filter((p) => p.id !== productId),
    }
    
    try {
      const response = await fetch('/api/stores', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedStore),
      })
      
      if (response.ok) {
        const saved = await response.json()
        setStores(stores.map((s) => (s.id === storeId ? saved : s)))
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  // Calculate stats per category
  const allProducts = stores.flatMap((s) => s.products)

  const category1Products = allProducts.filter((p) => p.category === "category1")
  const category2Products = allProducts.filter((p) => p.category === "category2")
  const category3Products = allProducts.filter((p) => p.category === "category3")

  // Get unique product types by name for each category
  const category1UniqueTypes = new Set(category1Products.map((p) => p.name.toLowerCase().trim()))
  const category2UniqueTypes = new Set(category2Products.map((p) => p.name.toLowerCase().trim()))
  const category3UniqueTypes = new Set(category3Products.map((p) => p.name.toLowerCase().trim()))

  // Aggregate products by name within each category
  const aggregateByName = (products: Product[]) => {
    const map = new Map<string, { name: string; totalQuantity: number }>()
    for (const p of products) {
      const key = p.name.toLowerCase().trim()
      const existing = map.get(key)
      if (existing) {
        existing.totalQuantity += p.quantity
      } else {
        map.set(key, { name: p.name, totalQuantity: p.quantity })
      }
    }
    return Array.from(map.values())
  }

  const category1Aggregated = aggregateByName(category1Products)
  const category2Aggregated = aggregateByName(category2Products)
  const category3Aggregated = aggregateByName(category3Products)

  const category1TotalQuantity = category1Products.reduce((sum, p) => sum + p.quantity, 0)
  const category2TotalQuantity = category2Products.reduce((sum, p) => sum + p.quantity, 0)
  const category3TotalQuantity = category3Products.reduce((sum, p) => sum + p.quantity, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Завантаження...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-foreground">
              Наявність дронів та БК на позиціях
            </h1>
            <Button
              onClick={addStore}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Додати позицію
            </Button>
          </div>

          {/* Category Names Editor */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Категорія 1:</span>
              {editingCategory === "category1" ? (
                <div className="flex items-center gap-1">
                  <Input
                    value={editedCategoryName}
                    onChange={(e) => setEditedCategoryName(e.target.value)}
                    className="h-7 w-32 text-sm bg-input text-foreground border-border"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveCategoryName()
                      if (e.key === "Escape") setEditingCategory(null)
                    }}
                  />
                  <Button size="icon" variant="ghost" className="h-6 w-6 text-primary" onClick={saveCategoryName}>
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground" onClick={() => setEditingCategory(null)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-primary">{categoryNames.category1}</span>
                  <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => startEditCategory("category1")}>
                    <Edit2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Категорія 2:</span>
              {editingCategory === "category2" ? (
                <div className="flex items-center gap-1">
                  <Input
                    value={editedCategoryName}
                    onChange={(e) => setEditedCategoryName(e.target.value)}
                    className="h-7 w-32 text-sm bg-input text-foreground border-border"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveCategoryName()
                      if (e.key === "Escape") setEditingCategory(null)
                    }}
                  />
                  <Button size="icon" variant="ghost" className="h-6 w-6 text-primary" onClick={saveCategoryName}>
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground" onClick={() => setEditingCategory(null)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-primary">{categoryNames.category2}</span>
                  <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => startEditCategory("category2")}>
                    <Edit2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Категорія 3:</span>
              {editingCategory === "category3" ? (
                <div className="flex items-center gap-1">
                  <Input
                    value={editedCategoryName}
                    onChange={(e) => setEditedCategoryName(e.target.value)}
                    className="h-7 w-32 text-sm bg-input text-foreground border-border"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveCategoryName()
                      if (e.key === "Escape") setEditingCategory(null)
                    }}
                  />
                  <Button size="icon" variant="ghost" className="h-6 w-6 text-primary" onClick={saveCategoryName}>
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground" onClick={() => setEditingCategory(null)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-primary">{categoryNames.category3}</span>
                  <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => startEditCategory("category3")}>
                    <Edit2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Category Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Category 1 Stats */}
          <div className="p-4 rounded-lg bg-card border border-border">
            <h3 className="text-sm font-medium text-primary mb-3">{categoryNames.category1}</h3>
            <div className="flex gap-6 mb-4">
              <div>
                <p className="text-xl font-bold text-foreground">{category1UniqueTypes.size}</p>
                <p className="text-xs text-muted-foreground">Тип дрона</p>
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{category1TotalQuantity}</p>
                <p className="text-xs text-muted-foreground">Загальна кількість</p>
              </div>
            </div>
            {category1Aggregated.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground mb-2">Кількість (сума по всіх магазинах):</p>
                {category1Aggregated.map((item) => (
                  <div key={item.name} className="flex justify-between text-sm py-1 px-2 rounded bg-secondary/30">
                    <span className="text-foreground">{item.name}</span>
                    <span className="text-muted-foreground">{item.totalQuantity} од.</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category 2 Stats */}
          <div className="p-4 rounded-lg bg-card border border-border">
            <h3 className="text-sm font-medium text-primary mb-3">{categoryNames.category2}</h3>
            <div className="flex gap-6 mb-4">
              <div>
                <p className="text-xl font-bold text-foreground">{category2UniqueTypes.size}</p>
                <p className="text-xs text-muted-foreground">Тип БК</p>
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{category2TotalQuantity}</p>
                <p className="text-xs text-muted-foreground">Загальна кількість</p>
              </div>
            </div>
            {category2Aggregated.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground mb-2">Кількість (сума по всіх магазинах):</p>
                {category2Aggregated.map((item) => (
                  <div key={item.name} className="flex justify-between text-sm py-1 px-2 rounded bg-secondary/30">
                    <span className="text-foreground">{item.name}</span>
                    <span className="text-muted-foreground">{item.totalQuantity} од.</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category 3 Stats */}
          <div className="p-4 rounded-lg bg-card border border-border">
            <h3 className="text-sm font-medium text-primary mb-3">{categoryNames.category3}</h3>
            <div className="flex gap-6 mb-4">
              <div>
                <p className="text-xl font-bold text-foreground">{category3UniqueTypes.size}</p>
                <p className="text-xs text-muted-foreground">Тип ПММ</p>
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{category3TotalQuantity}</p>
                <p className="text-xs text-muted-foreground">Загальна кількість</p>
              </div>
            </div>
            {category3Aggregated.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground mb-2">Кількість (сума по всіх магазинах):</p>
                {category3Aggregated.map((item) => (
                  <div key={item.name} className="flex justify-between text-sm py-1 px-2 rounded bg-secondary/30">
                    <span className="text-foreground">{item.name}</span>
                    <span className="text-muted-foreground">{item.totalQuantity} од.</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Store Cards */}
        {stores.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Store className="h-16 w-16 mb-4 opacity-50" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Позицій поки немає</h2>
            <p className="text-sm mb-4">Додайте свою першу позицію, щоб почати облік товарів</p>
            <Button
              onClick={addStore}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Додати першу позицію
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {stores.map((store) => (
              <StoreCard
                key={store.id}
                storeId={store.id}
                storeName={store.name}
                products={store.products}
                categoryNames={categoryNames}
                onUpdateStoreName={updateStoreName}
                onAddProduct={addProduct}
                onUpdateProduct={updateProduct}
                onDeleteProduct={deleteProduct}
                onDeleteStore={deleteStore}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
