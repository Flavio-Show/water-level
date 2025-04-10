'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface System {
  id: string;
  pointName: string;
  level: number;
  hourly: string;
  CriticalLevel: number;
  LowLevel: number;
  createdAt: string;
}

export default function SystemsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [systems, setSystems] = useState<System[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    fetchSystems();
  }, [session, status, router]);

  const fetchSystems = async () => {
    try {
      const response = await fetch('/api/admin/systems');
      if (!response.ok) {
        throw new Error('Erro ao carregar sistemas');
      }
      const data = await response.json();
      setSystems(data);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sistemas</h1>
        <Button onClick={() => router.push('/admin/systems/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Sistema
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ponto</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Nível Crítico</TableHead>
                <TableHead>Nível Baixo</TableHead>
                <TableHead>Data de Criação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {systems.map((system) => (
                <TableRow key={system.id}>
                  <TableCell>{system.pointName}</TableCell>
                  <TableCell>{system.level}</TableCell>
                  <TableCell>{system.hourly}</TableCell>
                  <TableCell>{system.CriticalLevel}</TableCell>
                  <TableCell>{system.LowLevel}</TableCell>
                  <TableCell>{new Date(system.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 