/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useCart } from "@/app/context/CartContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { getUser, User } from "@/services/userService";
import { useSession } from "next-auth/react"
import Image from "next/image"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import CheckoutElement from "@/components/CheckoutElement";


// Schema de validação
const customerSchema = z.object({
  fullName: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(100),
  email: z.string().email("E-mail inválido").max(150),
  cpf: z.string().regex(/^\d+$/, "Apenas números são permitidos"),
  ddd: z.string().length(2, "DDD deve ter 2 dígitos").regex(/^\d+$/, "Apenas números são permitidos"),
  phone: z.string().min(8, "Telefone inválido").max(9, "Telefone muito longo").regex(/^\d+$/, "Apenas números são permitidos"),
});

type CustomerData = z.infer<typeof customerSchema>;


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const CheckoutPage = () => {
  const { cart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const session = useSession();


  useEffect(() => { 
    const fetchUser = async () => {
      try {
        const userData = await getUser(session.data?.user?.email || '');
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
   })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerData>({
    resolver: zodResolver(customerSchema),
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };



  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-2xl mx-auto bg-black rounded-lg shadow-md p-18">
        <h1 className="text-3xl font-bold text-center mb-8">Finalizar Compra</h1>

        {cart.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xl text-gray-400">Seu carrinho está vazio</p>
          </div>
        ) : (
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1" >
              <AccordionTrigger>Pagar na Entrega</AccordionTrigger>
              <AccordionContent>
                  <div className="flex flex-col gap-4">
                    {cart.map((item) => {
                      return (
                        <div key={item.id} className="flex gap-2">
                          <Image src={item.imageUrl} width={60} height={60} className="rounded-md" alt="" />
                          <div>
                            <h1 className="font-bold">{item.name}</h1>
                            <p className="text-sm text-gray-500">{item.quantity}x</p>
                            <p>Preço:{formatCurrency(item.price)}</p>
                            </div>
                        </div>
                      );
                    })}
                    <div>
                      <p>Nome: {user?.name}</p>
                      <p>E-mail:{user?.email }</p>
                      <p>Telefone: {user?.telephone }</p>
                      <p>Endereço:{user?.address}</p>
                    </div>
                    <div>
                      <p>Subtotal: {formatCurrency(cart.reduce((acc, product) => acc + product.price * product.quantity, 0))}</p>
                      <p>Frete: R$ 10</p>
                      <p className="font-bold">Total: {formatCurrency(cart.reduce((acc, product) => acc + product.price * product.quantity, 0) + 10)}</p>
                    </div>

                <Button className='cursor-pointer h-12 bg-black border border-white/30'>Fazer Pedido</Button>

                </div>
              </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
              <AccordionTrigger>Pagar com Cartão</AccordionTrigger>
              <AccordionContent>
                  <Elements
                    stripe={stripePromise}
                    options={{
                      locale: "pt-BR",
                      amount: (cart.reduce((acc, product) => acc + product.price * product.quantity, 0) + 10)*100,
                      mode: "payment",
                      currency: "brl",
                    }}
                  >
                    <CheckoutElement amount={(cart.reduce((acc, product) => acc + product.price * product.quantity, 0) + 10) * 100} />
                </Elements>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
