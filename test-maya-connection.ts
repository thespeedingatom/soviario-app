import * as dotenv from 'dotenv'
import * as path from 'path'
import { getMayaAuthHeader } from './lib/maya-auth'

dotenv.config({ path: path.resolve(__dirname, '.env.local') })

const createEsimUrl = `https://api.maya.net/connectivity/v1/account/esims`
const productIdToProvision = 'FV8wHnU9fDk8' // Example Product ID: Europe+ 10GB - 10 Days

console.log(`Attempting to create eSIM at: ${createEsimUrl}`)
console.log(`Using Product ID: ${productIdToProvision}`)

fetch(createEsimUrl, {
  method: 'POST', // Use POST method
  headers: {
    Authorization: getMayaAuthHeader(),
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Version': 'v1'
  },
  body: JSON.stringify({ // Send product ID in the body (guessing the field name)
    product_id: productIdToProvision,
    // Add other potential required fields if known, e.g., quantity: 1
  })
})
  .then(async (res) => {
    console.log(`Response status: ${res.status}`)
    if (!res.ok) {
      console.error(`Error response: ${await res.text()}`)
    }
    return res.json()
  })
  .then(console.log)
  .catch(console.error)
