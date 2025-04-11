import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';


export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new NextResponse('Não autorizado', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        role: true,
      },
    });

    if (!user || user.role !== 'ADMIN') {
      return new NextResponse('Acesso negado', { status: 403 });
    }

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Erro ao verificar admin:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
} 