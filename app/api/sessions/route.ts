import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendSessionConfirmationEmail, sendNewSessionRequestEmail, sendSessionCancellationEmail } from '@/lib/email'

// GET /api/sessions - Fetch user's sessions
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get both teaching and learning sessions
    const [teachingSessions, learningSessions] = await Promise.all([
      prisma.session.findMany({
        where: { teacherId: user.id },
        include: {
          learner: {
            select: { id: true, name: true, avatarUrl: true }
          },
          skill: {
            select: { id: true, name: true, category: true }
          },
          testimonials: true
        },
        orderBy: { date: 'desc' }
      }),
      prisma.session.findMany({
        where: { learnerId: user.id },
        include: {
          teacher: {
            select: { id: true, name: true, avatarUrl: true }
          },
          skill: {
            select: { id: true, name: true, category: true }
          },
          testimonials: true
        },
        orderBy: { date: 'desc' }
      })
    ])

    return NextResponse.json({
      teachingSessions,
      learningSessions
    })
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/sessions - Create new session booking
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { teacherId, date, message, skillName } = await request.json()

    if (!teacherId || !date) {
      return NextResponse.json({ error: 'Teacher ID and date are required' }, { status: 400 })
    }

    const learner = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!learner) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Prevent booking session with yourself
    if (learner.id === teacherId) {
      return NextResponse.json({ error: 'Cannot book session with yourself' }, { status: 400 })
    }

    // Find the skill being taught
    let skill
    if (skillName) {
      skill = await prisma.skill.findUnique({
        where: { name: skillName }
      })
    } else {
      // If no skill specified, find a common skill
      const teacherSkills = await prisma.userSkill.findMany({
        where: { 
          userId: teacherId, 
          type: 'TEACH' 
        },
        include: { skill: true }
      })
      
      const learnerSkills = await prisma.userSkill.findMany({
        where: { 
          userId: learner.id, 
          type: 'LEARN' 
        },
        include: { skill: true }
      })

      const commonSkill = teacherSkills.find(ts => 
        learnerSkills.some(ls => ls.skill.name === ts.skill.name)
      )

      skill = commonSkill?.skill
    }

    if (!skill) {
      return NextResponse.json({ error: 'No matching skill found' }, { status: 400 })
    }

    // Eagerly fetch the teacher's data for the email
    const teacher = await prisma.user.findUnique({
      where: { id: teacherId }
    })

    if (!teacher || !teacher.email) {
      return NextResponse.json({ error: 'Teacher not found or has no email.' }, { status: 404 })
    }

    // Create the session
    const newSession = await prisma.session.create({
      data: {
        teacherId,
        learnerId: learner.id,
        skillId: skill.id,
        date: new Date(date),
        status: 'PENDING'
      },
      include: {
        teacher: {
          select: { id: true, name: true, avatarUrl: true }
        },
        learner: {
          select: { id: true, name: true, avatarUrl: true }
        },
        skill: {
          select: { id: true, name: true, category: true }
        }
      }
    })

    // Send email notification to the teacher
    await sendNewSessionRequestEmail(
      teacher.email,
      teacher.name || 'there',
      learner.name || 'A user',
      skill.name,
      new Date(date),
      message
    )

    return NextResponse.json(newSession, { status: 201 })
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/sessions - Update session status
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId, status } = await request.json()

    if (!sessionId || !status) {
      return NextResponse.json({ error: 'Session ID and status are required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get the session to verify permissions and get related data
    const existingSession = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { 
        teacher: true, 
        learner: true,
        skill: true
      }
    })

    if (!existingSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Check if user has permission to update this session
    const isTeacher = existingSession.teacherId === user.id
    const isLearner = existingSession.learnerId === user.id

    if (!isTeacher && !isLearner) {
      return NextResponse.json({ error: 'Not authorized to update this session' }, { status: 403 })
    }

    // Update the session
    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: { status },
      include: {
        teacher: { select: { id: true, name: true, avatarUrl: true, email: true } },
        learner: { select: { id: true, name: true, avatarUrl: true, email: true } },
        skill: { select: { id: true, name: true, category: true } }
      }
    })

    // If session is confirmed, send email
    if (status === 'CONFIRMED' && existingSession.status !== 'CONFIRMED') {
      if (updatedSession.learner.email && updatedSession.teacher.name && updatedSession.learner.name && updatedSession.skill.name) {
        await sendSessionConfirmationEmail(
          updatedSession.learner.email,
          updatedSession.teacher.name,
          updatedSession.learner.name,
          updatedSession.skill.name,
          new Date(updatedSession.date)
        )
      } else {
        console.error('Missing data for confirmation email, skipping.')
      }
    }

    // If session is cancelled, send email to the other party
    if (status === 'CANCELLED' && existingSession.status !== 'CANCELLED') {
      const isCancelledByTeacher = existingSession.teacherId === user.id
      const recipient = isCancelledByTeacher ? existingSession.learner : existingSession.teacher
      const cancellerName = isCancelledByTeacher ? existingSession.teacher.name : existingSession.learner.name

      if (recipient.email && recipient.name && cancellerName && existingSession.skill.name) {
        await sendSessionCancellationEmail(
          recipient.email,
          recipient.name,
          cancellerName,
          existingSession.skill.name,
          new Date(existingSession.date)
        )
      } else {
        console.error('Missing data for cancellation email, skipping.')
      }
    }

    // If session is being completed, award XP
    if (status === 'COMPLETED' && existingSession.status !== 'COMPLETED') {
      await Promise.all([
        // Award XP to teacher (+100 XP)
        prisma.user.update({
          where: { id: existingSession.teacherId },
          data: { xp: { increment: 100 } }
        }),
        // Award XP to learner (+50 XP)
        prisma.user.update({
          where: { id: existingSession.learnerId },
          data: { xp: { increment: 50 } }
        })
      ])
    }

    return NextResponse.json(updatedSession)
  } catch (error) {
    console.error('Error updating session:', error)
    if (error instanceof Error && error.message.includes('Resend')) {
      return NextResponse.json({ error: 'Session updated, but failed to send email.' }, { status: 500 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 