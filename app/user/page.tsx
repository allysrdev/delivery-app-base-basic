"use client"
import UserNotFound from '@/components/UserNotFound'
import React from 'react'

function Page() {

  return (
    <div className="w-full h-[100vh] p-4 flex flex-col items-center justify-center overflow-hidden">
      <UserNotFound />
    </div>
  )
}

export default Page
