import React from 'react'
import Box from './ui/box'
import Image from 'next/image'
import { Button } from './ui/button'
import { Loader } from 'lucide-react'

export default function OrderComponent({
    orderId ,
      createdAt, 
      items,
      totalValue,
      status,
  
}: {
    orderId: string,
    createdAt: string,
    items: Array<{
        id: string,
        name: string,
        quantity: number,
        price: number
    }>,
    totalValue: number,
    status: string,
  
    
}) {
  return (
      <Box>
          <div className='w-full h-full flex flex-col gap-8'>
          <h1 className='font-semibold flex gap-2 text-sm'>
              <Image
                  src={'/order.png'}
                  width={25}
                  height={25}
                  alt='order-icon'
              />
              Pedido nº {orderId} - {createdAt}
          </h1>
              {items && items.length > 0 ? (
                items.map((item) => (
                    <div key={item.id} className="flex flex-col items-start gap-2">
                    <h1 className="font-semibold">{item.name}</h1>
                    <p className="font-semibold">Qnt.: {item.quantity}</p>
                    <p className="font-semibold">R${item.price}</p>
                    </div>
                ))
                ) : (
                <div  className="flex flex-col center justify-center">
                          <Loader />
                </div>
                )}
              <h1 className='font-semibold flex gap-2 text-sm'>
              <Image
                  src={'/money.png'}
                  width={25}
                  height={25}
                  alt='order-icon'
              />
              Valor Total: {totalValue}
          </h1>
          <div className='flex gap-2 items-center justify-center pl-2'>
            <div className='bg-amber-400 w-1 h-1 rounded-full' />
            <p className='text-sm'>
                {status}
              </p>
              </div>
              <Button>Cancelar</Button>
        </div>
  
    </Box>
  )
}
