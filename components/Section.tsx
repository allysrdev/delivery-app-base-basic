"use client"
import React, { useEffect, useState } from 'react'
import ProductCard, { Product } from './ProductCard'
import { getProducts } from '@/services/productService';
import { Loader } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';

function Section() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true);
  const { addToCart, removeFromCart, cart } = useCart();

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
            <div className='w-full h-full flex items-center justify-center'><Loader className='m-auto'/></div>
          ) : null}
        {products.map((product) => {
          const cartItem = cart.find((item) => item.id === product.id);
          const quantity = cartItem ? cartItem.quantity : 0;

          return (
            <ProductCard
              key={product.id}
              {...product}
              quantity={quantity}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
            />
          );
        })}
        </div>
    </div>
    
  )
}

export default Section