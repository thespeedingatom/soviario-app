import { Buffer } from 'buffer'

export function getMayaAuthHeader() {
  const key = process.env.MAYA_API_KEY
  const secret = process.env.MAYA_API_SECRET
  
  if (!key || !secret) {
    throw new Error('Maya API credentials not configured')
  }

  const encoded = Buffer.from(`${key}:${secret}`).toString('base64')
  return `Basic ${encoded}`
}

export async function testMayaAuth() {
  const response = await fetch('https://api.maya.net/v1/ping', {
    headers: {
      Authorization: getMayaAuthHeader(),
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`Maya API connection failed: ${response.statusText}`)
  }

  return response.json()
}
