'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';;
import { useState } from 'react';
import { auth } from '@/services/firebase';

function UserProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [phoneNumber, setPhoneNumber] = useState('(11) 9 8888 7777'); // Exemplo de número de telefone

  const handleSave = () => {
    // Aqui você pode adicionar a lógica para salvar as alterações no Firebase
    console.log('Salvando alterações:', { displayName, phoneNumber });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('Usuário deslogado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (!user) {
    return <div>Nenhum usuário logado.</div>;
  }

  return (
    <div className="bg-black/30 backdrop-blur-md border border-white/10 shadow-lg rounded-md p-4 max-w-sm">
      <div className="flex gap-4 items-center">
        <Image
          src={user.photoURL || '/default-avatar.png'}
          width={60}
          height={60}
          alt="User Avatar"
          className="rounded-full object-cover border-[2.5px] border-[#ededed]"
        />
        <div className="flex flex-col flex-1">
          {isEditing ? (
            <>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-transparent border-b border-white/20 focus:outline-none text-white font-bold"
              />
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="bg-transparent border-b border-white/20 focus:outline-none text-xs mt-1"
              />
            </>
          ) : (
            <>
              <h1 className="font-bold text-white">{displayName}</h1>
              <p className="text-xs text-white/80">{phoneNumber}</p>
              <p className="text-xs text-white/80">{user.email}</p>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="w-full h-10 rounded-md bg-black/30 backdrop-blur-md border border-green-600 text-white shadow-lg flex items-center justify-center hover:bg-black/60 p-4 cursor-pointer"
          >
            Salvar
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full h-10 rounded-md bg-black/30 backdrop-blur-md border border-white/50 text-white shadow-lg flex items-center justify-center hover:bg-black/60 p-4 cursor-pointer"
          >
            Editar Perfil
          </button>
        )}

        <Link
          href="/admin"
          className="w-full h-10 rounded-md bg-black/30 backdrop-blur-md border border-white/50 text-white shadow-lg flex items-center justify-center hover:bg-black/60 p-4 cursor-pointer"
        >
          Painel Administrativo
        </Link>

        <button
          onClick={handleLogout}
          className="w-full h-10 rounded-md bg-black/30 backdrop-blur-md border border-white/50 text-white shadow-lg flex items-center justify-center hover:bg-black/60 p-4 cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default UserProfile;