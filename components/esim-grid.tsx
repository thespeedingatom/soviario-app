"use client"

import { useEffect, useState } from "react"
import { NeoGrid } from "@/components/ui/neo-grid"
import { ESIMCard } from "@/components/esim-card"
import { fetchProductsByRegion, fetchFeaturedProducts, fetchAllProducts } from "@/app/actions/product-actions"
import type { Product } from "@/lib/db-products"
import { Skeleton } from "@/components/ui/skeleton"

interface ESIMGridProps {
  region?: "europe" | "usa" | "asia" | "japan" | "australia" | "all" | "other"
  limit?: number
  featured?: boolean
}

export function ESIMGrid({ region = "all", limit, featured = false }: ESIMGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true)
      try {
        let data: Product[] = []

        if (featured) {
          data = await fetchFeaturedProducts()
        } else if (region === "all") {
          data = await fetchAllProducts()
        } else if (region === "other") {
          // For "other" region, get Japan and Australia products
          const japanProducts = await fetchProductsByRegion("Japan")
          const australiaProducts = await fetchProductsByRegion("Australia")
          data = [...japanProducts, ...australiaProducts]
        } else {
          // Capitalize first letter for region
          let formattedRegion = region.charAt(0).toUpperCase() + region.slice(1)
          if (region.toLowerCase() === "usa") {
            formattedRegion = "USA"
          }
          data = await fetchProductsByRegion(formattedRegion)
        }

        if (limit) {
          data = data.slice(0, limit)
        }

        setProducts(data)
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [region, limit, featured])

  if (isLoading) {
    return (
      <NeoGrid columns={3}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="neobrutalist-card p-4">
            <div className="h-48 w-full bg-gray-200 mb-4"></div>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </NeoGrid>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No eSIM plans found for this region.</p>
      </div>
    )
  }

  return (
    <NeoGrid columns={3}>
      {products.map((product) => (
        <ESIMCard
          key={product.id}
          id={product.slug}
          name={product.name}
          duration={product.duration}
          data={product.data_amount}
          price={product.price}
          description={product.description}
          countries={product.countries}
          region={product.region}
          color={product.color as any}
          featured={product.is_featured}
        />
      ))}
    </NeoGrid>
  )
}

