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

export async function PUT(
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

    const { name, email, isAdmin: newIsAdmin } = await request.json();

    if (!name || !email) {
      return new NextResponse('Dados incompletos', { status: 400 });
    }

    const user = await prisma.user.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        email,
        role: newIsAdmin,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
}

export async function DELETE(
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

    await prisma.user.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse('Usuário deletado com sucesso', { status: 200 });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
} 