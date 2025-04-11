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
      role: true,
    },
  });

  return adminUser?.role === 'ADMIN' ? true : false;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse('Não autorizado', { status: 401 });
    }

    const isAdmin = await checkAdmin(session);
    if (!isAdmin) {
      return new NextResponse('Acesso negado', { status: 403 });
    }

    const systemId = Number(params.id);
    const system = await prisma.system.findUnique({
      where: {
        id: String(systemId)  ,
      },
    });

    if (!system) {
      return new NextResponse('Sistema não encontrado', { status: 404 });
    }

    return NextResponse.json(system);
  } catch (error) {
    console.error('Erro ao buscar sistema:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user || session.user.isAdmin === false) {
      return NextResponse.json(
        { error: 'Acesso não autorizado' },
        { status: 403 }
      );
    }

    const systemId = Number(params.id);
    const data = await request.json();

    if (!data.pointName || !data.level || !data.hourly || !data.userId) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    const updatedSystem = await prisma.system.update({
      where: {
        id: String(systemId),
      },
      data: {
        pointName: data.pointName,
        level: data.level,
        hourly: data.hourly,
        CriticalLevel: data.CriticalLevel,
        LowLevel: data.LowLevel,
        userId: data.userId,
      },
    });

    return NextResponse.json(updatedSystem);
  } catch (error) {
    console.error('Erro ao atualizar sistema:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar sistema' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user || session.user.isAdmin === false) {
      return NextResponse.json(
        { error: 'Acesso não autorizado' },
        { status: 403 }
      );
    }

    const systemId = Number(params.id);

    await prisma.system.delete({
      where: {
        id: String(systemId),
      },
    });

    return NextResponse.json({ message: 'Sistema excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir sistema:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir sistema' },
      { status: 500 }
    );
  }
} 