"use client"; // 🔥 Agora o componente roda no Client Side

import { getSession, signOut } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Avatar from "./Avatar";
import Box from "./ui/box";
import { getUser, updateUser, User } from "@/services/userService";
import { Loader, LucideLogOut } from "lucide-react";
import { Button } from "./ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger } from "./ui/alert-dialog";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";


const formSchema = z.object({
  name: z.string(),
  email: z.string(),
  address: z.string(),
  telephone: z.string().refine(val => /^\d{10,11}$/.test(val), "Telefone inválido"),
  profileImage: z.string()
});

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false)
  const router = useRouter()
    useEffect(() => {
    setLoading(true);
    async function fetchUser() {
      const session = await getSession();
      if (session?.user?.email) {
        const userData = await getUser(session.user.email);
        setUser(userData);
        form.setValue('name', session?.user.name || '');
        form.setValue('email', session?.user.email);
        form.setValue('address', userData?.address || '');
        form.setValue('telephone', userData?.telephone || '')
        }
        setLoading(false);
      }
      
    fetchUser();
    }, []);
  
   const form = useForm<z.infer<typeof formSchema>>({
       resolver: zodResolver(formSchema),
           defaultValues: {
           name: user?.name,
           email: user?.email,
           address: user?.address,
           telephone: user?.telephone,
           profileImage: user?.profileImage || '/default/avatar.png'
   
           }
     })
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setLoading(true);
    updateUser({
      userId: user?.userId || '',
      address: values.address,
      email: user?.email || '',
      telephone: values.telephone,
      name: values.name,
      profileImage: user?.profileImage || '/default-avatar.png',
    })
    setUser({
      userId: user?.userId || '',
      address: values.address,
      email: user?.email || '',
      telephone: values.telephone,
      name: values.name,
      profileImage: user?.profileImage || '/default-avatar.png',
    })
    // set a timeout for setLoading(false)
    setTimeout(() => {
      setLoading(false)

    }, 1000);
  } 

  return (
    <Box tailHeight="max-h-1/2" tailWidth="min-w-60">
      <div className="flex flex-col items-center gap-2 overflow-hidden ">
              {loading ? (
                  <Loader />
              ): (
            <div className="flex flex-col gap-4 overflow-hidden">
            <div className="flex">
              <Avatar src={user?.profileImage || "/default-avatar"} />
              <div>
              <h1 className="font-bold">{user?.name || "Usuário"}</h1>
              <p className="text-xs">{user?.email || "Email não disponível"}</p>
              <p className="text-xs">{user?.telephone || "Telefone não disponível"}</p>
                <p className="text-xs">{user?.address || "Endereço não disponível"}</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <AlertDialog>
                  <AlertDialogTrigger
                  className="bg-black/30 backdrop-blur-md border border-white/40 h-9 hover:bg-black/30 shadow-lg rounded-md cursor-pointer"
                
                >
                  Editar Perfil
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-black/30 backdrop-blur-md border border-white/10 shadow-lg rounded-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Editar Perfil</AlertDialogTitle>
                    <AlertDialogDescription>
                      Edite as informações do seu perfil.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input placeholder={"Nome completo"} {...field} />
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
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                              <Input placeholder="E-mail" {...field} />
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
                              <Input placeholder="Endereço" {...field} />
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
                              <Input placeholder="Nº de telefone" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                        <Button type="submit" className="cursor-pointer bg-green-600 hover:bg-white hover:text-black">{
                        loading ? <Loader /> : <p>Salvar</p>}</Button>
                    </form>
                  </Form>
                  <AlertDialogFooter>
                      <AlertDialogAction onClick={() => router.refresh()} className="bg-black/30 backdrop-blur-md border border-white/60 shadow-lg rounded-md cursor-pointer">Finalizar</AlertDialogAction>
                      </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
                <Button
              className="bg-black/30 backdrop-blur-md border border-red-500/40 hover:border-red-500 hover:bg-black/30 shadow-lg rounded-md cursor-pointer"
              onClick={() => signOut()}
              >
              Sair
              <LucideLogOut />
                </Button>
                </div>
                </div>
                          
        )}

        
      </div>
    </Box>
  );
}
