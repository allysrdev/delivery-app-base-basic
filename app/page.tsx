'use client'
import Banner from "@/components/Banner";
import Section from "@/components/Section";
import StoreProfile from "@/components/StoreProfile";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {  ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import CartProductCard from "@/components/CartProductCard";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 pb-14">
      <Banner />
      <StoreProfile />
      <Section />

      <Popover>
        <PopoverTrigger asChild>
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: [1, 1, 1]}}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="fixed bottom-1/2 right-8"
          >
            <Button className="w-14 h-14 rounded-full bg-black/30 backdrop-blur-md border border-white/50 shadow-lg text-white  flex items-center justify-center hover:bg-black/50 p-4 cursor-pointer fixed top-24 right-3">
              <ShoppingCart className="w-6 h-6" />
            </Button>
          </motion.div>
        </PopoverTrigger>
        <PopoverContent className=" mx-4 bg-black/50 backdrop-blur-md border border-white/10 shadow-lg text-white 
        fixed -top-40 -right-8 min-w-[21.5rem] min-h-[24rem]
        sm:min-w-[35rem] sm:min-h-[35rem]  sm:fixed sm:-top-80  sm:right-10 flex flex-col overflow-x-hidden">
          <h1 className="font-bold text-xl">Carrinho</h1>
          <CartProductCard />
          <CartProductCard />
          <div className="flex gap-2 flex-col mt-auto">
            {/* Subtotal, Finalizar Compra */}
            <div className="w-[95%] h-[1px] bg-white/30 m-auto" />
            <p className="text-sm">Subtotal: R$10,00</p>
            <p className="text-sm">Entrega: R$5,00</p>
            <p className="text-sm font-bold">Total: R$15,00</p>
            <div className="flex gap-2 items-center">
              <Button className="w-full h-10 rounded-md bg-black/30 backdrop-blur-md border border-white/50  text-white shadow-lg flex items-center justify-center hover:bg-black/60 p-4 cursor-pointer">
                Finalizar Compra
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
