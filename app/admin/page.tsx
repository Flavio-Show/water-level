'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SystemInfo {
  uptime: number;
  memoryUsage: {
    total: number;
    used: number;
    free: number;
  };
  cpuUsage: number;
}

export default  function AdminDashboard() {
  const { data: session, status } =  useSession();
  const router = useRouter();
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    const fetchSystemInfo = async () => {
      try {
        const response = await fetch('/api/system');
        if (!response.ok) {
          throw new Error('Erro ao carregar informações do sistema');
        }
        const data = await response.json();
        setSystemInfo(data);
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSystemInfo();
  }, [session, status, router]);

  if (status === 'loading' || isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-6 space-y-6 w-fullbg-blue-500">
      <h1 className="text-3xl font-bold">Dashboard Admin</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {systemInfo ? `${Math.floor(systemInfo.uptime / 3600)} horas` : '-'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uso de CPU</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {systemInfo ? `${systemInfo.cpuUsage.toFixed(1)}%` : '-'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uso de Memória</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {systemInfo ? `${((systemInfo.memoryUsage.used / systemInfo.memoryUsage.total) * 100).toFixed(1)}%` : '-'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Métrica</TableHead>
                <TableHead>Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Memória Total</TableCell>
                <TableCell>{systemInfo ? `${(systemInfo.memoryUsage.total / 1024 / 1024).toFixed(2)} GB` : '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Memória Usada</TableCell>
                <TableCell>{systemInfo ? `${(systemInfo.memoryUsage.used / 1024 / 1024).toFixed(2)} GB` : '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Memória Livre</TableCell>
                <TableCell>{systemInfo ? `${(systemInfo.memoryUsage.free / 1024 / 1024).toFixed(2)} GB` : '-'}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 