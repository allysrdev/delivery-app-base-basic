'use client'
import OrderComponent from '@/components/Order';
import Box from '@/components/ui/box';
import { Skeleton } from '@/components/ui/skeleton';
import { getOrdersByUser, Order } from '@/services/orderService'
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'

export default function Page() {
    
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const session = useSession()

    useEffect(() => {
        async function fetchOrders() {
            const userId = session?.data?.user?.email  // replace with actual user email
            const fetchedOrders = await getOrdersByUser(userId || '')
            setOrders(fetchedOrders)
            console.log(fetchedOrders)
        }
        fetchOrders()
        setLoading(false);
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
                  {loading ? (
                      <Box>
                          <div className="flex flex-col space-y-3">
                            <div className="space-y-2">
                                  <Skeleton className="h-4 w-[350px]" />
                                  <br />
                                <Skeleton className="h-4 w-[200px]" />
                                <Skeleton className="h-4 w-[50px]" />
                                  <Skeleton className="h-4 w-[50px]" />
                                  <br />
                                <Skeleton className="h-4 w-[120px]" />
                            </div>
                            </div>
                    </Box>
                    ) : orders.length === 0 ? (
                    <></>
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
                    )}
                  
              </div>
          </div>
    </div>
  )
}
