import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

async function checkAdmin(session: any) {
  if (!session?.user?.email) {
    return false;
  }

  const adminUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      isAdmin: true,
    },
  });

  return adminUser?.isAdmin || false;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse('Não autorizado', { status: 401 });
    }

    const isAdmin = await checkAdmin(session);
    if (!isAdmin) {
      return new NextResponse('Acesso negado', { status: 403 });
    }

    const systems = await prisma.system.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(systems);
  } catch (error) {
    console.error('Erro ao buscar sistemas:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse('Não autorizado', { status: 401 });
    }

    const isAdmin = await checkAdmin(session);
    if (!isAdmin) {
      return new NextResponse('Acesso negado', { status: 403 });
    }

    const { pointName, level, hourly, CriticalLevel, LowLevel } = await request.json();

    if (!pointName || !level || !hourly || !CriticalLevel || !LowLevel) {
      return new NextResponse('Dados incompletos', { status: 400 });
    }

    // Get user ID from session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return new NextResponse('Usuário não encontrado', { status: 404 });
    }

    const system = await prisma.system.create({
      data: {
        pointName,
        level: parseFloat(level),
        hourly,
        CriticalLevel: parseFloat(CriticalLevel) > 0,
        LowLevel: parseFloat(LowLevel) > 0,
        userId: user.id
      },
    });

    return NextResponse.json(system);
  } catch (error) {
    console.error('Erro ao criar sistema:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
} 