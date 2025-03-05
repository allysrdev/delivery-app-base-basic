"use client"

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
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { createUserWithEmailAndPassword,} from "firebase/auth"

import { FirebaseError } from "firebase/app"
import { auth, database } from "@/services/firebase"
import { ref, set } from "firebase/database"
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { AlertCircle } from "lucide-react"
import { redirect } from "next/navigation"

type FormSchemaType = z.infer<typeof formSchema>

// onsubmit


const formSchema = z.object({
  email: z
    .string()
    .min(5, { message: "E-mail deve ter pelo menos 5 caracteres." })
    .max(100, { message: "E-mail muito longo." })
    .email({ message: "E-mail inválido." }),

  password: z
    .string()
    .min(8, { message: "Senha deve ter pelo menos 8 caracteres." })
    .max(50, { message: "Senha muito longa." })
    .regex(/[A-Z]/, { message: "Senha deve conter pelo menos uma letra maiúscula." })
    .regex(/[a-z]/, { message: "Senha deve conter pelo menos uma letra minúscula." })
    .regex(/[0-9]/, { message: "Senha deve conter pelo menos um número." })
    .regex(/[^A-Za-z0-9]/, { message: "Senha deve conter pelo menos um caractere especial." }),

  address: z
    .string()
    .min(5, { message: "O endereço deve ter pelo menos 5 caracteres." })
    .max(200, { message: "O endereço é muito longo." }),
})



export function SignUpForm() {
  const [error, setError] = useState("");


  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "", address: "" },
  })


  const handleFirebaseSignUp = async (email: string, password: string, address: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Salvar informações adicionais no Realtime Database
      await set(ref(database, `users/${userCredential.user.uid}`), {
        email: userCredential.user.email,
        address: address,
        role: "user",
        createdAt: new Date().toISOString()
      })

    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            alert("Este e-mail já está em uso.")
            break
          case 'auth/invalid-email':
            setError("E-mail inválido.")
            break
          case 'auth/weak-password':
            setError("Senha muito fraca.")
            break
          default:
            setError("Erro ao criar conta. Tente novamente.")
        }
      }
    }
  }

  const onSubmit = async (data: FormSchemaType) => {
    await handleFirebaseSignUp(data.email, data.password, data.address)
    form.reset()
    redirect('/user')
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  className="placeholder:text-xs w-full"
                  placeholder="seu.email@exemplo.com"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs min-h-[1rem] w-full opacity-100 transition-opacity duration-300 ease-in-out break-words" />
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
                  type="password"
                  className="placeholder:text-xs w-full"
                  placeholder="suasenha123*"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs min-h-[1rem] opacity-100 transition-opacity duration-300 ease-in-out break-words" />
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
                <Input
                  type="text"
                  className="placeholder:text-xs w-full"
                  placeholder="Rua, número, bairro, cidade..."
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs min-h-[1rem] opacity-100 transition-opacity duration-300 ease-in-out break-words" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center">
          <Button
            type="submit"
            className="w-1/2 h-10 rounded-md bg-black/30 backdrop-blur-md border border-white/50 text-white shadow-lg flex items-center justify-center hover:bg-black/60 p-4 cursor-pointer"
          >
            Fazer cadastro
          </Button>
        </div>
        {error ? (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <Alert variant="destructive" className="relative z-10 max-w-md mx-auto p-4 rounded-md bg-red-600 text-white shadow-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Your session has expired. Please log in again.
            </AlertDescription>
          </Alert>
        </div>
      ): ''}
      </form>
      
    </Form>
  )
}
