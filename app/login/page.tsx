"use client"
import React from 'react'
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
import Link from 'next/link'
import { LucideUser } from 'lucide-react'
import { redirect } from 'next/navigation'
import { FcGoogle } from "react-icons/fc";
import { doSocialLoginWithGoogle } from '@/services/actions'

const formSchema = z.object({
  email: z.string().email().nonempty('Insira um e-mail'),
  password: z.string().min(8).nonempty('Insira uma senha'),
})

const onSubmit = (data: unknown) => {
  console.log(data)
}

function Page() {

    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        email: "",
        password: "",
    },
  })


  return (
    <div className='w-full h-[100vh] flex flex-col items-center overflow-hidden'>
          <div className='bg-black/30 backdrop-blur-md border border-white/10 shadow-lg rounded-md p-6 w-full h-[85%] flex items-center justify-center flex-col gap-8'>
              <div className='flex items-center justify-center flex-col gap-6'>
                  <h1 className='text-white text-3xl font-bold flex items-center gap-2'>
                      <LucideUser className='w-[1.875rem] h-[1.875rem]' />  
                      Login</h1>
                
                  <p className='text-white text-xs'>Entre com seu email e senha para acessar sua conta</p>
              </div>
               <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 min-w-52">
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
                      <div className='w-full flex flex-col gap-4 items-start'>
              <Button className='bg-black/30 backdrop-blur-md border border-zinc-300 shadow-lg rounded-md p-4 cursor-pointer' type="submit">Entrar</Button>
                   <div className='flex items-center gap-2'>
                          <Button className='bg-black/30 backdrop-blur-md border border-zinc-300 shadow-lg rounded-md p-4 cursor-pointer' onClick={() => redirect('/signup')} type='button'>Criar uma Conta</Button>

                <Button className='bg-white/90 backdrop-blur-md border border-zinc-300 shadow-lg rounded-md p-4 cursor-pointer text-black/70 hover:bg-white/80' onClick={() => doSocialLoginWithGoogle('/signup')} type='button'>
                  <FcGoogle />
                  Entrar com Google</Button>
              </div>
                        <Link className='text-blue-500 hover:text-blue-600 underline flex items-center justify-center gap-2 text-xs' href="/">
                            Esqueci minha senha
                        </Link>
                      </div>
                </form>
                </Form>
          </div>
    </div>
  )
}

export default Page