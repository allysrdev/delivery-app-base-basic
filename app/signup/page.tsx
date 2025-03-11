"use client"
import React, { useEffect, useState } from 'react'
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
import { Loader, LucideUndo, LucideUserPlus } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { redirect } from 'next/navigation'
import { useSession } from 'next-auth/react'
// import { Cloudinary } from '@cloudinary/url-gen/index'
import { addUser, getUser } from '@/services/userService'
import { v4 as uuidv4 } from 'uuid';
import Avatar from '@/components/Avatar'

const formSchema = z.object({
        name: z.string(),
        email: z.string(),
        password: z.string(), // Apenas verifica se não está vazio
        confirmPassword: z.string(),
        address: z.string(),
        telephone: z.string().refine(val => /^\d{10,11}$/.test(val), "Telefone inválido"),
        profileImage: z.string(),
    }).refine(data => data.password === data.confirmPassword, {
        message: "Senhas não coincidem",
        path: ["confirmPassword"],
    });


function Page() {
    const [step, setStep] = useState(0);
    const [progress, setProgress] = useState(25);
    const { data: session } = useSession();
    const [profilePhoto, setProfilePhoto] = useState(session?.user?.image || '/default-avatar.png')
    const [loading, setLoading] = useState(false);

    
    useEffect(() => {
        if (session?.user) {
            form.setValue('email', session?.user?.email || '')
            form.setValue('name', session?.user?.name || '')
            form.resetField('address')
            form.trigger(["email", "password", "confirmPassword", "address"]);
            setProfilePhoto(session?.user?.image || '')
            setStep(1)

            alreadyExists();
        }
        
        
    }, [session]);
    
    async function alreadyExists() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const user = await getUser(session?.user?.email || '');
        if (user) { 
            redirect('/')
        }
    }
    

    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
        defaultValues: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        address: "",
        telephone: "",
        profileImage: "",

        }
  })

    // const cld = new Cloudinary({
    // cloud: {
    //   cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    // },
    // });
    
    function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        console.log(values);
        try {
            const userId = uuidv4().toString();
            setStep(3);
            setProgress(100);
            setLoading(false);    
            addUser({userId: userId,name: values.name, email: values.email, address: values.address,telephone: values.telephone, profileImage: session?.user?.image || '/default/avatar.png'})
        } catch (err) {
            setLoading(false);
            alert(err)
        }
    }


  return (
    <div className='w-full h-[100vh] flex flex-col items-center overflow-hidden'>
          <div className='bg-black/30 backdrop-blur-md border border-white/10 shadow-lg rounded-md p-6 w-full h-[85%] flex items-center justify-center flex-col gap-8'>
              <div className='flex items-center justify-center flex-col gap-6'>
                   <LucideUserPlus className='w-[1.875rem] h-[1.875rem]' />  
                    <h1 className='text-white text-3xl font-bold flex items-center gap-2'>
                    Cadastre-se
                    </h1>
                      
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
                                    <Input  className='text-xs' placeholder="seu@email.com" {...field}  />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                                 )}
                            />
                      <FormField
                    control={form.control}
                                  name="password"
                                  disabled={!!session?.user}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                            <Input type='password' className='text-xs' placeholder="Insira a sua senha" {...field}  value={session?.user?.email ? "379ryqx3498n8qo3xufhqiu" : ''}   />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                      />
                      <FormField
                    control={form.control}
                    name="confirmPassword"
                    disabled={!!session?.user}

                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Confirmar senha</FormLabel>
                        <FormControl>
                            <Input type='password' className='text-xs' placeholder="Insira a sua senha" {...field}  value={session?.user ? "379ryqx3498n8qo3xufhqiu" : ''}   />
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
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Nome Completo</FormLabel>
                                <FormControl>
                                        <Input type='text' className='text-xs' placeholder="Informe seu endereço completo" {...field}
                                       />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                                 )}
                                  />
                              <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Endereço</FormLabel>
                                <FormControl>
                                        <Input type='text' className='text-xs' placeholder="Informe seu endereço completo" {...field}
                                       />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                                 )}
                                  />
                                  <FormField
                            control={form.control}
                            name="telephone"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Nº de telefone</FormLabel>
                                <FormControl>
                                    <Input className='text-xs'  placeholder="(XX) XXXXX-XXXX" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                                 )}
                            />
                              </>
                          ) : (
        
                                  <div className='flex flex-col items-center gap-8'>
                                    <Avatar src={profilePhoto} alt={session?.user?.name || ''}  />

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
                                  <Button className='bg-black/30 backdrop-blur-md border border-zinc-300 shadow-lg rounded-md p-4' type="button" onClick={(e) => {
                                      e.preventDefault();
                                  setStep(1)
                                  setProgress(30)
                                  }}>Continuar</Button>
                                  <Button className='bg-black/30 backdrop-blur-md border border-zinc-300 shadow-lg rounded-md p-4' type="button" onClick={() => {
                                  redirect('/login')
                                  }}><LucideUndo /></Button>
                                  
                                </div>
                            
                          ) : step === 1 ? (
                                  <div className='flex items-center justify-between w-full'>
                                      <Button className='bg-black/30 backdrop-blur-md border border-zinc-300 shadow-lg rounded-md p-4' type="button" onClick={(e) => {
                                          e.preventDefault();
                                      setStep(2)
                                      setProgress(60)
                                      }}>Continuar</Button>

                                      <Button className='bg-black/30 backdrop-blur-md border border-zinc-300 shadow-lg rounded-md p-4 cursor-pointer' type="button" onClick={() => {
                                          setStep(0)
                                          setProgress(30)
                                  }}><LucideUndo /></Button>
                                      </div>
                              ) : (
                                    <div className='flex items-center justify-between w-full'>
                                          <Button className='bg-black/30 backdrop-blur-md border border-zinc-300 shadow-lg rounded-md p-4 cursor-pointer' type="submit"
                                              onClick={() => {
                                                  setTimeout(() => {
                                                      setLoading(true);
                                                      alreadyExists()
                                                      setLoading(false);
                                                   }, 2000)
                                            }}
                                          >{loading ? <Loader /> : 'Finalizar'}</Button>

                                      <Button className='bg-black/30 backdrop-blur-md border border-zinc-300 shadow-lg rounded-md p-4 cursor-pointer' type="button" onClick={() => {
                                          setStep(1)
                                          setProgress(60)
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