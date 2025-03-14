'use client'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import React from 'react'

function page() {
  return (
    <div className='flex flex-col w-full h-[90vh] overflow-hidden items-center justify-center gap-4'>
      <div className='flex flex-col justify-center items-center'>
        <Image src={'/credit-card.png'} width={80} height={80} alt=''/>
        <h1>Pagamento aprovado!</h1>
      </div>
      <Button onClick={() => redirect('/')}>Acompanhar pedido</Button>
    </div>
  )
}

export default page