'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getOrders, Order, updateOrderStatus } from '@/services/orderService';
import { Printer, CheckCircle, XCircle, Truck, PackageCheck, Phone } from 'lucide-react';

const getElapsedTime = (createdAt: string) => {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const diffInSeconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} segundos atrás`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutos atrás`;
  return `${Math.floor(diffInSeconds / 3600)} horas atrás`;
};

const getCardColor = (status: Order['status']) => {
  const colors: Record<Order['status'], string> = {
    Pendente: 'bg-white',
    Preparo: 'bg-yellow-50',
    Entrega: 'bg-blue-50',
    Entregue: 'bg-green-50',
    Cancelado: 'bg-red-50',
  };
  return colors[status];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await getOrders();
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(orders);
    };
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, newStatus: Order['status']) => {
    await updateOrderStatus(orderId, newStatus);
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestão de Pedidos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {orders.map((order) => (
          <Card key={order.orderId} className={`${getCardColor(order.status)} transition-colors duration-200 flex flex-col h-full`}>
            <CardHeader>
              <CardTitle className='flex justify-between'>
                Pedido #{order.orderId}
                <Button className="flex items-center" onClick={() => console.log('Imprimir pedido')}>
                  <Printer size={16} />
                </Button>
              </CardTitle>
              <p className="text-sm text-gray-500">Criado há: {getElapsedTime(order.createdAt)}</p>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-2">
                <p>Cliente: {order.name}</p>
                <p>Email: {order.email}</p>
                <p>Endereço: {order.address}</p>
                <p>Total: R$ {order.totalValue.toFixed(2)}</p>
                <p>Itens:</p>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>{item.quantity}x {item.name} - R$ {item.price.toFixed(2)}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <div className="p-4 flex items-center space-x-2 border-t mt-auto">
              {order.status === 'Pendente' && (
                <>
                  <Button onClick={() => updateStatus(order.orderId, 'Preparo')} className="bg-green-500 hover:bg-green-600 text-white">
                    <CheckCircle size={16} className="mr-2" /> Aceitar
                  </Button>
                  <Button onClick={() => updateStatus(order.orderId, 'Cancelado')} className="bg-red-500 hover:bg-red-600 text-white">
                    <XCircle size={16} className="mr-2" /> Negar
                  </Button>
                </>
              )}
              {order.status === 'Preparo' && (
                <Button onClick={() => updateStatus(order.orderId, 'Entrega')} className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Truck size={16} className="mr-2" /> Despachar
                </Button>
              )}
              {order.status === 'Entrega' && (
                <Button onClick={() => updateStatus(order.orderId, 'Entregue')} className="bg-green-500 hover:bg-green-600 text-white">
                  <PackageCheck size={16} className="mr-2" /> Entregue
                </Button>
              )}
              {(order.status === 'Preparo' || order.status === 'Entrega') && (
                <Button onClick={() => updateStatus(order.orderId, 'Cancelado')} className="bg-red-500 hover:bg-red-600 text-white">
                  <XCircle size={16} className="mr-2" /> Cancelar
                </Button>
              )}
              <Button onClick={() => console.log('Entrar em contato com', order.contactNumber)} className="bg-gray-500 hover:bg-gray-600 text-white">
                <Phone size={16} className="mr-2" /> Contato
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
