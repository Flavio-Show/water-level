import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import Navbar from "@/components/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Water Level - Monitoramento de Nível",
  description: "Sistema de monitoramento de nível de água",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen">
            {session?.user?.isAdmin ===false? <Navbar /> : null}
            <main className={`flex-1 ${session?.user?.isAdmin ===false ? 'md:ml-64' : ''} p-4`}>
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
