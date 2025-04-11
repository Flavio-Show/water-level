'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Menu, X, Home, Settings, Users, LogOut, AlertCircle } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [pathname]);

  // Se não houver sessão, não renderiza o navbar
  if (!session) {
    return null;
  }

  const isAdmin = session?.user?.isAdmin;
  

  // Menu items para administradores
  const adminMenuItems = [
    { href: '/admin/systems', label: 'Sistemas', icon: Settings },
    { href: '/admin/users', label: 'Usuários', icon: Users },
    { href: '/alerts', label: 'Alertas', icon: AlertCircle },
  ];

  // Menu items para usuários comuns
  const userMenuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/alerts', label: 'Alertas', icon: AlertCircle },
  ];

  // Seleciona os itens do menu baseado no papel do usuário
  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  return (
    <div style={{display:session?.user.isAdmin === true ? 'none' : '',width:session?.user.isAdmin ? '0%' : ''}}>
      {/* Botão do menu para mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 left-4 z-50 p-2 rounded-lg md:hidden ${
          theme === 'light' ? 'text-white' : 'text-gray-900'
        }`}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay para mobile */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu lateral */}
      <nav 
        className={`fixed top-0 left-0 h-full w-64 transition-transform duration-300 ease-in-out z-40 bg-gray-900
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
          ${theme === 'light' ? 'navbar-dark' : 'navbar-dark'}`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold text-white">
              Water Level
            </h1>
          </div>

          <div className="flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 p-3 rounded-lg mb-2 transition-colors nav-item text-white ${
                    isActive ? 'nav-item-active' : ''
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-auto">
            <div className="p-3 text-sm nav-item text-white">
              {session?.user?.name}
            </div>
            <Link
              href="/api/auth/signout"
              className="flex items-center gap-3 p-3 rounded-lg transition-colors nav-item text-white"
            >
              <LogOut size={20} />
              Sair
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
} 