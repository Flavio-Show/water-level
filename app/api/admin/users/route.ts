import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
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

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse('Não autorizado', { status: 401 });
    }

    const isAdmin = await checkAdmin(session);
    if (!isAdmin) {
      return new NextResponse('Acesso negado', { status: 403 });
    }

    const { name, email, password, isAdmin: newUserIsAdmin } = await request.json();

    if (!name || !email || !password) {
      return new NextResponse('Dados incompletos', { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse('Email já cadastrado', { status: 400 });
    }

    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: newUserIsAdmin,
      },
    });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.role,
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
} 