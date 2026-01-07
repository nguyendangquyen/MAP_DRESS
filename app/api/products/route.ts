// Final correction
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
        category: true,
        sizes: true,
        colors: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('DEBUG: Creating product with body:', JSON.stringify(body, null, 2))
    
    const { name, description, price, stock, categoryName, category, images, sizes, colors } = body
    
    // Normalize category name (handling both 'categoryName' and 'category' for safety)
    const finalCategoryName = categoryName || category

    if (!name || !finalCategoryName || !price) {
      console.error('DEBUG: Missing required fields:', { name, finalCategoryName, price })
      return NextResponse.json({ 
        error: 'Missing required fields', 
        received: { name, categoryName: finalCategoryName, price } 
      }, { status: 400 })
    }

    // 1. Find or create the category
    let categoryRecord = await prisma.category.findFirst({
      where: { name: finalCategoryName }
    })

    if (!categoryRecord) {
      console.log('DEBUG: Category not found, creating:', finalCategoryName)
      categoryRecord = await prisma.category.create({
        data: {
          name: finalCategoryName,
          slug: finalCategoryName.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove Vietnamese accents
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
        }
      })
    }

    // 2. Create the product
    console.log('DEBUG: Executing prisma.product.create')
    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        slug: `${name.toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')}-${Date.now()}`,
        dailyPrice: parseFloat(price.toString()) || 0,
        stock: parseInt(stock?.toString()) || 0,
        categoryId: categoryRecord.id,
        images: {
          create: (images || []).map((url: string) => ({ url }))
        },
        colors: {
          create: (colors || '').toString().split(',').map((c: string) => ({ value: c.trim() })).filter((c:any) => c.value)
        }
      },
      include: {
        images: true,
        category: true
      }
    })

    console.log('DEBUG: Product created successfully:', product.id)
    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error('DEBUG: ERROR IN POST /api/products:', error)
    const errorMessage = error.message || 'Unknown error'
    const errorCode = error.code || 'UNKNOWN_CODE'
    
    return NextResponse.json({ 
      error: 'Failed to create product', 
      details: errorMessage,
      code: errorCode
    }, { status: 500 })
  }
}
