"use client"

import { useEffect, useState } from "react"
import { NeoGrid } from "@/components/ui/neo-grid"
import { ESIMCard } from "@/components/esim-card"
// import { fetchProductsByRegion, fetchFeaturedProducts, fetchAllProducts } from "@/app/_actions/product-actions"
import { fetchAllProducts } from "@/app/_actions/product-actions"; // fetchFeaturedProducts and fetchProductsByRegion are commented out
import type { ShopifyProduct as Product } from "@/lib/shopify" // Use ShopifyProduct
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

        // if (featured) {
        //   // data = await fetchFeaturedProducts() // Commented out as fetchFeaturedProducts is not implemented for Shopify
        //   console.warn("Featured products functionality is temporarily disabled.");
        //   data = await fetchAllProducts(); // Default to all products for now
        // } else if (region === "all") {
        //   data = await fetchAllProducts()
        // } else if (region === "other") {
        //   // For "other" region, get Japan and Australia products
        //   // const japanProducts = await fetchProductsByRegion("Japan") // Commented out
        //   // const australiaProducts = await fetchProductsByRegion("Australia") // Commented out
        //   // data = [...japanProducts, ...australiaProducts] // Commented out
        //   console.warn("Region 'other' functionality is temporarily disabled, fetching all products.");
        //   data = await fetchAllProducts(); // Default to all products for now
        // } else {
        //   // Capitalize first letter for region
        //   let formattedRegion = region.charAt(0).toUpperCase() + region.slice(1)
        //   if (region.toLowerCase() === "usa") {
        //     formattedRegion = "USA"
        //   }
        //   // data = await fetchProductsByRegion(formattedRegion) // Commented out
        //   console.warn(`Region '${formattedRegion}' functionality is temporarily disabled, fetching all products.`);
        //   data = await fetchAllProducts(); // Default to all products for now
        // }
        // Simplified logic: always fetch all products for now
        data = await fetchAllProducts();
        
        if (featured) {
            console.warn("Featured products filtering is not implemented for Shopify yet. Displaying all products.");
        }
        if (region !== "all") {
            console.warn(`Region-specific filtering for '${region}' is not implemented for Shopify yet. Displaying all products.`);
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
          key={product.id} // ShopifyProduct uses id
          id={product.handle} // ShopifyProduct uses handle, equivalent to slug
          name={product.title} // ShopifyProduct uses title
          duration={"N/A"} // ShopifyProduct doesn't have duration, default or remove
          data={"N/A"} // ShopifyProduct doesn't have data_amount, default or remove
          price={parseFloat(product.price) || 0} // Convert string to number, default to 0 if NaN
          description={product.description}
          countries={0} // ShopifyProduct doesn't have countries, default to 0
          region={"N/A"} // ShopifyProduct doesn't have region, default or remove
          color={"blue" as any} // ShopifyProduct doesn't have color, default or remove
          featured={false} // ShopifyProduct doesn't have is_featured, default or remove
        />
      ))}
    </NeoGrid>
  )
}
