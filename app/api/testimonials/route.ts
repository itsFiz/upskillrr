import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/testimonials - Fetch testimonials for a user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get testimonials received by the user
    const testimonials = await prisma.testimonial.findMany({
      where: { toUserId: userId },
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
    })

    return NextResponse.json(testimonials)
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/testimonials - Create a new testimonial
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId, toUserId, message, rating } = await request.json()

    if (!sessionId || !toUserId || !message || !rating) {
      return NextResponse.json({ 
        error: 'Session ID, recipient, message, and rating are required' 
      }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ 
        error: 'Rating must be between 1 and 5' 
      }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify the session exists and user was part of it
    const sessionRecord = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { testimonials: true }
    })

    if (!sessionRecord) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Check if session is completed
    if (sessionRecord.status !== 'COMPLETED') {
      return NextResponse.json({ 
        error: 'Can only leave testimonials for completed sessions' 
      }, { status: 400 })
    }

    // Check if user was part of this session
    const userWasInSession = sessionRecord.teacherId === user.id || sessionRecord.learnerId === user.id
    if (!userWasInSession) {
      return NextResponse.json({ 
        error: 'You can only leave testimonials for sessions you participated in' 
      }, { status: 403 })
    }

    // Check if testimonial already exists from this user for this session
    const existingTestimonial = sessionRecord.testimonials.find(
      t => t.fromUserId === user.id
    )

    if (existingTestimonial) {
      return NextResponse.json({ 
        error: 'You have already left a testimonial for this session' 
      }, { status: 400 })
    }

    // Create the testimonial
    const testimonial = await prisma.testimonial.create({
      data: {
        sessionId,
        fromUserId: user.id,
        toUserId,
        message,
        rating
      },
      include: {
        fromUser: {
          select: { id: true, name: true, avatarUrl: true }
        },
        toUser: {
          select: { id: true, name: true, avatarUrl: true }
        },
        session: {
          include: {
            skill: {
              select: { name: true, category: true }
            }
          }
        }
      }
    })

    // Award bonus XP for 5-star ratings (as specified in PRD)
    if (rating === 5) {
      await prisma.user.update({
        where: { id: toUserId },
        data: { xp: { increment: 25 } }
      })
    }

    return NextResponse.json(testimonial, { status: 201 })
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 