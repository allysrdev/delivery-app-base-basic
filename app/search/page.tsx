"use client"
import React from 'react'
import { Input } from '@/components/ui/input'
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
import { LucideSearch } from 'lucide-react'
 
const formSchema = z.object({
  search: z.string()
})

function Page() {
    // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  return (
      <div className='w-full h-[100vh] flex flex-col items-center gap-7 pt-3'>
         <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pesquisar</FormLabel>
              <FormControl>
                <Input className='text-xs' placeholder="Digite o nome do produto para encontrar." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
          </Form>
          <div className='w-full h-full flex flex-col'>
              <h1 className='text-xl font-bold'>Resultados da busca</h1>
              <div className='w-full h-1/2 flex flex-col gap-4 items-center justify-center'>
                  <LucideSearch />
                  <h2 className='text-sm'>Digite algo para pesquisar.</h2>
              </div>
          </div>
    </div>
  )
}

export default Page