
"use client";
import React, { useEffect, useState } from "react";
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
import Box from "@/components/ui/box";
import { LucideAtSign, LucideMapPinHouse, LucidePhoneCall, LucideUser } from "lucide-react";
import { getOrdersByUser } from "@/services/orderService";
import { redirect } from "next/navigation";



const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
if (!stripeKey) {
  throw new Error('Chave pública do Stripe não configurada!');
}

const stripePromise = loadStripe(stripeKey);

const CheckoutPage = () => {
  const { cart } = useCart();
  const [user, setUser] = useState<User | null>(null);
  const session = useSession();
  

  useEffect(() => { 
    const fetchUser = async () => {
      if (!session.data) {
        redirect('/login');
        return;
      }
      try {
        const userData = await getUser(session.data?.user?.email || '');
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, [session])
  
  useEffect(() => {
    const order = async () => {
      const userOrders = await getOrdersByUser(user?.email || '');
      const hasPendingOrder = userOrders?.some(order => order.status === "Pendente")
      if (hasPendingOrder) {
        redirect('/pedidos')
      }
      
    }
    order();
  }, [user?.email])
  


  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };



  return (
    <div className="min-h-screen bg-black p-4 pb-10">
      <div className="w-full sm:max-w-2xl mx-auto bg-black rounded-lg shadow-md p-5">
        <h1 className="text-3xl font-bold text-center mb-8">Finalizar Compra</h1>

        {cart.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xl text-gray-400">Seu carrinho está vazio</p>
          </div>
        ) : (
            <Accordion className="w-full" type="single" collapsible>
              <div className="flex flex-col gap-4">
                <Box>
                  <div className="w-full h-full flex flex-col gap-2">

                      <p className="text-xs flex gap-1"><LucideUser size={15} />{user?.name}</p>
                      <p className="text-xs flex gap-1"><LucideAtSign size={15}  />{user?.email }</p>
                      <p className="text-xs flex gap-1"><LucidePhoneCall size={15} />{user?.telephone }</p>
                      <p className="text-xs flex gap-1"><LucideMapPinHouse size={15} />{user?.address}</p>
                  </div>
                    </Box>
                    
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
                      <p>Subtotal: {formatCurrency(cart.reduce((acc, product) => acc + product.price * product.quantity, 0))}</p>
                      <p>Frete: R$ 10</p>
                      <p className="font-bold">Total: {formatCurrency(cart.reduce((acc, product) => acc + product.price * product.quantity, 0) + 10)}</p>
                    </div>

                </div>
            <AccordionItem value="item-1" >
              <AccordionTrigger>Pagar na Entrega</AccordionTrigger>
              <AccordionContent>
                  

                <Button className='cursor-pointer h-12 bg-black border border-white/30'>Fazer Pedido</Button>
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
              <AccordionItem value="item-3" >
              <AccordionTrigger>Pagar com Pix</AccordionTrigger>
              <AccordionContent>
                  

                <Button className='cursor-pointer h-12 bg-black border border-white/30'>Fazer Pedido</Button>
              </AccordionContent>
              </AccordionItem>
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
