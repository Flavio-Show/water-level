'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Bell, BellOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import WaterTank from './WaterTankAnime';

export interface System {
  id: string;
  pointName : string;
  hourly: string;
  level: number;
  isCritical: boolean;
  isLowLevel: boolean;
  userId: string;
  user: {
    name: string;
  };
}

interface SystemCardProps {
  system: System;
}

export default function SystemCard({ system }: SystemCardProps) {
  const router = useRouter();
  const [isMuted, setIsMuted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(system.level); // Nível inicial

  // Simula mudanças no nível da água


  return (
    <Card className="w-full ">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2 ">
        <CardTitle className="text-base w-full  font-medium">
         Sistema: {system.pointName}
        </CardTitle>
        <div className="flex items-center gap-2">
          {system.isCritical && (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? (
              <BellOff className="h-4 w-4" />
            ) : (
              <Bell className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center ">
        <div className="flex items-center ">
          <WaterTank level={currentLevel} />
          </div>
          <div className="space-x-2 flex flex-col pb-2">
            <p className="text-base text-muted-foreground">
             Horário: {system.hourly}
            </p>
            <p className="text-base text-muted-foreground">
             Nível: {system.level}%
            </p>
          </div>
         
          
        </div>
  
      </CardContent>
    </Card>
  );
} 