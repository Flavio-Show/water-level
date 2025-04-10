import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function GET() {
  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@waterlevel.com' },
    });

    if (existingAdmin) {
      return NextResponse.json({
        message: 'Usuário administrador já existe',
        email: 'admin@waterlevel.com',
        password: 'admin123',
      });
    }

    const hashedPassword = await hash('admin123', 12);

    const adminUser = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@waterlevel.com',
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      message: 'Usuário administrador criado com sucesso',
      email: 'admin@waterlevel.com',
      password: 'admin123',
    });
  } catch (error) {
    console.error('Erro ao criar usuário administrador:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
} 