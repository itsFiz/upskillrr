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

    // Get all users with their stats
    const users = await prisma.user.findMany({
      include: {
        teachingSessions: {
          where: { status: 'COMPLETED' }
        },
        receivedTestimonials: true
      },
      orderBy: { xp: 'desc' }
    })

    // Calculate leaderboard data
    const leaderboard = users.map((user, index) => {
      const averageRating = user.receivedTestimonials.length > 0
        ? user.receivedTestimonials.reduce((sum, t) => sum + t.rating, 0) / user.receivedTestimonials.length
        : 0

      return {
        id: user.id,
        name: user.name || 'Anonymous',
        xp: user.xp,
        avatarUrl: user.avatarUrl,
        teachingSessions: user.teachingSessions.length,
        averageRating,
        rank: index + 1
      }
    })

    // Find current user's rank
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    const currentUserRank = currentUser 
      ? leaderboard.findIndex(u => u.id === currentUser.id) + 1
      : null

    return NextResponse.json({
      leaderboard: leaderboard.slice(0, 50), // Top 50
      currentUserRank
    })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}