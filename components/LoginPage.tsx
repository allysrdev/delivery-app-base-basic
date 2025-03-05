"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import { LoginForm } from './LoginForm'
import { SignUpForm } from './SignUpForm'

function LoginPage() {
    const [signUp, setSignUp] = useState(false)

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