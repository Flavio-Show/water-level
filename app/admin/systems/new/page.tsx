'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function NewSystemPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    pointName: '',
    level: '',
    hourly: '',
    CriticalLevel: '',
    LowLevel: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/systems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar sistema');
      }

      router.push('/admin/systems');
    } catch (error) {
      setError('Erro ao criar sistema. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Novo Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pointName">Nome do Ponto</Label>
              <Input
                id="pointName"
                value={formData.pointName}
                onChange={(e) => setFormData({ ...formData, pointName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Nível</Label>
              <Input
                id="level"
                type="number"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hourly">Horário</Label>
              <Input
                id="hourly"
                type="time"
                value={formData.hourly}
                onChange={(e) => setFormData({ ...formData, hourly: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="CriticalLevel">Nível Crítico</Label>
              <Input
                id="CriticalLevel"
                type="number"
                value={formData.CriticalLevel}
                onChange={(e) => setFormData({ ...formData, CriticalLevel: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="LowLevel">Nível Baixo</Label>
              <Input
                id="LowLevel"
                type="number"
                value={formData.LowLevel}
                onChange={(e) => setFormData({ ...formData, LowLevel: e.target.value })}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/systems')}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Criando...' : 'Criar Sistema'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 