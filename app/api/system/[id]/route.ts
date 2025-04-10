import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Update system record
    const system = await prisma.system.update({
      where: {
        id: parseInt(params.id),
        userId: user.id
      },
      data: {
        pointName,
        level,
        hourly,
        CriticalLevel,
        LowLevel
      }
    });

    return NextResponse.json(system);
  } catch (error) {
    console.error('Error updating system:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 