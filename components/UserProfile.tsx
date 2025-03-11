"use client"; // 🔥 Agora o componente roda no Client Side

import { getSession, signOut } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Avatar from "./Avatar";
import Box from "./ui/box";
import { getUser, User } from "@/services/userService";
import { Loader, LucideLogOut } from "lucide-react";
import { Button } from "./ui/button";

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false)
    useEffect(() => {
    setLoading(true);
    async function fetchUser() {
      const session = await getSession();
      if (session?.user?.email) {
        const userData = await getUser(session.user.email);
        setUser(userData);
        }
        setLoading(false);
    }
    fetchUser();
  }, []);

  return (
    <Box tailHeight="max-h-1/2" tailWidth="min-w-60">
      <div className="flex flex-col items-center gap-2 ">
              {loading ? (
                  <Loader />
              ): (
            <div className="flex flex-col gap-4">
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
              <Button
              className="bg-black/30 backdrop-blur-md border border-white/10 shadow-lg rounded-md cursor-pointer"
              
              >
              Editar Perfil
              </Button>
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
