'use client'

import { useMemo } from 'react'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { groupBy, sum } from 'lodash'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Order } from '@/services/orderService'

interface ProductPerformanceProps {
  orders: Order[]
}

export default function ProductPerformance({ orders }: ProductPerformanceProps) {
  // Processa os dados para obter o desempenho dos produtos
  const productData = useMemo(() => {
    // Agrupa os itens por nome do produto
    const items = orders.flatMap(order => order.items)
    const grouped = groupBy(items, item => item.name)

    // Calcula o total vendido por produto
    const performance = Object.entries(grouped).map(([name, items]) => ({
      name,
      total: sum(items.map(item => item.price * item.quantity))
    }))

    // Ordena do mais vendido para o menos vendido
    return performance.sort((a, b) => b.total - a.total).slice(0, 10) // Top 10 produtos
  }, [orders])

  // Configurações do gráfico
  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `R$${val.toLocaleString()}`,
      offsetX: 0,
      style: {
        fontSize: '12px',
        colors: ['#1F2937']
      }
    },
    xaxis: {
      categories: productData.map(product => product.name),
      labels: {
        style: {
          colors: '#6B7280'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6B7280'
        }
      }
    },
    colors: ['#3b82f6'],
    tooltip: {
      y: {
        formatter: (val: number) => `R$${val.toLocaleString()}`
      }
    }
  }

  const chartSeries = [
    {
      name: 'Total Vendido',
      data: productData.map(product => product.total)
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Desempenho dos Produtos</CardTitle>
      </CardHeader>
      <CardContent>
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={350}
        />
      </CardContent>
    </Card>
  )
}