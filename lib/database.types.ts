export type ProductCategory = "category1" | "category2" | "category3"

export interface Product {
  id: string
  name: string
  quantity: number
  category: ProductCategory
}

export interface StoreData {
  id: string
  name: string
  products: Product[]
}

export interface CategoryNames {
  category1: string
  category2: string
  category3: string
}

export interface Database {
  public: {
    Tables: {
      stores: {
        Row: {
          id: string
          name: string
          products: Product[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          products?: Product[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          products?: Product[]
          updated_at?: string
        }
      }
      category_names: {
        Row: {
          id: number
          category1: string
          category2: string
          category3: string
          updated_at: string
        }
        Insert: {
          id?: number
          category1: string
          category2: string
          category3: string
          updated_at?: string
        }
        Update: {
          category1?: string
          category2?: string
          category3?: string
          updated_at?: string
        }
      }
    }
  }
}
