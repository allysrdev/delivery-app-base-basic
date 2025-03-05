"use client"
import React, { useEffect, useState } from 'react'
import ProductCard, { Product } from './ProductCard'
import { getProducts } from '@/services/productService';

function Section() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data as Product[])
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  })



 

  return (
    <div className='flex flex-col gap-4'>
        <h1 className="font-bold text-xl">Lanches</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

          {loading? (
            <div>Loading...</div>
          ) : null}
        {products.map(product => {
          return <ProductCard key={product.id} description={product.description} id={product.id} imageUrl={product.imageUrl} name={product.name} price={product.price} />
        })}
        </div>
    </div>
    
  )
}

export default Section