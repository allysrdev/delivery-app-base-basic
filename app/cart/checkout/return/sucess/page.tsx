'use client'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import React, { useEffect } from 'react'

function Page() {
  useEffect(() => {
    setTimeout(() => {
      redirect('/pedidos')
    }, 3000)
  })
  return (
    <div className='flex flex-col w-full h-[90vh] overflow-hidden items-center justify-center gap-4'>
      <div className='flex flex-col justify-center items-center'>
        <Image src={'/credit-card.png'} width={80} height={80} alt=''/>
        <h1>Pagamento aprovado!</h1>
      </div>
      <p>Aguarde enquanto redirecionamos você para a página de pedidos</p>
    </div>
  )
}

export default Page