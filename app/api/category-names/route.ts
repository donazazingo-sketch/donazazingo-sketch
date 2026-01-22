import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { CategoryNames } from '@/lib/database.types'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('category_names')
      .select('*')
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is OK for first time
      throw error
    }

    // If no data exists, return defaults
    if (!data) {
      return NextResponse.json({
        category1: "Електроніка",
        category2: "Аксесуари",
        category3: "Послуги",
      })
    }

    return NextResponse.json({
      category1: data.category1,
      category2: data.category2,
      category3: data.category3,
    })
  } catch (error) {
    console.error('Error fetching category names:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category names' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const categoryNames: CategoryNames = await request.json()
    
    // Check if record exists
    const { data: existing } = await supabase
      .from('category_names')
      .select('id')
      .single()

    let result

    if (existing) {
      // Update existing record
      const { data, error } = await supabase
        .from('category_names')
        .update({
          category1: categoryNames.category1,
          category2: categoryNames.category2,
          category3: categoryNames.category3,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      result = data
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from('category_names')
        .insert({
          category1: categoryNames.category1,
          category2: categoryNames.category2,
          category3: categoryNames.category3,
        })
        .select()
        .single()

      if (error) throw error
      result = data
    }

    return NextResponse.json({
      category1: result.category1,
      category2: result.category2,
      category3: result.category3,
    })
  } catch (error) {
    console.error('Error updating category names:', error)
    return NextResponse.json(
      { error: 'Failed to update category names' },
      { status: 500 }
    )
  }
}
