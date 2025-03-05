"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import { LoginForm } from './LoginForm'
import { SignUpForm } from './SignUpForm'
import { FcGoogle } from 'react-icons/fc'
import { ref, set } from 'firebase/database'
import { auth, database, googleProvider } from '@/services/firebase'
import { signInWithPopup } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { redirect } from 'next/navigation'



export interface UserData {
  address?: string;
  role: 'user' | 'admin';
  email: string;
  displayName?: string;
}

function LoginPage() {
  const [signUp, setSignUp] = useState(false)
  const handleGoogleSignUp = async () => {


    try {
      const result = await signInWithPopup(auth, googleProvider)
      
      // Criar entrada no banco de dados
      await set(ref(database, `users/${result.user.uid}`), {
        email: result.user.email,
        displayName: result.user.displayName,
        role: "user",
        createdAt: new Date().toISOString(),
        address: "" // Pode ser preenchido posteriormente
      })

    } catch (error) {
      if (error instanceof FirebaseError) {
        alert
        ("Erro ao autenticar com Google. Tente novamente.")
      }
    }
  }
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user exists in DB
      const userRef = ref(database, `users/${user.uid}`);
      // Set initial user data
      await set(userRef, {
        email: user.email,
        displayName: user.displayName,
        role: 'user',
        address: '',
      });
    } catch (error) {
      console.error('Login error:', error);
    }
  };



  return (
    <div className='w-80 h-full flex  flex-col gap-8 items-center justify-center'>
          {
              signUp ? (
                  <>
                      <div className="bg-black/30 backdrop-blur-md border border-white/10 shadow-lg rounded-md p-2 w-full">
                        <div className="flex gap-2 items-center">
                        <Image
                        src='/logo.png'
                        width={45}
                        height={45}
                        alt="logo"
                        className="rounded-full object-cover border-[2.5px] border-[#ededed]"
                            />
                        
                        <div className="flex flex-col ">
                        <h1 className="font-bold text-[0.8rem]">Borcelle Fast Food</h1>
                            </div>
                            
                        </div>
                        </div>
                  <SignUpForm />
                <button
                className="w-1/2 h-10 flex items-center justify-center gap-2 py-2 px-4 bg-white border border-gray-300 rounded-md shadow-md hover:shadow-lg transition-all duration-300 ease-in-out focus:outline-none"
                onClick={() => handleGoogleSignUp()}
              >
                <FcGoogle className="w-6 h-6" />
                <span className="text-xs font-medium text-gray-700 cursor-pointer">Cadastrar com Google</span>
              </button>
                      <div className="w-full flex items-start">
                        <button onClick={() => setSignUp(false)} className="text-[0.8rem] text-decoration-line: underline text-left">
                        <p>Já possui uma conta? <br />Clique aqui</p>
                        </button>
                    </div>
                  </>
              ) : (
             <>         
            <div className="bg-black/30 backdrop-blur-md border border-white/10 shadow-lg rounded-md p-2 w-full">
              <div className="flex gap-2 items-center">
            <Image
              src='/logo.png'
              width={45}
              height={45}
              alt="logo"
              className="rounded-full object-cover border-[2.5px] border-[#ededed]"
                  />
            
            <div className="flex flex-col ">
              <h1 className="font-bold text-[0.8rem]">Borcelle Fast Food</h1>
                  </div>
                  
            </div>
              </div>
              <LoginForm />
              <button
                className="w-1/2 h-10 flex items-center justify-center gap-2 py-2 px-4 bg-white border border-gray-300 rounded-md shadow-md hover:shadow-lg transition-all duration-300 ease-in-out focus:outline-none"
                onClick={async () => {
                  await handleGoogleLogin()
                  redirect('/')
                }}
              >
                <FcGoogle className="w-6 h-6" />
                <span className="text-xs font-medium text-gray-700 cursor-pointer">Login com Google</span>
              </button>
              
          <div className="w-full flex items-start">
            <button onClick={() => setSignUp(true)} className="text-[0.8rem] text-decoration-line: underline text-left">
            <p>Ainda não possui uma conta? <br />Cadastre-se aqui</p>
            </button>
        </div>
                          </>
              )
              }
          </div>
  )
}

export default LoginPage