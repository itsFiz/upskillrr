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

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        skills: {
          where: { type: 'LEARN' },
          include: { skill: true }
        }
      }
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get skills the current user wants to learn
    const learningSkillNames = currentUser.skills.map(us => us.skill.name)

    if (learningSkillNames.length === 0) {
      return NextResponse.json([])
    }

    // Find users who can teach those skills
    const potentialMentors = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: currentUser.id } }, // Exclude current user
          {
            skills: {
              some: {
                type: 'TEACH',
                skill: {
                  name: { in: learningSkillNames }
                }
              }
            }
          }
        ]
      },
      include: {
        skills: {
          where: { type: 'TEACH' },
          include: { skill: true }
        },
        teachingSessions: {
          where: { status: 'COMPLETED' }
        },
        receivedTestimonials: true
      }
    })

    // Transform data for frontend
    const matches = potentialMentors.map(user => {
      const averageRating = user.receivedTestimonials.length > 0
        ? user.receivedTestimonials.reduce((sum, t) => sum + t.rating, 0) / user.receivedTestimonials.length
        : 0

      return {
        id: user.id,
        name: user.name || 'Anonymous',
        bio: user.bio,
        xp: user.xp,
        avatarUrl: user.avatarUrl,
        skills: user.skills.map(us => ({
          id: us.id,
          name: us.skill.name,
          category: us.skill.category,
          level: us.level
        })),
        rating: averageRating,
        sessionsCompleted: user.teachingSessions.length
      }
    })

    // Sort by XP and rating
    matches.sort((a, b) => {
      const scoreA = a.xp + (a.rating * 100)
      const scoreB = b.xp + (b.rating * 100)
      return scoreB - scoreA
    })

    return NextResponse.json(matches)
  } catch (error) {
    console.error('Error fetching matches:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}