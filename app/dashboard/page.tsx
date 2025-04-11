'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SystemCard, { System } from '@/components/SystemCard';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';



export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    async function fetchSystems() {
      try {
        const response = await fetch('/api/system');
        if (!response.ok) {
          throw new Error('Falha ao carregar sistemas');
        }
        const data = await response.json();
        setSystems(data.systems || []);
      } catch (err) {
        console.error('Erro ao carregar sistemas:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido ao carregar sistemas');
      } finally {
        setLoading(false);
      }
    }

    fetchSystems();
  }, [session, status, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Tentar Novamente
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Meus Sistemas</h1>
      {systems.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Nenhum sistema encontrado. Crie um novo sistema para começar.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systems.map((system) => (
            <SystemCard key={system.id} system={system as System} />
          ))}
        </div>
      )}
    </div>
  );
} 