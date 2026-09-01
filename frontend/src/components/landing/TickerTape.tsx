import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface TickerItem {
  name: string;
  change: number;
}

const tickerData: TickerItem[] = [
  { name: 'Microsoft', change: 0.28 },
  { name: 'Nvidia', change: -0.41 },
  { name: 'Tesla', change: 0.15 },
  { name: 'Meta', change: 1.05 },
  { name: 'Amazon', change: -0.22 },
  { name: 'Alphabet', change: 0.05 },
  { name: 'Netflix', change: 1.10 },
  { name: 'Apple', change: 1.04 },
];

export const TickerTape: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 w-full backdrop-blur-sm bg-white/40 border-t border-gray-200/60 py-3 overflow-hidden select-none">
      <div className="animate-marquee flex items-center gap-10">
        {[...tickerData, ...tickerData, ...tickerData].map((item, idx) => {
          const isPositive = item.change >= 0;
          const formattedChange = `${isPositive ? '+' : ''}${item.change.toFixed(2)}%`;

          return (
            <div key={idx} className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-medium text-gray-700">{item.name}</span>
              <div className={`flex items-center gap-0.5 text-xs font-bold ${isPositive ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                {isPositive ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                <span>{formattedChange}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
