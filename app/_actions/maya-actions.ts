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

// Refactored function to create an eSIM based on official docs
export async function createMayaEsim(planTypeId: string) { // Renamed productId to planTypeId, removed email/region
  try {
    const url = `https://api.maya.net/connectivity/v1/esim`; // Correct endpoint
    
    console.log(`Creating Maya eSIM with Plan Type ID: ${planTypeId} at ${url}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: getMayaAuthHeader(), // Basic Auth
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // 'Accept-Version': 'v1' // Removed, not in official docs for this endpoint
      },
      body: JSON.stringify({
        plan_type_id: planTypeId, // Use plan_type_id as key
        // tag: orderId // Optional: Could add orderId as a tag later if needed
      })
    });

    const responseBodyText = await response.text(); // Read body once
    console.log(`Maya eSIM creation response status: ${response.status}`);
    // console.log(`Maya eSIM creation response body: ${responseBodyText}`); // Optional: Log raw response for debugging

    if (!response.ok) {
      console.error(`Maya API error (${response.status}): ${responseBodyText}`);
      throw new Error(`Failed to create eSIM: ${response.statusText} - ${responseBodyText}`);
    }

    const responseData = JSON.parse(responseBodyText); // Parse the text body

    if (!responseData.esim || !responseData.esim.activation_code) {
       console.error("Invalid response structure from Maya eSIM API:", responseData);
       throw new Error("Failed to parse eSIM details from Maya API response");
    }

    // Return relevant data based on docs (activation_code is key for QR)
    return {
      esimUid: responseData.esim.uid,
      iccid: responseData.esim.iccid,
      activationCode: responseData.esim.activation_code, // Used for QR code generation
      manualCode: responseData.esim.manual_code,
      smdpAddress: responseData.esim.smdp_address,
      // qrCodeData is NOT returned directly, needs generation from activationCode
    };

  } catch (error) {
    console.error('Error creating Maya eSIM:', error);
    throw new Error("Failed to create Maya eSIM")
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
