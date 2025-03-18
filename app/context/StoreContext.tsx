"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ref, get, set } from 'firebase/database';
import { database } from '@/services/firebase';

interface StoreConfig {
  name: string;
  address: string;
  phone: string;
  image: string;
  workingHours: string;
  description: string;
  isDeliveryActive: boolean;
  banner: string;
}

interface StoreContextType {
  storeConfig: StoreConfig;
  updateStoreConfig: (config: Partial<StoreConfig>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [storeConfig, setStoreConfig] = useState<StoreConfig>({
    name: 'Borchelle Fast Food',
    address: 'Rua do Borcelle, 123, FastFood',
    phone: '(11) 9 8888 7777',
    image: '/logo.png',
    workingHours: 'Segunda a Sexta: 10:00 - 22:00',
    description: 'O melhor fast food da cidade!',
    isDeliveryActive: true,
    banner: '/banner.png',
  });

  // Carregue as configurações do Firebase ao iniciar
  useEffect(() => {
    const fetchStoreConfig = async () => {
      const configRef = ref(database, 'storeConfig');
      const snapshot = await get(configRef);
      if (snapshot.exists()) {
        setStoreConfig(snapshot.val());
      }
    };

    fetchStoreConfig();
  }, []);

  // Atualize o Firebase quando o estado mudar
  const updateStoreConfig = async (config: Partial<StoreConfig>) => {
    const newConfig = { ...storeConfig, ...config };
    setStoreConfig(newConfig);
    await set(ref(database, 'storeConfig'), newConfig);
  };

  return (
    <StoreContext.Provider value={{ storeConfig, updateStoreConfig }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStoreConfig = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStoreConfig must be used within a StoreProvider');
  }
  return context;
};