import { createServerSupabaseClient } from '../lib/supabase-server'
import { getMayaAuthHeader } from '../lib/maya-auth'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

interface MayaProduct {
  uid: string
  name: string
  countries_enabled: string[]
  data_quota_mb: number
  data_quota_bytes: number
  validity_days: number
  policy_id: number
  policy_name: string
  wholesale_price_usd: string
  rrp_usd: string
  rrp_eur: string
  rrp_gbp: string
  rrp_cad: string
  rrp_aud: string
  rrp_jpy: string
}

async function fetchMayaProducts(): Promise<MayaProduct[]> {
  const url = `https://api.maya.net/connectivity/v1/account/products`
  const response = await fetch(url, {
    headers: {
      Authorization: getMayaAuthHeader(),
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Accept-Version': 'v1'
    }
  })

  if (!response.ok) {
    throw new Error(`Maya API error: ${response.status}`)
  }

  const data = await response.json()
  return data.products
}

async function syncProducts() {
  try {
    const mayaProducts = await fetchMayaProducts()
    const supabase = await createServerSupabaseClient()

    for (const product of mayaProducts) {
      const { error } = await supabase
        .from('products')
        .upsert({
          id: product.uid,
          name: product.name,
          slug: product.name.toLowerCase().replace(/\s+/g, '-'),
          description: `${product.policy_name} plan for ${product.countries_enabled.length} countries`,
          price: parseFloat(product.rrp_usd),
          data_amount: `${product.data_quota_mb}MB`,
          data_quota_bytes: product.data_quota_bytes,
          duration: `${product.validity_days} days`,
          region: 'europe', // TODO: Extract from product data
          countries: product.countries_enabled.length,
          is_featured: false,
          color: '#37b1ff',
          wholesale_price: parseFloat(product.wholesale_price_usd),
          policy_id: product.policy_id,
          policy_name: product.policy_name,
          price_usd: parseFloat(product.rrp_usd),
          price_eur: parseFloat(product.rrp_eur),
          price_gbp: parseFloat(product.rrp_gbp),
          price_cad: parseFloat(product.rrp_cad),
          price_aud: parseFloat(product.rrp_aud),
          price_jpy: parseFloat(product.rrp_jpy)
        })

      if (error) {
        console.error(`Error syncing product ${product.uid}:`, error)
      } else {
        console.log(`Synced product: ${product.name}`)
      }
    }

    console.log('Product sync completed')
  } catch (error) {
    console.error('Error in product sync:', error)
  }
}

syncProducts()
