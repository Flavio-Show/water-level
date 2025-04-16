'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import Iridescence from '@/app/components/ui/backgrounds/Iridescence/Iridescence';

interface WaterTankProps {
  level: number;
  className?: string;
}

export default function WaterTank({ level, className }: WaterTankProps) {
  const waterRef = useRef<HTMLDivElement>(null);
console.log("level", level);
  useEffect(() => {
    if (waterRef.current) {
      const height = Math.min(Math.max(level, 0), 100);
      waterRef.current.style.height = `${height}%`;
    }
  }, [level]);

  return (
    <div className={cn("relative w-40 h-64 border-4 border-gray-300 rounded-lg overflow-hidden", className)}>
      {/* Água com animação de ondulação */}

      
      <div
        ref={waterRef}
        className="absolute bottom-0 left-0 right-0  transition-all duration-500 ease-in-out"
        style={{ height: '0%' }}
      >
<Iridescence color={[0.2,0.4,1]}/>
      </div>
      
      {/* Marcadores de nível */}
      <div className="absolute left-0 right-0 top-0 h-full flex flex-col justify-between">
        {[100, 75, 50, 25, 0].map((mark) => (
          <div key={mark} className="flex items-center">
            <div className="w-2 h-0.5 bg-gray-300" />
            <span className="text-xs text-gray-500 ml-1">{mark}%</span>
          </div>
        ))}
      </div>

      
      {/* Indicador visual do nível atual */}
      <div 
        className="absolute left-0 right-0 h-0.5  transition-all duration-500 ease-in-out"
        style={{ bottom: `${level}%` }}
      />
    </div>
  );
} 