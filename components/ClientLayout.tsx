'use client';


import UserSidebar from "@/components/UserSidebar";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";


export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isAuthPage = pathname === '/auth/signin';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fechar o menu lateral quando a rota mudar
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (isAuthPage) {
    return <main className="flex">{children}</main>;
  }

  return (
    <div className="flex" >
      {/* Botão de toggle do menu em telas menores */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Overlay para telas menores */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden h-full" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Menu lateral */}
      <div
        className={`fixed md:static z-50 transform transition-transform duration-200 ease-in-out min-h-screen ${
          isSidebarOpen ? 'translate-x-0 h-full' : '-translate-x-full md:translate-x-0 min-h-screen '
        }`}
      >
        {session?.user.isAdmin && (
          <UserSidebar onClose={() => setIsSidebarOpen(false)} />
        )}
      </div>

      {/* Conteúdo principal */}
      <main
        className={`flex-1 p-6 transition-all duration-200 ${
           session ? 'md:ml-10 ' : ''
        }`}
      >
        {children}
      </main>
    </div>
  );
} 