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
import { zodResolver } from "@hookform/resolvers/zod";

type FormSchemaType = z.infer<typeof formSchema>;

// onsubmit
async function onSubmit(data: FormSchemaType) {
  const result = formSchema.safeParse(data);
  
  if (!result.success) {
    console.error("Erro de validação:", result.error.format());
    return;
  }
  
  console.log("Formulário válido!", result.data);
}

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
    .regex(/[^A-Za-z0-9]/, { message: "Senha deve conter pelo menos um caractere especial." })
});

export function LoginForm() {
     const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });
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
                <Input type="email" className="placeholder:text-xs w-full" placeholder="seu.email@exemplo.com" {...field}/>
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
                <Input type="password" className="placeholder:text-xs w-full" placeholder="suasenha123*" {...field} />
              </FormControl>
              <FormMessage className="text-xs min-h-[1rem] opacity-100 transition-opacity duration-300 ease-in-out break-words" />
              
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center">
          <Button type="submit" className="w-1/2 h-10 rounded-md bg-black/30 backdrop-blur-md border border-white/50  text-white shadow-lg flex items-center justify-center hover:bg-black/60 p-4 cursor-pointer">
                Entrar
          </Button>
        </div>
        
      </form>
    </Form>
  )
}
