'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Home, Users, Plus, Menu, X, Settings, LogOut } from 'lucide-react';
import { Session } from 'next-auth';

interface SidebarProps {
  onUserCreated: () => void;
  isOpen: boolean;
  onToggle: () => void;
  session: Session | null;
}

export default function Sidebar({ onUserCreated, isOpen, onToggle, session }: SidebarProps) {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    isAdmin: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar usuário');
      }

      setNewUser({ name: '', email: '', password: '', isAdmin: false });
      setIsDrawerOpen(false);
      onUserCreated();
    } catch (error) {
      setError('Erro ao criar usuário');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Botão de toggle para telas pequenas */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={onToggle}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <div
        className={`fixed md:static h-full inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4">
            <div className="mb-6">
              <h2 className="text-xl font-bold">Área Administrativa</h2>
              <p className="text-sm text-gray-500 mt-1">
                {session?.user?.name || session?.user?.email}
              </p>
            </div>
            
            <nav className="space-y-2">
              <Link
                href="/admin"
                className={`flex items-center space-x-2 p-2 rounded-lg ${
                  pathname === '/admin' ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              
              <Link
                href="/admin/users"
                className={`flex items-center space-x-2 p-2 rounded-lg ${
                  pathname === '/admin/users' ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <Users className="w-5 h-5" />
                <span>Usuários</span>
              </Link>

              <Link
                href="/admin/systems"
                className={`flex items-center space-x-2 p-2 rounded-lg ${
                  pathname === '/admin/systems' ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Sistemas</span>
              </Link>
            </nav>
            <div className="mt-auto">
          
          <Link
            href="/api/auth/signout"
            className="flex items-center space-x-2 p-2 rounded-lg gap-2"
          >
            <LogOut size={20} />
            Sair
          </Link>
        </div>
          </div>

          {/* <div className="mt-auto p-4">
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Usuário
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Criar Novo Usuário</DrawerTitle>
                </DrawerHeader>
                <form onSubmit={handleCreateUser} className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isAdmin"
                      checked={newUser.isAdmin}
                      onChange={(e) => setNewUser({ ...newUser, isAdmin: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="isAdmin">Administrador</Label>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Criando...' : 'Criar Usuário'}
                  </Button>
                </form>
              </DrawerContent>
            </Drawer>
          </div> */}
          
        </div>
      </div>

      {/* Overlay para telas pequenas */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
} 