'use client'
import OrderComponent from '@/components/Order';
import { getOrdersByUser, Order } from '@/services/orderService'
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'

export default function Page() {
    
    const [orders, setOrders] = useState<Order[]>([]);

    const session = useSession()

    useEffect(() => {
        async function fetchOrders() {
            const userId = session?.data?.user?.email  // replace with actual user email
            const fetchedOrders = await getOrdersByUser(userId || '')
            setOrders(fetchedOrders)
            console.log(fetchedOrders)
        }
        fetchOrders()
    }, [session?.data?.user?.email])
    
    function formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês é baseado em zero
    const year = String(date.getFullYear()).slice(-2); // Pega os dois últimos dígitos do ano

    return `${day}/${month}/${year}`;
}

  return (
    <div className='pb-16 pt-6 px-3 sm:max-w-[50%] m-auto'>
          <div>
              <div className='flex flex-col gap-4'>
                  <h1 className='text-3xl font-bold'>Pedidos</h1>
                  {
                      orders.length === 0? (
                          <p>Você não possui nenhum pedido.</p>
                      ) : (
                          orders.map((order) => (
                              <OrderComponent
                                  createdAt={formatDate(order.createdAt)}
                                  items={order.items}
                                  orderId={order.orderId}
                                  totalValue={order.totalValue}
                                  key={order.orderId}
                                  status={order.status}
                              />
                          ))
                      )
 
                 }
              </div>
          </div>
    </div>
  )
}
