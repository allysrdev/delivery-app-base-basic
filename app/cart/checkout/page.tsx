"use client";
import React, { useEffect,  useState } from "react";
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
import { LucideAtSign, LucideInfo, LucideMapPinHouse, LucideMapPinPlus, LucidePhoneCall, LucideUser } from "lucide-react";
import { getOrdersByUser } from "@/services/orderService";
import { redirect } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";



const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
if (!stripeKey) {
  throw new Error('Chave pública do Stripe não configurada!');
}

const stripePromise = loadStripe(stripeKey);

  const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const encodedAddress = encodeURIComponent(address);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const { results } = response.data;
    if (results.length > 0) {
      const { lat, lng } = results[0].geometry.location;
      return { lat, lng };
    } else {
      console.error('Endereço não encontrado.');
      return null;
    }
  } catch (error) {
    console.error('Erro ao geocodificar o endereço:', error);
    return null;
  }
};

  const deliveryCenter = { lat: -23.675536, lng: -46.643402 };
  const deliveryRadius = 10000;

  const haversineDistance = (
  coords1: { lat: number; lng: number },
  coords2: { lat: number; lng: number }
): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;

  const R = 6371e3; // Raio da Terra em metros
  const φ1 = toRad(coords1.lat);
  const φ2 = toRad(coords2.lat);
  const Δφ = toRad(coords2.lat - coords1.lat);
  const Δλ = toRad(coords2.lng - coords1.lng);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance; // Distância em metros
  };
  
  const isWithinDeliveryRadius = (
  userCoords: { lat: number; lng: number },
  centerCoords: { lat: number; lng: number },
  radius: number
): boolean => {
  const distance = haversineDistance(userCoords, centerCoords);
  return distance <= radius;
};

const CheckoutPage = () => {
  const { cart } = useCart();
  const [user, setUser] = useState<User | null>(null);
  const session = useSession();
  const [isWithinRadius, setIsWithinRadius] = useState<boolean | null>(null);
  const [troco, setTroco] = useState("")
  const [newAddress, setNewAddress] = useState<string>("")


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
  

  useEffect(() => {
    const fetchUser = async () => {
      if (!session.data) {
        redirect('/login');
        return;
      }
      try {
        const userData = await getUser(session.data?.user?.email || '');
        setUser(userData);

        if (userData?.address) {
          const userCoords = await geocodeAddress(userData.address);
          if (userCoords) {
            const withinRadius = isWithinDeliveryRadius(
              userCoords,
              deliveryCenter,
              deliveryRadius
            );
            setIsWithinRadius(withinRadius);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };
    fetchUser();
  }, [session])
  


  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }


  return (
    <div className="min-h-screen bg-black p-4 pb-10">
      <div className="w-full sm:max-w-2xl mx-auto bg-black rounded-lg shadow-md p-5">
        <h1 className="text-3xl font-bold text-center mb-8">Finalizar Compra</h1>

        {cart.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xl text-gray-400">Seu carrinho está vazio</p>
          </div>
        ) : isWithinRadius ?  (
            
            <Accordion className="w-full" type="single" collapsible>
              <div className="flex flex-col gap-4">
                <Box>
                  <div className="w-full h-full flex flex-col gap-2">

                      <p className="text-xs flex gap-1"><LucideUser size={15} />{user?.name}</p>
                      <p className="text-xs flex gap-1"><LucideAtSign size={15}  />{user?.email }</p>
                      <p className="text-xs flex gap-1"><LucidePhoneCall size={15} />{user?.telephone }</p>
                      <p className="text-xs flex gap-1"><LucideMapPinHouse size={15} />{user?.address}</p>
                    <Label className=" flex gap-2 items-start text-xs">
                      <LucideMapPinPlus size={15} /> Entregar em outro endereço?</Label>
                    <Input
                      type="text"
                      name="newAddress"
                      placeholder="Digite o endereço completo"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      className="text-xs"
                    />
                    <p className="text-xs flex gap-2">
                        <LucideInfo size={25} />
                        Este endereço não ficará salvo nem substituirá o endereço cadastrado. Para alterar o seu
                        endereço original vá em perfil {">"} editar perfil
                      </p>
                    
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
                  <p>Você precisa de troco?</p>
                  <Input type="string" name="troco" placeholder="R$100" onChange={(e) => setTroco(e.target.value)} />

                  <Button className='cursor-pointer h-12 bg-black border border-white/30'
                    onClick={() =>
                      redirect(`/cart/checkout/return/sucess?paymentMethod=entrega&troco=${troco}${newAddress ? `&newAddress=${newAddress}` : ""}`)
                      }>Fazer Pedido</Button>
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
                    <CheckoutElement newAddress={newAddress} amount={(cart.reduce((acc, product) => acc + product.price * product.quantity, 0) + 10) * 100} />
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
        ) : (
            <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
                <h1 className="text-2xl">Você não está dentro do raio de entrega</h1>
                <p>Infelizmente o seu endereço não é coberto pelo raio de entrega da nossa loja.</p> 
                <p>Dúvidas?</p>
                <Button>Entre em contato</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
