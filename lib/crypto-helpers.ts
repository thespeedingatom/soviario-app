"use server";

import { webcrypto } from 'crypto';

// Polyfill crypto if not available (e.g., older Node.js versions, though "use server" implies modern environment)
const currentCrypto = typeof crypto !== 'undefined' ? crypto : webcrypto;

function base64UrlEncode(buffer: ArrayBuffer): string {
  // Convert ArrayBuffer to Uint8Array
  const uint8Array = new Uint8Array(buffer);
  // Convert Uint8Array to string of char codes
  const charCodeString = String.fromCharCode.apply(null, Array.from(uint8Array));
  // Convert to base64
  const base64 = btoa(charCodeString);
  // URL-safe base64: replace + with -, / with _, and remove = padding
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export async function generateCodeVerifier(): Promise<string> {
  const array = new Uint8Array(32);
  // Ensure currentCrypto is treated as the browser-like Crypto interface
  (currentCrypto as Crypto).getRandomValues(array);
  return base64UrlEncode(array.buffer);
}

export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await currentCrypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(digest);
}

export async function generateState(): Promise<string> {
  const timestamp = Date.now().toString();
  const randomString = Math.random().toString(36).substring(2);
  return timestamp + randomString;
}

export async function generateNonce(length: number = 32): Promise<string> {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let nonce = '';
  const charLength = characters.length;
  const randomValues = new Uint32Array(length);
  (currentCrypto as Crypto).getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    // Use the random value from the pre-filled array
    const randomIndex = randomValues[i] % charLength;
    nonce += characters.charAt(randomIndex);
  }
  return nonce;
}

// For decoding JWT to verify nonce (simplified, consider a robust JWT library for production)
export function decodeJwt(token: string): { header: any; payload: any; signature: string } | null {
  try {
    const [header, payload, signature] = token.split('.');
    if (!header || !payload || !signature) return null;

    const decodedHeader = JSON.parse(atob(header));
    const decodedPayload = JSON.parse(atob(payload));

    return {
      header: decodedHeader,
      payload: decodedPayload,
      signature,
    };
  } catch (e) {
    console.error("Failed to decode JWT:", e);
    return null;
  }
}
