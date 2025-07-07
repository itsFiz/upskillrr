import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface ProfileParams {
  username: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: ProfileParams }
) {
  try {
    const { username } = params

    // Find user by name (treating username as display name)
    const user = await prisma.user.findFirst({
      where: { 
        name: {
          equals: username,
          mode: 'insensitive'
        }
      },
      include: {
        skills: {
          include: {
            skill: true
          }
        },
        teachingSessions: {
          where: { status: 'COMPLETED' }
        },
        learningSessions: {
          where: { status: 'COMPLETED' }
        },
        receivedTestimonials: {
          include: {
            fromUser: {
              select: { id: true, name: true, avatarUrl: true }
            },
            session: {
              include: {
                skill: {
                  select: { name: true, category: true }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate average rating
    const averageRating = user.receivedTestimonials.length > 0
      ? user.receivedTestimonials.reduce((sum, t) => sum + t.rating, 0) / user.receivedTestimonials.length
      : 0

    // Separate teaching and learning skills
    const teachingSkills = user.skills.filter(s => s.type === 'TEACH')
    const learningSkills = user.skills.filter(s => s.type === 'LEARN')

    // Format the response
    const profileData = {
      user: {
        id: user.id,
        name: user.name,
        bio: user.bio,
        xp: user.xp,
        avatarUrl: user.avatarUrl,
        teachingSkills,
        learningSkills,
        stats: {
          teachingSessions: user.teachingSessions.length,
          learningSessions: user.learningSessions.length,
          averageRating
        }
      },
      testimonials: user.receivedTestimonials
    }

    return NextResponse.json(profileData)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 