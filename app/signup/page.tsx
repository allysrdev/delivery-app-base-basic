"use client"
import React, { useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {  LucideUndo, LucideUser, LucideUserPlus } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { redirect } from 'next/navigation'

const formSchema = z.object({
    email: z.string().email().nonempty('Insira um e-mail'),
    password: z.string().min(8).nonempty('Insira uma senha'),
    confirmPassword: z.string(),
    address: z.string(),
    telephone: z.string(),
    profileImage: z.string(),
})

const onSubmit = (data: unknown) => {
  console.log(data)
}

function Page() {
    const [step, setStep] = useState(0);
    const [progress, setProgress] = useState(25);

    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        email: "",
        password: "",
        confirmPassword: "",
        address: "",
        telephone: "",
        profileImage: "/default-avatar.png",

    },
  })


  return (
    <div className='w-full h-[100vh] flex flex-col items-center overflow-hidden'>
          <div className='bg-black/30 backdrop-blur-md border border-white/10 shadow-lg rounded-md p-6 w-full h-[85%] flex items-center justify-center flex-col gap-8'>
              <div className='flex items-center justify-center flex-col gap-6'>
                  <h1 className='text-white text-3xl font-bold flex items-center gap-2'>
                      <LucideUserPlus className='w-[1.875rem] h-[1.875rem]' />  
                      Cadastre-se</h1>
                
                  <p className='text-white text-xs'>Forneça as informações para criar a sua conta</p>
              </div>
            <Progress value={progress}/>
              
               <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 min-w-52">
                      {step === 0 ? (
                          <>
                            <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>E-mail</FormLabel>
                                <FormControl>
                                    <Input className='text-xs' placeholder="seu@email.com" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                                 )}
                            />
                      <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                            <Input className='text-xs' placeholder="Insira a sua senha" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                      />
                      <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Confirmar senha</FormLabel>
                        <FormControl>
                            <Input className='text-xs' placeholder="Insira a sua senha" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                      />
                          </>
                      ) : step === 1 ?  (
                              <>
                              <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Endereço</FormLabel>
                                <FormControl>
                                    <Input className='text-xs' placeholder="Informe seu endereço completo" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                                 )}
                                  />
                                  <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Nº de telefone</FormLabel>
                                <FormControl>
                                    <Input className='text-xs' placeholder="(XX) XXXXX-XXXX" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                                 )}
                            />
                              </>
                          ) : (
                                  <div className='flex flex-col items-center gap-8'>
                                      <div className='bg-black/30 backdrop-blur-md border border-white/10 shadow-lg rounded-full p-6 w-[8rem] h-[8rem] flex items-center justify-center text-white/70'>
                                          <LucideUser />
                                      </div>
                                  <FormField
                                    control={form.control}
                                    name="profileImage"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Foto de Perfil</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    className='text-xs bg-zinc-300 text-black'
                                                    
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                  </div>
                      )
                      }
                      
                      <div className='w-full flex flex-col gap-4 items-start'>
                          {step === 0 ? (
                              <div className='flex items-center justify-between w-full'>
                                    <Button className='bg-black/30 backdrop-blur-md border border-zinc-300 shadow-lg rounded-md p-4' type="button" onClick={() => {
                                  setStep(1)
                                  setProgress(progress + 25)
                                  }}>Continuar</Button>
                                  <Button className='bg-black/30 backdrop-blur-md border border-zinc-300 shadow-lg rounded-md p-4' type="button" onClick={() => {
                                  redirect('/login')
                                  }}><LucideUndo /></Button>
                                  
                                </div>
                            
                          ) : step === 1 ? (
                                  <div className='flex items-center justify-between w-full'>
                                  <Button className='bg-black/30 backdrop-blur-md border border-zinc-300 shadow-lg rounded-md p-4' type="button" onClick={() => {
                                      setStep(2)
                                      setProgress(progress + 35
                                      )
                                      }}>Continuar</Button>

                                      <Button className='bg-black/30 backdrop-blur-md border border-zinc-300 shadow-lg rounded-md p-4' type="button" onClick={() => {
                                          setStep(0)
                                          setProgress(progress - 35)
                                  }}><LucideUndo /></Button>
                                      </div>
                              ) : (
                                    <div className='flex items-center justify-between w-full'>
                                  <Button className='bg-black/30 backdrop-blur-md border border-zinc-300 shadow-lg rounded-md p-4' type="button" onClick={() => {
                                      setStep(3)
                                      setProgress(progress + 15
                                      )
                                      }}>Finalizar</Button>

                                      <Button className='bg-black/30 backdrop-blur-md border border-zinc-300 shadow-lg rounded-md p-4' type="button" onClick={() => {
                                          setStep(1)
                                          setProgress(progress - 15)
                                  }}><LucideUndo /></Button>
                                      </div>
                        ) }
                        
                      </div>
                </form>
                </Form>
          </div>
    </div>
  )
}

export default Page