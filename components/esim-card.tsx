"use client"

import { NeoCard } from "@/components/ui/neo-card"
import { NeoButton } from "@/components/ui/neo-button"
import { Wifi, Clock, MapPin, ShoppingCart } from "lucide-react"
import { useCartStore } from "../store/cart-store" // Changed to useCartStore
import { CartItem } from "../types" // Import CartItem for type consistency

interface ESIMCardProps {
  id: string
  name: string
  duration: string
  data: string
  price: number
  description: string
  countries: number
  region: string
  color?: "blue" | "yellow" | "pink" | "green" | "purple" | "beige"
  featured?: boolean
}

export function ESIMCard({
  id,
  name,
  duration,
  data,
  price,
  description,
  countries,
  region,
  color = "blue",
  featured = false,
}: ESIMCardProps) {
  const { addItem } = useCartStore()

  // Function to get the appropriate image based on region
  const getRegionImage = (region: string) => {
    if (!region) return "/placeholder.svg?height=400&width=600"

    const regionLower = region.toLowerCase()

    if (regionLower.includes("europe")) {
      return "/images/europe-bg.jpg"
    } else if (regionLower.includes("usa") || regionLower.includes("america")) {
      return "/images/america-bg.jpg"
    } else if (regionLower.includes("asia")) {
      return "/images/asia-bg.jpg"
    } else if (regionLower.includes("japan")) {
      return "/images/japan-bg.jpg"
    } else if (regionLower.includes("australia")) {
      return "/images/australia-bg.jpg"
    }

    // Default placeholder for other regions
    return `/placeholder.svg?height=400&width=600&text=${region}`
  }

  // Ensure name is always a string
  const cardTitle = name || `${region} Plan`

  return (
    <NeoCard
      title={cardTitle}
      imageSrc={getRegionImage(region)}
      imageAlt={`${cardTitle} eSIM Plan for ${region}`}
      tags={[duration, `${countries} ${countries === 1 ? "Country" : "Countries"}`, "4G/LTE"]}
      link={`/plans/${id}`}
      color={color}
      classified={featured}
    >
      <div className="mb-4 text-2xl font-bold">${price.toFixed(2)}</div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Wifi className="h-4 w-4" />
          <span className="text-sm">{data} Data</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm">{duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">
            {countries} {countries === 1 ? "Country" : "Countries"}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <NeoButton
          className="w-full"
          onClick={() => {
            const cartItem: CartItem = {
              id, // This should be the Shopify Variant ID
              name: name || `${region} Plan`, // Ensure name is a string
              price,
              quantity: 1,
              duration,
              data,
              // region is not part of CartItem in types.ts, so it's omitted here
              // If region is needed in the cart, add it to CartItem type
              // slug is also not part of CartItem
            };
            addItem(cartItem);
          }}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </NeoButton>
      </div>
    </NeoCard>
  )
}
