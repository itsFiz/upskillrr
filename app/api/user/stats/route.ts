import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        teachingSessions: {
          where: { status: 'COMPLETED' }
        },
        learningSessions: {
          where: { status: 'COMPLETED' }
        },
        receivedTestimonials: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const averageRating = user.receivedTestimonials.length > 0
      ? user.receivedTestimonials.reduce((sum, t) => sum + t.rating, 0) / user.receivedTestimonials.length
      : 0

    const stats = {
      xp: user.xp,
      teachingSessions: user.teachingSessions.length,
      learningSessions: user.learningSessions.length,
      averageRating
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}