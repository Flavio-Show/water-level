'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface WaterTankProps {
  level: number;
  className?: string;
}

export default function WaterTank({ level, className }: WaterTankProps) {
  const waterRef = useRef<HTMLDivElement>(null);

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
        className="absolute bottom-0 left-0 right-0 bg-blue-500 transition-all duration-500 ease-in-out"
        style={{ height: '0%' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-blue-600 opacity-80">
          {/* Ondulação */}
          <div 
            className="absolute inset-0 animate-wave"
            style={{
              backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAwIDEyMDAiPjxkZWZzPjxwYXRoIGlkPSJ3YXZlIiBkPSJNMCwwIGMwLDAgMjAwLDUwIDQwMCwwIDIwMCwtNTAgNDAwLDAgNDAwLDAgMCwwIDAsMTAwIDAsMTAwIC0xMjAwLDAgMCwtMTAwIDAsLTEwMHoiLz48L2RlZnM+PHVzZSB4bGluazpocmVmPSIjd2F2ZSIgeD0iMCIgeT0iMCIgZmlsbD0iIzAwMCIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+")',
              backgroundRepeat: 'repeat-x',
              backgroundSize: '400px 200px',
              backgroundPosition: 'bottom',
            }}
          />
        </div>
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

      {/* Indicador de nível atual e horário */}
      <div className="absolute -top-12 left-0 right-0 flex flex-col items-center gap-1">
        <div className="bg-white px-2 py-1 rounded text-xs font-bold shadow">
          {Math.round(level)}%
        </div>
        <div className="bg-white px-2 py-1 rounded text-xs font-bold shadow">
          {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Indicador visual do nível atual */}
      <div 
        className="absolute left-0 right-0 h-0.5 bg-red-500 transition-all duration-500 ease-in-out"
        style={{ bottom: `${level}%` }}
      />
    </div>
  );
} 