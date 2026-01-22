"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Package, Plus, Edit2, Check, X, Trash2 } from "lucide-react"

type ProductCategory = "category1" | "category2" | "category3"

interface Product {
  id: string
  name: string
  quantity: number
  category: ProductCategory
}

interface StoreCardProps {
  storeId: string
  storeName: string
  products: Product[]
  categoryNames: {
    category1: string
    category2: string
    category3: string
  }
  onUpdateStoreName: (storeId: string, name: string) => void
  onAddProduct: (storeId: string, category: ProductCategory) => void
  onUpdateProduct: (
    storeId: string,
    productId: string,
    name: string,
    quantity: number
  ) => void
  onDeleteProduct: (storeId: string, productId: string) => void
  onDeleteStore: (storeId: string) => void
}

export function StoreCard({
  storeId,
  storeName,
  products,
  categoryNames,
  onUpdateStoreName,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onDeleteStore,
}: StoreCardProps) {
  const [editingStoreName, setEditingStoreName] = useState(false)
  const [editedStoreName, setEditedStoreName] = useState(storeName)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [editedProductName, setEditedProductName] = useState("")
  const [editedProductQuantity, setEditedProductQuantity] = useState(0)

  const startEditStoreName = () => {
    setEditingStoreName(true)
    setEditedStoreName(storeName)
  }

  const saveStoreName = () => {
    if (editedStoreName.trim()) {
      onUpdateStoreName(storeId, editedStoreName.trim())
    }
    setEditingStoreName(false)
  }

  const startEditProduct = (product: Product) => {
    setEditingProduct(product.id)
    setEditedProductName(product.name)
    setEditedProductQuantity(product.quantity)
  }

  const saveProduct = () => {
    if (editingProduct && editedProductName.trim()) {
      onUpdateProduct(
        storeId,
        editingProduct,
        editedProductName.trim(),
        editedProductQuantity
      )
    }
    setEditingProduct(null)
  }

  const cancelEdit = () => {
    setEditingStoreName(false)
    setEditingProduct(null)
  }

  const productsByCategory = {
    category1: products.filter((p) => p.category === "category1"),
    category2: products.filter((p) => p.category === "category2"),
    category3: products.filter((p) => p.category === "category3"),
  }

  return (
    <div className="p-6 rounded-lg bg-card border border-border shadow-sm">
      {/* Store Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
        {editingStoreName ? (
          <div className="flex items-center gap-2 flex-1">
            <Input
              value={editedStoreName}
              onChange={(e) => setEditedStoreName(e.target.value)}
              className="flex-1 bg-input text-foreground border-border"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") saveStoreName()
                if (e.key === "Escape") cancelEdit()
              }}
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-primary"
              onClick={saveStoreName}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground"
              onClick={cancelEdit}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              {storeName}
            </h2>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={startEditStoreName}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-red-600 hover:text-red-700"
                onClick={() => onDeleteStore(storeId)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Products by Category */}
      <div className="space-y-4">
        {(["category1", "category2", "category3"] as const).map((category) => (
          <div key={category} className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-primary">
                {categoryNames[category]}
              </h3>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs"
                onClick={() => onAddProduct(storeId, category)}
              >
                <Plus className="h-3 w-3 mr-1" />
                Додати
              </Button>
            </div>
            {productsByCategory[category].length === 0 ? (
              <p className="text-xs text-muted-foreground italic pl-4">
                Немає товарів
              </p>
            ) : (
              <div className="space-y-1 pl-4">
                {productsByCategory[category].map((product) =>
                  editingProduct === product.id ? (
                    <div
                      key={product.id}
                      className="flex items-center gap-2 p-2 rounded bg-secondary/30"
                    >
                      <Input
                        value={editedProductName}
                        onChange={(e) => setEditedProductName(e.target.value)}
                        className="flex-1 h-8 text-sm bg-input text-foreground border-border"
                        placeholder="Назва товару"
                      />
                      <Input
                        type="number"
                        value={editedProductQuantity}
                        onChange={(e) =>
                          setEditedProductQuantity(parseInt(e.target.value) || 0)
                        }
                        className="w-20 h-8 text-sm bg-input text-foreground border-border"
                        placeholder="Кількість"
                        min="0"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-primary"
                        onClick={saveProduct}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground"
                        onClick={cancelEdit}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-2 rounded bg-secondary/30 group"
                    >
                      <div className="flex-1">
                        <span className="text-sm text-foreground">
                          {product.name}
                        </span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({product.quantity} од.)
                        </span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-muted-foreground hover:text-foreground"
                          onClick={() => startEditProduct(product)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-red-600 hover:text-red-700"
                          onClick={() => onDeleteProduct(storeId, product.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
