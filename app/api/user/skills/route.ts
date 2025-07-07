import { NextRequest, NextResponse } from 'next/server'
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
        skills: {
          include: {
            skill: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user.skills)
  } catch (error) {
    console.error('Error fetching user skills:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, category, type, level } = await request.json()

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Find or create the skill
    let skill = await prisma.skill.findUnique({
      where: { name }
    })

    if (!skill) {
      skill = await prisma.skill.create({
        data: { name, category }
      })
    }

    // Create user skill relationship
    const userSkill = await prisma.userSkill.create({
      data: {
        userId: user.id,
        skillId: skill.id,
        type,
        level
      },
      include: {
        skill: true
      }
    })

    return NextResponse.json(userSkill)
  } catch (error) {
    console.error('Error adding user skill:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { skillId } = await request.json()

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    await prisma.userSkill.delete({
      where: { id: skillId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing user skill:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}