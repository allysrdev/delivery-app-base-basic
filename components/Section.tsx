"use client"
import React, { useEffect, useState } from 'react'
import ProductCard, { Product } from './ProductCard'
import { getProducts } from '@/services/productService';
import { Loader } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';

function Section() {
  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});
  const [loading, setLoading] = useState(true);
  const { addToCart, removeFromCart, cart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        const categorizedProducts = data.reduce((acc: Record<string, Product[]>, product: Product) => {
          const category = product.category || 'Outros';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(product);
          return acc;
        }, {});
        setProductsByCategory(categorizedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {loading ? (
        <div className='w-full h-full flex items-center justify-center'><Loader className='m-auto'/></div>
      ) : (
        Object.keys(productsByCategory).map((category) => (
          <div key={category} className="mt-8 flex flex-col gap-4">
            <h1 className="font-bold text-xl">{category}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {productsByCategory[category].map((product) => {
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
        ))
      )}
    </div>
  );
}

export default Section;
