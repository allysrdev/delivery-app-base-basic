'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getOrders, Order, updateOrderStatus } from '@/services/orderService';
import { Printer } from 'lucide-react'; // Importa o ícone de impressora

// Função para calcular o tempo decorrido
const getElapsedTime = (createdAt: string) => {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const diffInSeconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} segundos atrás`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minuto${minutes > 1 ? 's' : ''} atrás`;
  } else {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hora${hours > 1 ? 's' : ''} atrás`;
  }
};

// Função para definir a cor do card com base no status
const getCardColor = (status: string) => {
  switch (status) {
    case 'Preparo':
      return 'bg-yellow-50';
    case 'Entrega':
      return 'bg-blue-50';
    case 'Entregue':
      return 'bg-green-50';
    case 'Cancelado':
      return 'bg-red-50';
    default:
      return 'bg-white';
  }
};

// Função para imprimir a comanda
const printOrder = (order: Order) => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; padding: 20px; background-color: #f9f9f9; }
            .header { text-align: center; }
            .header img { width: 80px; border-radius: 50%; }
            .header h2 { font-size: 22px; color: #333; margin-top: 10px; }
            .order-info { margin-top: 20px; color: #555; }
            .order-info p { margin: 5px 0; font-size: 14px; }
            .order-items { margin-top: 10px; }
            .order-items ul { list-style-type: none; padding: 0; }
            .order-items li { margin: 5px 0; font-size: 14px; }
            .footer { margin-top: 20px; text-align: center; color: #888; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="https://i.ibb.co/4ncYMPS6/logo-3.png" alt="Logo Borcelle Fast Food" />
            <h2>Comanda de Pedido</h2>
          </div>
          <div class="order-info">
            <p><strong>Pedido #${order.orderId}</strong></p>
            <p><strong>Cliente:</strong> ${order.name}</p>
            <p><strong>Email:</strong> ${order.email}</p>
            <p><strong>Endereço:</strong> ${order.address}</p>
            <p><strong>Total:</strong> R$ ${order.totalValue.toFixed(2)}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Criado há:</strong> ${getElapsedTime(order.createdAt)}</p>
          </div>
          <div class="order-items">
            <h3>Itens:</h3>
            <ul>
              ${order.items
                .map(
                  (item) =>
                    `<li>${item.quantity}x ${item.name} - R$ ${item.price.toFixed(2)}</li>`
                )
                .join('')}
            </ul>
          </div>
          <div class="footer">
            <p><strong>Borcelle Fast Food</strong></p>
            <p>Rua do Borcelle, 123 - FastFood</p>
            <p>Telefone: (11) 9 8888 7777</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<{ [orderId: string]: Order['status'] }>({});

  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await getOrders();
      // Ordena os pedidos pela data de criação (mais recente primeiro)
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(orders);
    };

    fetchOrders();
  }, []);

  // Atualiza o tempo decorrido a cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prevOrders) => [...prevOrders]); // Força a re-renderização
    }, 60000); // 60 segundos

    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId: string) => {
    const newStatus = selectedStatus[orderId];
    if (!newStatus) return;

    await updateOrderStatus(orderId, newStatus);

    const updatedOrders = orders.map((order) =>
      order.orderId === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);

    setSelectedStatus((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [orderId]: _, ...rest } = prev;
      return rest;
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestão de Pedidos</h1>
      <div className="space-y-4 max-w-full sm:min-w-lg flex sm:flex-row flex-col gap-4 flex-wrap">
        {orders.map((order) => (
          <Card
            key={order.orderId}
            className={`${getCardColor(order.status)} transition-colors duration-200`}
          >
            <CardHeader>
                    <CardTitle className='flex justify-between'>
                        Pedido #{order.orderId}
                            <Button
                        className="flex items-center space-x-2"
                        onClick={() => printOrder(order)}
                    >
                        <Printer size={16} />
                    </Button>
                    </CardTitle>
              <p className="text-sm text-gray-500">
                Criado há: {getElapsedTime(order.createdAt)}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>Cliente: {order.name}</p>
                <p>Email: {order.email}</p>
                <p>Endereço: {order.address}</p>
                <p>Total: R$ {order.totalValue.toFixed(2)}</p>
                <p>Itens:</p>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.quantity}x {item.name} - R$ {item.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap items-center space-x-2 gap-2">
                  <p>Status:</p>
                  <Select
                    value={selectedStatus[order.orderId] || order.status}
                    onValueChange={(value) =>
                      setSelectedStatus((prev) => ({
                        ...prev,
                        [order.orderId]: value as Order['status'],
                      }))
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                      <SelectItem value="Preparo">Preparo</SelectItem>
                      <SelectItem value="Entrega">Entrega</SelectItem>
                      <SelectItem value="Entregue">Entregue</SelectItem>
                      <SelectItem value="Cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => handleStatusChange(order.orderId)}
                    disabled={!selectedStatus[order.orderId] || selectedStatus[order.orderId] === order.status}
                  >
                    Atualizar Status
                  </Button>
                  
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
