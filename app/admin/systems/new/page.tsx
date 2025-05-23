'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function NewSystemPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    pointName: '',
    level: 0,
    hourly: '',
    CriticalLevel: false,
    LowLevel: false,
    userId: '',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users');
        if (!response.ok) {
          throw new Error('Erro ao carregar usuários');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Erro:', error);
        setError('Erro ao carregar usuários');
      }
    };

    fetchUsers();
  }, []);

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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar sistema');
      }

      router.push('/admin/systems');
    } catch (error) {
      console.error('Erro ao criar:', error);
      setError(error instanceof Error ? error.message : 'Erro ao criar sistema');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Criar Novo Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
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
                  onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hourly">Horário</Label>
                <Input
                  id="hourly"
                  value={formData.hourly}
                  onChange={(e) => setFormData({ ...formData, hourly: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userId">Usuário Responsável</Label>
                <Select
                  value={formData.userId}
                  onValueChange={(value) => setFormData({ ...formData, userId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="CriticalLevel"
                  checked={formData.CriticalLevel}
                  onChange={(e) => setFormData({ ...formData, CriticalLevel: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="CriticalLevel">Nível Crítico</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="LowLevel"
                  checked={formData.LowLevel}
                  onChange={(e) => setFormData({ ...formData, LowLevel: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="LowLevel">Nível Baixo</Label>
              </div>

              <div className="flex justify-end space-x-2">
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
    </div>
  );
} 