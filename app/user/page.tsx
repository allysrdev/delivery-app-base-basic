import LoginPage from '@/components/LoginPage'
import StoreProfile from '@/components/StoreProfile'
import React from 'react'

function page() {

    const user = false
  return (
      <div className="w-full h-[100vh] overflow-hidden p-4 flex flex-col items-center justify-center">
          {user ? (
              <StoreProfile />
          ) : (
            <LoginPage />
          )}
    </div>
  )
}

export default page