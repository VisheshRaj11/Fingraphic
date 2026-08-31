import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi } from 'lightweight-charts';

interface StockChartProps {
  ticker: string;
  currentPrice: number;
}

export const StockChart: React.FC<StockChartProps> = ({ ticker, currentPrice }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#64748b',
      },
      width: chartContainerRef.current.clientWidth,
      height: 280,
      grid: {
        vertLines: { color: '#f1f5f9' },
        horzLines: { color: '#f1f5f9' },
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
      },
    });

    chartRef.current = chart;

    const areaSeries = chart.addAreaSeries({
      topColor: 'rgba(37, 99, 235, 0.28)',
      bottomColor: 'rgba(37, 99, 235, 0.02)',
      lineColor: '#2563eb',
      lineWidth: 2,
    });

    // Generate realistic historical daily price series leading up to current price
    const now = new Date();
    const dataPoints = [];
    let price = currentPrice * 0.88;

    for (let i = 30; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      if (i === 0) {
        price = currentPrice;
      } else {
        const randomFactor = (Math.random() - 0.48) * 0.03;
        price = price * (1 + randomFactor);
      }

      dataPoints.push({
        time: dateStr,
        value: parseFloat(price.toFixed(2)),
      });
    }

    areaSeries.setData(dataPoints);
    chart.timeScale().fitContent();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [ticker, currentPrice]);

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3 px-2">
        <div>
          <h4 className="text-base font-bold text-slate-900">{ticker} Price Performance</h4>
          <p className="text-xs text-slate-500">TradingView Canvas Engine — 30 Day Trend</p>
        </div>
        <div className="text-right">
          <span className="text-lg font-black text-slate-900">${currentPrice}</span>
          <span className="block text-xs font-semibold text-emerald-600">Live Quote</span>
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
};
