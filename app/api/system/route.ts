import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

import os from 'os';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const systems = await prisma.system.findMany({
      where: {
        user: {
          email: session.user.email
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 30
    });

    const uptime = os.uptime();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;

    // Simulando uso de CPU (em produção você pode usar um pacote como node-os-utils)
    const cpuUsage = Math.random() * 100;

    return NextResponse.json({
      systems,
      uptime,
      memoryUsage: {
        total: totalMemory,
        used: usedMemory,
        free: freeMemory,
      },
      cpuUsage,
    });
  } catch (error) {
    console.error('Erro ao obter informações do sistema:', error);
    return NextResponse.json(
      { error: 'Erro ao obter informações do sistema' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { pointName, level, hourly, CriticalLevel, LowLevel } = body;

    // Get user ID from email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create new system record
    const system = await prisma.system.create({
      data: {
        pointName,
        level,
        hourly,
        CriticalLevel,
        LowLevel,
        userId: user.id
      }
    });

    // Get total count of records
    const count = await prisma.system.count({
      where: {
        userId: user.id
      }
    });

    // If more than 30 records, delete the oldest ones
    if (count > 30) {
      const oldestRecords = await prisma.system.findMany({
        where: {
          userId: user.id
        },
        orderBy: {
          createdAt: 'asc'
        },
        take: count - 30
      });

      await prisma.system.deleteMany({
        where: {
          id: {
            in: oldestRecords.map(record => record.id)
          }
        }
      });
    }

    return NextResponse.json(system);
  } catch (error) {
    console.error('Error creating system:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 