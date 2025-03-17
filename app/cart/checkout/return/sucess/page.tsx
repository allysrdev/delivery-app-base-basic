'use client'
import { useCart } from '@/app/context/CartContext';
import { Progress } from '@/components/ui/progress';
import { createOrder } from '@/services/orderService';
import { getUser, User } from '@/services/userService';
import { useSession } from 'next-auth/react';
import Image from 'next/image'
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function Page() {
    const { cart } = useCart();
    const [user, setUser] = useState<User | null>(null);
    const session = useSession();
    const [step, setStep] = useState<number>()
  
  
  useEffect(() => { 
    setStep(0)
    
      const fetchUser = async () => {
        try {
          const userData = await getUser(session.data?.user?.email || '');
          setUser(userData);
          setTimeout(() => setStep(1), 2000)
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
        handleCreateOrder()
      };
    fetchUser();
    }, [session.data?.user?.email])
  
  function handleCreateOrder() {

    const items = cart.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        name: item.name
      }));
    createOrder(user?.userId || '', user?.telephone || '', user?.name || '', user?.email || '', user?.address || '', items, (cart.reduce((acc, product) => acc + product.price * product.quantity, 0) + 10), 'Pedido solicitado')
    setTimeout(() => setStep(2), 2000)
    setTimeout(() => redirect('/pedidos'), 1000)

  }
  
  return (
    <div className='flex flex-col w-full h-[90vh] overflow-hidden items-center justify-center gap-4'>
      <div className='flex flex-col justify-center items-center'>
        {
          step === 0 ? (
            <>
            <Image src={'/credit-card.png'} width={40} height={40} alt=''/>
              <br />
              <Progress value={33} />
              <br />
            <h1>Pagamento aprovado!</h1>
            </>
      )
            : step === 1 ? (
              <>
      <Image src={'/delivery.png'} width={40} height={40} alt='' />
             <br />
              <Progress value={50} />

              <br />
                <h1>Processando pedido</h1>
      
              </>
      ) :
              (
                <>
        <Image src={'/shopping-bag.png'} width={40} height={40} alt='' />
             <br />
              <Progress value={100} />

              <br />
                  <h1>Pedido enviado!</h1>
                </>
      
      )
        } 
      </div>
      </div>
  )
}

export default Page