import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { startOfWeek, endOfWeek } from 'date-fns'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

  let weeklyGoal = await prisma.weeklyGoal.findUnique({
    where: { userId_weekStartDate: { userId: session.user.id, weekStartDate: weekStart } },
  });

  if (!weeklyGoal) {
    weeklyGoal = { id: '', userId: session.user.id, sessions: 1, weekStartDate: weekStart, createdAt: new Date(), updatedAt: new Date() };
  }
  
  const sessionsThisWeek = await prisma.session.count({
    where: {
      learnerId: session.user.id,
      status: 'COMPLETED',
      updatedAt: {
        gte: weekStart,
        lte: endOfWeek(new Date(), { weekStartsOn: 1 })
      }
    }
  })

  return NextResponse.json({ ...weeklyGoal, completed: sessionsThisWeek });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { sessions } = await request.json();
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

  const updatedGoal = await prisma.weeklyGoal.upsert({
    where: { userId_weekStartDate: { userId: session.user.id, weekStartDate: weekStart } },
    update: { sessions },
    create: { userId: session.user.id, weekStartDate: weekStart, sessions },
  });

  return NextResponse.json(updatedGoal);
} 