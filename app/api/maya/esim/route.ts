import { NextResponse } from 'next/server'
import { getMayaAuthHeader } from '@/lib/maya-auth'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { z } from 'zod'

// Request schema validation
const createEsimSchema = z.object({
  productId: z.string().min(1),
  customerEmail: z.string().email(),
  region: z.string().min(1),
  orderId: z.string().min(1)
})

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient()
  
  try {
    // Validate input
    const body = await request.json()
    const { productId, customerEmail, region, orderId } = createEsimSchema.parse(body)

    // Call Maya API to create eSIM
    const response = await fetch(`${process.env.MAYA_API_BASE_URL}/esims`, {
      method: 'POST',
      headers: {
        Authorization: getMayaAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product_id: productId,
        customer_email: customerEmail,
        region
      })
    })

    if (!response.ok) {
      throw new Error(`Maya API error: ${response.statusText}`)
    }

    const esimData = await response.json()

    // Store eSIM data with order
    const { error } = await supabase
      .from('orders')
      .update({ 
        maya_esim_data: {
          esimId: esimData.id,
          activationCode: esimData.activation_code,
          qrCodeData: esimData.qr_code_data
        }
      })
      .eq('id', orderId)

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: {
        esimId: esimData.id,
        activationCode: esimData.activation_code
      }
    })

  } catch (error) {
    console.error('eSIM creation failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
