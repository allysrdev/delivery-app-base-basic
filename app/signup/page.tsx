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
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { addUser, getUser } from '@/services/userService'
import { v4 as uuidv4 } from 'uuid'
import Avatar from '@/components/Avatar'
import bcrypt from 'bcryptjs'



function Page() {
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(33)
  const { data: session } = useSession()
  const [profilePhoto, setProfilePhoto] = useState(session?.user?.image || '/default-avatar.png')
  const [loading, setLoading] = useState(false)
    const router = useRouter()
    
    
const formSchema = z.object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    email: z.string().email("E-mail inválido"),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    street: z.string().min(3, "Rua inválida"),
    number: z.string().min(1, "Número inválido"),
    reference: z.string().optional(),
    neighborhood: z.string().min(3, "Bairro inválido"),
    telephone: z.string().refine(
      (val) => /^\(\d{2}\)\d{5}-\d{4}$/.test(val),
      "Formato inválido (XX)XXXXX-XXXX"
    ),
    profileImage: z.string().optional(),
  }).superRefine((data, ctx) => {
    // Validação condicional de senha apenas para login não social
    if (!session?.user && data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Senhas não coincidem",
        path: ["confirmPassword"],
      });
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      street: "",
      number: "",
      reference: "",
      neighborhood: "",
      telephone: "",
      profileImage: "",
    }
  })
    
type FormValues = z.infer<typeof formSchema>
    

  
  useEffect(() => {
    if (session?.user) {
      alreadyExists()
      form.setValue('email', session.user.email || '')
      form.setValue('name', session.user.name || '')
      form.resetField('password')
      form.resetField('confirmPassword')
      setProfilePhoto(session.user.image || '/default-avatar.png')
      setStep(1)
      setProgress(66)
    }
  }, [session, form])

  async function alreadyExists() {
    const user = await getUser(session?.user?.email || '')
    if (user) router.push('/')
  }

async function onSubmit(values: FormValues) {
  setLoading(true)
  try {
    const isSocialLogin = !!session?.user

    // Dados básicos para ambos os fluxos
    const userData = {
      userId: uuidv4(),
      name: values.name || session?.user?.name || '',
      email: values.email || session?.user?.email || '',
      address: `${values.street}, ${values.number}, ${values.neighborhood}${values.reference ? `, ${values.reference}` : ''}`,
      telephone: values.telephone,
      profileImage: profilePhoto || session?.user?.image || '/default-avatar.png',
      role: "Usuário",
      password: isSocialLogin ? '' : await bcrypt.hash(values.password! , 10)
    }

    // Validação adicional para login social
    if (isSocialLogin) {
      if (!session.user?.email) throw new Error('E-mail não encontrado na sessão')
      userData.email = session.user.email
    }

    await addUser(userData)

    // Autenticação automática
    if (isSocialLogin) {
      await signIn('google', { callbackUrl: '/' })
    } else {
      await signIn('credentials', {
        email: userData.email,
        password: values.password,
        redirect: false
      })
      router.push('/')
    }

  } catch (err) {
    setLoading(false)
    alert(err instanceof Error ? err.message : 'Erro ao criar conta')
  }
}



  const handleBack = () => {
    setStep(prev => Math.max(0, prev - 1))
    setProgress(prev => Math.max(33, prev - 33))
  }

const handleNext = async () => {
  const socialLogin = !!session?.user
  const fields = step === 0 
    ? (socialLogin ? ['email'] : ['email', 'password', 'confirmPassword'])
    : ['name', 'street', 'number', 'neighborhood', 'telephone']

  const isValid = await form.trigger(fields as (keyof FormValues)[])
  if (isValid) {
    setStep(prev => prev + 1)
    setProgress(prev => prev + 33)
  }
}

  return (
    <div className='w-full h-[100vh] flex flex-col items-center overflow-hidden'>
      <div className='bg-black/30 backdrop-blur-md shadow-lg rounded-md p-6 w-full h-[85%] flex items-center justify-center flex-col gap-8'>
        <div className='flex items-center justify-center flex-col gap-6'>
          <LucideUserPlus className='w-[1.875rem] h-[1.875rem]' />  
          <h1 className='text-white text-3xl font-bold'>Cadastre-se</h1>
        </div>
        
        <Progress value={progress} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 min-w-52">
            {step === 0 && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className='text-xs'
                          placeholder="seu@email.com"
                          disabled={!!session?.user}
                        />
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
                        <Input
                          {...field}
                          type="password"
                          className='text-xs'
                          placeholder="Insira a sua senha"
                          disabled={!!session?.user}
                        />
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
                        <Input
                          {...field}
                          type="password"
                          className='text-xs'
                          placeholder="Confirme a senha"
                          disabled={!!session?.user}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {step === 1 && (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input {...field} className='text-xs' placeholder="Seu nome completo" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex gap-2'>
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormLabel>Rua</FormLabel>
                        <FormControl>
                          <Input {...field} className='text-xs' placeholder="Nome da rua" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem className='w-20'>
                        <FormLabel>Nº</FormLabel>
                        <FormControl>
                          <Input {...field} className='text-xs' placeholder="Nº" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input {...field} className='text-xs' placeholder="Bairro" />
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
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className='text-xs' 
                          placeholder="(XX)XXXXX-XXXX"
                          onChange={e => {
                            const value = e.target.value
                            .replace(/\D/g, '')
                            .replace(/(\d{2})(\d{5})(\d{4})/, '($1)$2-$3')
                            field.onChange(value)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {step === 2 && (
              <div className='flex flex-col items-center gap-8'>
                <Avatar src={profilePhoto} alt={session?.user?.name || ''} />

                <FormField
                  control={form.control}
                  name="profileImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Foto de Perfil</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          className='text-xs bg-zinc-300 text-black'
                          onChange={e => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onload = (event) => {
                                setProfilePhoto(event.target?.result as string)
                                field.onChange(event.target?.result)
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className='w-full flex justify-between'>
              {step > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBack}
                  className='bg-black/30 border border-zinc-300'
                >
                  <LucideUndo className="mr-2 h-4 w-4" /> Voltar
                </Button>
              )}

              {step < 2 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className='bg-black/30 border border-zinc-300'
                >
                  Continuar
                </Button>
              ) : (
                <Button type="submit" disabled={loading} className='bg-black/30 border border-zinc-300'>
                  {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                  Finalizar Cadastro
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Page