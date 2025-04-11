import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function HomeNavbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800">
              Water Level Monitor
            </Link>
          </div>
          <div className="flex items-center">
            <Link href="/login">
              <Button variant="default">
                Entrar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 