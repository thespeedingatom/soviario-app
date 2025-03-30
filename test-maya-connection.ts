import * as dotenv from 'dotenv'
import * as path from 'path'
import { getMayaAuthHeader } from './lib/maya-auth'

dotenv.config({ path: path.resolve(__dirname, '.env.local') })

const testUrl = `https://api.maya.net/connectivity/v1/account/products?region=europe&country=us`
console.log(`Testing Maya API at: ${testUrl}`)

fetch(testUrl, {
  headers: {
    Authorization: getMayaAuthHeader(),
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Version': 'v1'
  }
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
