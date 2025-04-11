'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Bell, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';


interface UserSidebarProps {
  onClose?: () => void;
}

export default function UserSidebar({ onClose }: UserSidebarProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  console.log("dashboard",session);
  const routes = [
    {
      label: 'Início',
      icon: Home,
      href: '/dashboard',
      active: pathname === '/dashboard',
    },
    {
      label: 'Notificações',
      icon: Bell,
      href: '/notifications',
      active: pathname === '/notifications',
    },
    {
      label: 'Alterar Senha',
      icon: Settings,
      href: '/change-password',
      active: pathname === '/change-password',
    },
  ];

  return (
    <div  className="space-y-4 py-4 flex flex-col h-full text-white w-64">
      <div className="px-3 py-2 flex-1">
        <div className="flex items-center justify-between mb-14">
          <Link href="/dashboard" className="flex items-center pl-3">
            <h1 className="text-2xl font-bold">Water Level</h1>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition',
                route.active ? 'text-white bg-white/10' : 'text-zinc-400'
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn('h-5 w-5 mr-3', route.active ? 'text-white' : 'text-zinc-400')} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 