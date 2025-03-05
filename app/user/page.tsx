"use client"
import LoginPage from '@/components/LoginPage'
import UserProfile from '@/components/UserProfile';
import { useAuth } from '@/context/AuthContext';
import React from 'react'

function Page() {
  const { user, loading } = useAuth();

  return (
    <div className="w-full h-[100vh] overflow-hidden p-4 flex flex-col items-center justify-center">
      {user ? (
        <UserProfile />
      ) : (
        <LoginPage />
      )}
    </div>
  )
}


export default Page