'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/Navbar';

export default   function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    // Verificar se o usuário é admin
    const checkAdminStatus = async () => {
      try {
        const response = await fetch('/api/admin/check-admin');
        if (!response.ok) {
          router.push('/');
          return;
        }
      } catch (error) {
        console.error('Erro ao verificar status de admin:', error);
        router.push('/');
      }
    };

    checkAdminStatus();
  }, [session, status, router]);

  const handleUserCreated = () => {
    // Atualizar a lista de usuários se necessário
  };

  if (status === 'loading') {
    return <div>Carregando...</div>;
  }

  return (
    <div  className="min-h-screen flex flex-col">
      
      <div className="flex h-screen">
        <Sidebar 
          onUserCreated={handleUserCreated} 
          isOpen={isSidebarOpen} 
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          session={session}
        />
        <main className={`w-9/12  ${isSidebarOpen ? 'mx-auto' : 'ml-0'}`}>
          {children}
        </main>
      </div>
    </div>
  );
} 