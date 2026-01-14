'use client';

import React from 'react';
import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface AnalyticsAreaChartProps {
  title: string;
  data: Array<{ period: string; value: number }>;
  color?: string;
  height?: number;
  valueFormatter?: (value: number) => string;
}

export default function AnalyticsAreaChart({
  title,
  data,
  color = '#465FFF',
  height = 310,
  valueFormatter,
}: AnalyticsAreaChartProps) {
  const categories = data.map((item) => item.period);
  const values = data.map((item) => item.value);

  const options: ApexOptions = {
    legend: {
      show: false,
    },
    colors: [color],
    chart: {
      fontFamily: 'Outfit, sans-serif',
      height: height,
      type: 'area',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
    markers: {
      size: 0,
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      borderColor: '#e5e7eb',
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      theme: 'light',
      y: {
        formatter: (val: number) => {
          return valueFormatter
            ? valueFormatter(val)
            : new Intl.NumberFormat('en-US').format(val);
        },
      },
    },
    xaxis: {
      type: 'category',
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          fontSize: '12px',
          colors: '#6B7280',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          colors: ['#6B7280'],
        },
        formatter: (val: number) => {
          return valueFormatter
            ? valueFormatter(val)
            : new Intl.NumberFormat('en-US', {
                notation: 'compact',
                compactDisplay: 'short',
              }).format(val);
        },
      },
      title: {
        text: '',
      },
    },
  };

  const series = [
    {
      name: title,
      data: values,
    },
  ];

  return (
    <div className="custom-scrollbar max-w-full overflow-x-auto">
      <div className="min-w-[600px]">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={height}
        />
      </div>
    </div>
  );
}
