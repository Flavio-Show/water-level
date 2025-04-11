import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { cookies, headers } from 'next/headers'; // Importações necessárias

export async function GET() {
  try {
    // Obtenha headers e cookies de forma assíncrona
    const session = await getServerSession(authOptions);


    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Verifica se o campo 'role' realmente existe no seu Prisma
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        // Remova 'role' se ele não existir no seu schema
         role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        ...user,
        // Remova estas duas linhas se você removeu 'role'
        isAdmin: user.role === 'ADMIN',
        role: user.role === 'ADMIN' ? 'admin' : 'user',
      },
    });
  } catch (error) {
    console.error('Erro ao obter sessão:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
