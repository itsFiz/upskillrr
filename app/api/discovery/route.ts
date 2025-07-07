import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // 1. Get Top Mentors (by XP and rating)
    const topMentors = await prisma.user.findMany({
      where: {
        skills: {
          some: {
            type: 'TEACH'
          }
        }
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
      },
      orderBy: [
        { xp: 'desc' },
        { receivedTestimonials: { _count: 'desc' } }
      ],
      take: 10
    })

    const formattedMentors = topMentors.map(user => {
      const averageRating = user.receivedTestimonials.length > 0
        ? user.receivedTestimonials.reduce((sum, t) => sum + t.rating, 0) / user.receivedTestimonials.length
        : 0
      
      return {
        id: user.id,
        name: user.name || 'Anonymous',
        bio: user.bio,
        xp: user.xp,
        avatarUrl: user.avatarUrl,
        skills: user.skills.map(us => ({ ...us.skill, level: us.level })),
        rating: averageRating,
        sessionsCompleted: user.teachingSessions.length
      }
    })
    
    // 2. Get Trending Skills (by number of teachers)
    const trendingSkills = await prisma.skill.findMany({
      include: {
        _count: {
          select: {
            userSkills: {
              where: { type: 'TEACH' }
            }
          }
        }
      },
      orderBy: {
        userSkills: {
          _count: 'desc'
        }
      },
      take: 12
    })
    
    // 3. Get Recently Active Sessions (for activity feed)
    const recentSessions = await prisma.session.findMany({
      where: {
        status: 'COMPLETED'
      },
      include: {
        teacher: { select: { name: true, avatarUrl: true } },
        learner: { select: { name: true, avatarUrl: true } },
        skill: { select: { name: true } }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 5
    })

    // 4. Get Featured Mentors (a subset of top mentors for the homepage)
    const featuredMentors = formattedMentors.slice(0, 5);

    return NextResponse.json({
      topMentors: formattedMentors,
      trendingSkills,
      recentSessions,
      featuredMentors
    })
  } catch (error) {
    console.error('Error fetching discovery data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 