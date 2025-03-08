import { auth } from '@/auth'
import UserNotFound from '@/components/UserNotFound'
import UserProfile from '@/components/UserProfile'
import React from 'react'

async function Page() {
  const session = await auth() 

  return (
    <div className="w-full h-[100vh] p-4 flex flex-col items-center justify-center overflow-hidden">
      {session ? (
      
        <UserProfile />
        
      ) : (
          <UserNotFound />
          
      )

      }
    </div>
  )
}

export default Page
