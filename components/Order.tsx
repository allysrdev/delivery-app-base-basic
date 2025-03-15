import React from 'react'
import Box from './ui/box'
import Image from 'next/image'
import { Button } from './ui/button'

export default function Order() {
  return (
      <Box>
          <div className='w-full h-full flex flex-col gap-8'>
          <h1 className='font-semibold flex gap-2 text-lg'>
              <Image
                  src={'/order.png'}
                  width={25}
                  height={25}
                  alt='order-icon'
              />
              Pedido nº 01 - 20/05/2022
          </h1>
          <div className='flex items-start gap-2'>
              <Image
                  src={'/lanche1.jpg'}
                  width={50}
                  height={50}
                  alt='order-icon'
                  className='rounded-md'
              />
              <h1 className='font-semibold'>Cheeseburguer Clássico</h1>
              <p className='font-semibold'>Qnt.: 1</p>
              <p className='font-semibold'>R$ 15,00</p>
          </div>
          <div className='flex gap-2 items-center justify-center pl-2'>
            <div className='bg-amber-400 w-1 h-1 rounded-full' />
            <p className='text-sm'>
                Em andamento
              </p>
              </div>
              <Button>Cancelar</Button>
        </div>
  
    </Box>
  )
}
