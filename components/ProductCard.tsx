import { LucideMinus, LucidePlus } from 'lucide-react';
import Image from 'next/image';


export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

export default function ProductCard({ name, price, description, imageUrl }: Product) {
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
          <button
            className="flex items-center justify-center w-8 h-8 border border-zinc-400 rounded-md text-white hover:bg-red-600 transition-all duration-300 cursor-pointer"
          >
            <LucideMinus size={18} />
          </button>

          <span className="text-white text-lg">0</span>

          <button
            className="flex items-center justify-center w-8 h-8 border border-zinc-400 rounded-md text-white hover:bg-green-600 transition-all duration-300 cursor-pointer"
          >
            <LucidePlus size={18} />
          </button>
      </div>
    </div>
    </div>
  );
}