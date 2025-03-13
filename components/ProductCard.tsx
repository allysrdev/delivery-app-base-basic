'use client'

import { LucideMinus, LucidePlus } from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';
import { CartItem } from '@/app/context/CartContext';


export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
  quantity: 0;
  addToCart?: (item: CartItem) => void;
  removeFromCart?: (id: string) => void;
}

export default function ProductCard({ id, name, price,quantity, description, imageUrl, addToCart, removeFromCart }: Product) {

  return (
    <div className="bg-black/30 backdrop-blur-md border border-white/10 shadow-lg rounded-md p-4 flex sm:flex-col items-start sm:items-center sm:max-w-sm w-full sm:h-96 h-56 gap-4">
      <div className="flex-shrink-0 h-28">
        <Image
          src={imageUrl ? imageUrl : "/"}
          alt={name}
          width={120}
          height={120}
          className="rounded-md object-cover"
        />
      </div>
      <div className="flex flex-col justify-between ml-4 flex-grow h-full w-full items-start sm:items-start sm:gap-4">
        <h2 className="text-white text-lg font-semibold">{name}</h2>
        <p className="text-gray-300 text-sm line-clamp-3 overflow-hidden">
          {description}
        </p>
        <h2 className="text-white text-lg font-semibold">R${price},00</h2>
        <div className="mt-auto flex items-center justify-center space-x-4">
          <div className="flex gap-2 items-center">
            <Button onClick={() => {
              removeFromCart?.(id)
            }} className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/50 shadow-lg text-white  flex items-center justify-center hover:bg-black/50 p-1 cursor-pointer">
              <LucideMinus size={18} />
            </Button>
            <p>{quantity}</p>
            <Button
              onClick={() => {
                addToCart?.({ name, price, imageUrl, id, quantity })
              }}
              className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/50 shadow-lg text-white  flex items-center justify-center hover:bg-black/50 p-1 cursor-pointer"
            >
              <LucidePlus size={18} />
            </Button>
        </div>
      </div>
    </div>
    </div>
  );
}