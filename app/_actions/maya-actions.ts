import { getMayaAuthHeader } from '@/lib/maya-auth'

const MAYA_API_BASE_URL = 'https://api.maya.net/connectivity/v1/account'

export async function getMayaProducts() {
  try {
    const response = await fetch(`${MAYA_API_BASE_URL}/products`, {
      headers: {
        Authorization: getMayaAuthHeader(),
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Version': 'v1'
      },
      next: { revalidate: 86400 } // Cache for 24 hours
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching Maya products:', error)
    throw error
  }
}

export async function getMayaProductById(id: string) {
  try {
    const response = await fetch(`${MAYA_API_BASE_URL}/products/${id}`, {
      headers: {
        Authorization: getMayaAuthHeader(),
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Version': 'v1'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch product ${id}: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching Maya product ${id}:`, error)
    throw error
  }
}
