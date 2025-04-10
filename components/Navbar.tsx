'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSession, signOut } from 'next-auth/react';
import { Menu } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900 hidden md:block">
              Water Level
            </Link>
            <Link href="/" className="text-xl font-bold text-gray-900 md:hidden mx-auto">
              WL
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-gray-700 hidden md:block">
                  {session.user?.name || session.user?.email}
                </span>
                <Button
                  variant="outline"
                  onClick={() => signOut()}
                >
                  Sair
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 