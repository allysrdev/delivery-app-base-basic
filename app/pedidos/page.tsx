import Order from '@/components/Order'
import React from 'react'

export default function page() {
  return (
    <div className='pb-16 pt-6 px-3 sm:max-w-[50%] m-auto'>
          <div>
              <div className='flex flex-col gap-4'>
                  <h1 className='text-3xl font-bold'>Pedidos</h1>
                  <Order />
                  <Order />
                  <Order />
              </div>
          </div>
    </div>
  )
}
