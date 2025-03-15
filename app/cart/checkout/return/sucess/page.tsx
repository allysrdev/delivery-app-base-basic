'use client'
import { useCart } from '@/app/context/CartContext';
import { Button } from '@/components/ui/button';
import { createOrder } from '@/services/orderService';
import { getUser, User } from '@/services/userService';
import { useSession } from 'next-auth/react';
import Image from 'next/image'
import { redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function Page() {
  const { cart } = useCart();
    const [user, setUser] = useState<User | null>(null);
    const session = useSession();
  
  
    useEffect(() => { 
      const fetchUser = async () => {
        try {
          const userData = await getUser(session.data?.user?.email || '');
          setUser(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUser();
    })
  
  function handleCreateOrder() {
    const items = cart.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        name: item.name
      }));
    createOrder(user?.userId || '', user?.telephone || '', user?.name || '', user?.email || '', user?.address || '', items, (cart.reduce((acc, product) => acc + product.price * product.quantity, 0) + 10), 'Pedido solicitado')
    redirect('/pedidos');
  }
  
  return (
    <div className='flex flex-col w-full h-[90vh] overflow-hidden items-center justify-center gap-4'>
      <div className='flex flex-col justify-center items-center'>
        <Image src={'/credit-card.png'} width={80} height={80} alt=''/>
        <h1>Pagamento aprovado!</h1>
      </div>
      <Button onClick={handleCreateOrder}>Acompanhar pedido</Button>
    </div>
  )
}

export default Page