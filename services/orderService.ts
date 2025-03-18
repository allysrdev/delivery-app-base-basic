import { ref, set, get, getDatabase, push } from 'firebase/database';
import { database } from './firebase';

// Interface para um item do pedido
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Interface para um pedido
export interface Order {
  orderId: string;
  createdAt: string;
  userId: string;
  contactNumber: string;
  name: string;
  email: string;
  address: string;
  items: OrderItem[];
  totalValue: number;
  status: 'Pendente' | 'Preparo' | 'Entrega' | 'Entregue' | 'Cancelado';
}

// Função para gerar um número de pedido aleatório
const generateOrderId = (): string => {
  return `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
};

// Função para criar um novo pedido
export const createOrder = async (
  userId: string,
  contactNumber: string,
  name: string,
  email: string,
  address: string,
  items: OrderItem[],
  totalValue: number,
): Promise<string | null> => {
  try {
    const db = getDatabase();
    const ordersRef = ref(db, 'orders');

    const newOrder: Order = {
      orderId: generateOrderId(),
      createdAt: new Date().toISOString(),
      userId,
      contactNumber,
      name,
      email,
      address,
      items,
      totalValue,
      status: 'Pendente'
    };

    const newOrderRef = push(ordersRef);
    await set(newOrderRef, newOrder);

    return newOrder.orderId;
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return null;
  }
};

// Função para obter todos os pedidos
export const getOrders = async (): Promise<Order[]> => {
  try {
    const db = getDatabase();
    const ordersRef = ref(db, 'orders');

    const snapshot = await get(ordersRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map((key) => ({
        ...data[key],
      }));
    }
    return [];
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return [];
  }
};

export const getOrdersByUser = async (email: string): Promise<Order[]> => {
    try {
        const ordersRef = ref(database, 'orders'); // Usa o `database` corretamente
        const snapshot = await get(ordersRef);
    
        if (snapshot.exists()) {
            const data = snapshot.val();
            return Object.keys(data)
                .map((key) => data[key])
                .filter((order) => order.email === email);
        }
        return [];
    } catch (error) {
        console.error('Erro ao buscar pedidos do usuário:', error);
        return [];
    }
  }