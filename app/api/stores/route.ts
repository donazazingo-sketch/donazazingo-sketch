import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { StoreData } from '@/lib/database.types'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching stores:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stores' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const store: StoreData = await request.json()
    
    const { data, error } = await supabase
      .from('stores')
      .insert({
        id: store.id,
        name: store.name,
        products: store.products || [],
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating store:', error)
    return NextResponse.json(
      { error: 'Failed to create store' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const store: StoreData = await request.json()
    
    const { data, error } = await supabase
      .from('stores')
      .update({
        name: store.name,
        products: store.products,
        updated_at: new Date().toISOString(),
      })
      .eq('id', store.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating store:', error)
    return NextResponse.json(
      { error: 'Failed to update store' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Store ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('stores')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting store:', error)
    return NextResponse.json(
      { error: 'Failed to delete store' },
      { status: 500 }
    )
  }
}
