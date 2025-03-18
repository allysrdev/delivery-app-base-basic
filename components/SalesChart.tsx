// components/SalesChart.tsx
'use client'

import { useMemo } from 'react'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { groupBy, sum } from 'lodash'
import { format, parseISO } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Order } from '@/services/orderService'

interface SalesChartProps {
  orders: Order[];
}

export default function SalesChart({ orders }: SalesChartProps) {
  const chartData = useMemo(() => {
    const grouped = groupBy(orders, order => 
      format(parseISO(order.createdAt), 'dd/MM/yyyy'))
    
    return {
      categories: Object.keys(grouped),
      series: [{
        name: 'Vendas',
        data: Object.values(grouped).map(orders => 
          sum(orders.map(o => o.totalValue + 10))
        )
      }]
    }
  }, [orders])

  const options: ApexOptions = {
    xaxis: { 
      categories: chartData.categories,
      labels: {
        style: {
          colors: '#6B7280'
        }
      }
    },
    colors: ['#3b82f6'],
    chart: { 
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
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    tooltip: {
      y: {
        formatter: (value: number) => `R$${value.toLocaleString()}`
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendas Diárias</CardTitle>
      </CardHeader>
      <CardContent>
        <Chart
          options={options}
          series={chartData.series}
          type="area"
          height={300}
        />
      </CardContent>
    </Card>
  )
}