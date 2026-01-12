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
        updatedAt: 'desc'
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
    
    const { name, description, price, stock, categoryName, category, images, sizes, colors, isBestSeller } = body
    
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
      const safeCategoryName = String(finalCategoryName || 'Uncategorized')
      categoryRecord = await prisma.category.create({
        data: {
          name: safeCategoryName,
          slug: safeCategoryName.toLowerCase()
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
        },
        isBestSeller: Boolean(isBestSeller)
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

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, description, price, stock, categoryName, images, colors, isBestSeller, status } = body

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Find or create category if name changed
    let categoryId = undefined
    if (categoryName) {
      let categoryRecord = await prisma.category.findFirst({
        where: { name: categoryName }
      })

      if (!categoryRecord) {
        categoryRecord = await prisma.category.create({
          data: {
            name: categoryName,
            slug: categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
          }
        })
      }
      categoryId = categoryRecord.id
    }

    console.log('DEBUG: PATCH request body:', body)

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { category: true }
    })

    if (!existingProduct) {
      console.error('CRITICAL: Product to update not found:', id)
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Update product
    const patchData: any = {}
    if (name) patchData.name = name
    if (description !== undefined) patchData.description = description
    if (price !== undefined && price !== '') patchData.dailyPrice = parseFloat(price.toString())
    if (stock !== undefined && stock !== '') patchData.stock = parseInt(stock.toString())
    if (isBestSeller !== undefined) patchData.isBestSeller = !!isBestSeller
    if (status) patchData.status = (status === 'REPAIRING' ? 'MAINTENANCE' : status) as any
    if (categoryId) patchData.categoryId = categoryId

    // Filter out NaN values
    if (patchData.dailyPrice !== undefined && isNaN(patchData.dailyPrice)) delete patchData.dailyPrice
    if (patchData.stock !== undefined && isNaN(patchData.stock)) delete patchData.stock

    console.log('DEBUG: Final Patch Data:', JSON.stringify(patchData, null, 2))

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...patchData,
        ...(images && {
          images: {
            deleteMany: {},
            create: images.map((url: string) => ({ url }))
          }
        }),
        ...(colors !== undefined && {
          colors: {
            deleteMany: {},
            create: (colors || '').toString().split(',')
              .map((c: string) => ({ value: c.trim() }))
              .filter((c:any) => c.value)
          }
        })
      },
      include: {
        images: true,
        category: true,
        colors: true
      }
    })

    console.log('DEBUG: Product updated successfully:', product.id)
    return NextResponse.json(product)
  } catch (error: any) {
    console.error('CRITICAL: Error in PATCH /api/products:', error)
    return NextResponse.json({ 
      error: 'Failed to update product', 
      details: error.message,
      code: error.code || 'UNKNOWN'
    }, { status: 500 })
  }
}
