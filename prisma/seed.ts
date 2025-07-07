import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create test users
  const testUsers = [
    {
      email: 'alice@test.com',
      name: 'Alice Johnson',
      bio: 'Passionate about teaching programming and learning design',
      xp: 1250,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
    {
      email: 'bob@test.com',
      name: 'Bob Smith',
      bio: 'Experienced developer who loves mentoring beginners',
      xp: 2100,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    {
      email: 'carol@test.com',
      name: 'Carol Davis',
      bio: 'Design enthusiast and creative problem solver',
      xp: 800,
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
    {
      email: 'dave@test.com',
      name: 'Dave Wilson',
      bio: 'Full-stack developer with a passion for clean code',
      xp: 1800,
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
    {
      email: 'eve@test.com',
      name: 'Eve Brown',
      bio: 'UX/UI designer and accessibility advocate',
      xp: 950,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    },
  ]

  // Create skills
  const skills = [
    { name: 'JavaScript', category: 'Programming' },
    { name: 'React', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'TypeScript', category: 'Programming' },
    { name: 'UI/UX Design', category: 'Design' },
    { name: 'Python', category: 'Programming' },
    { name: 'SQL', category: 'Database' },
    { name: 'Git', category: 'Tools' },
    { name: 'Docker', category: 'DevOps' },
    { name: 'Graphic Design', category: 'Design' },
  ]

  console.log('📝 Creating skills...')
  for (const skillData of skills) {
    await prisma.skill.upsert({
      where: { name: skillData.name },
      update: {},
      create: skillData,
    })
  }

  console.log('👥 Creating test users...')
  for (const userData of testUsers) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    })
  }

  // Get created users and skills for relationships
  const users = await prisma.user.findMany()
  const createdSkills = await prisma.skill.findMany()

  console.log('🔗 Creating user skills...')
  
  // Alice - JavaScript teacher, React learner
  await prisma.userSkill.upsert({
    where: {
      userId_skillId_type: {
        userId: users.find(u => u.email === 'alice@test.com')!.id,
        skillId: createdSkills.find(s => s.name === 'JavaScript')!.id,
        type: 'TEACH'
      }
    },
    update: {},
    create: {
      userId: users.find(u => u.email === 'alice@test.com')!.id,
      skillId: createdSkills.find(s => s.name === 'JavaScript')!.id,
      type: 'TEACH',
      level: 'ADVANCED'
    }
  })

  await prisma.userSkill.upsert({
    where: {
      userId_skillId_type: {
        userId: users.find(u => u.email === 'alice@test.com')!.id,
        skillId: createdSkills.find(s => s.name === 'React')!.id,
        type: 'LEARN'
      }
    },
    update: {},
    create: {
      userId: users.find(u => u.email === 'alice@test.com')!.id,
      skillId: createdSkills.find(s => s.name === 'React')!.id,
      type: 'LEARN',
      level: 'BEGINNER'
    }
  })

  // Bob - React teacher, Node.js learner
  await prisma.userSkill.upsert({
    where: {
      userId_skillId_type: {
        userId: users.find(u => u.email === 'bob@test.com')!.id,
        skillId: createdSkills.find(s => s.name === 'React')!.id,
        type: 'TEACH'
      }
    },
    update: {},
    create: {
      userId: users.find(u => u.email === 'bob@test.com')!.id,
      skillId: createdSkills.find(s => s.name === 'React')!.id,
      type: 'TEACH',
      level: 'ADVANCED'
    }
  })

  await prisma.userSkill.upsert({
    where: {
      userId_skillId_type: {
        userId: users.find(u => u.email === 'bob@test.com')!.id,
        skillId: createdSkills.find(s => s.name === 'Node.js')!.id,
        type: 'LEARN'
      }
    },
    update: {},
    create: {
      userId: users.find(u => u.email === 'bob@test.com')!.id,
      skillId: createdSkills.find(s => s.name === 'Node.js')!.id,
      type: 'LEARN',
      level: 'INTERMEDIATE'
    }
  })

  // Carol - UI/UX Design teacher, JavaScript learner
  await prisma.userSkill.upsert({
    where: {
      userId_skillId_type: {
        userId: users.find(u => u.email === 'carol@test.com')!.id,
        skillId: createdSkills.find(s => s.name === 'UI/UX Design')!.id,
        type: 'TEACH'
      }
    },
    update: {},
    create: {
      userId: users.find(u => u.email === 'carol@test.com')!.id,
      skillId: createdSkills.find(s => s.name === 'UI/UX Design')!.id,
      type: 'TEACH',
      level: 'ADVANCED'
    }
  })

  await prisma.userSkill.upsert({
    where: {
      userId_skillId_type: {
        userId: users.find(u => u.email === 'carol@test.com')!.id,
        skillId: createdSkills.find(s => s.name === 'JavaScript')!.id,
        type: 'LEARN'
      }
    },
    update: {},
    create: {
      userId: users.find(u => u.email === 'carol@test.com')!.id,
      skillId: createdSkills.find(s => s.name === 'JavaScript')!.id,
      type: 'LEARN',
      level: 'BEGINNER'
    }
  })

  // Dave - Node.js teacher, UI/UX Design learner
  await prisma.userSkill.upsert({
    where: {
      userId_skillId_type: {
        userId: users.find(u => u.email === 'dave@test.com')!.id,
        skillId: createdSkills.find(s => s.name === 'Node.js')!.id,
        type: 'TEACH'
      }
    },
    update: {},
    create: {
      userId: users.find(u => u.email === 'dave@test.com')!.id,
      skillId: createdSkills.find(s => s.name === 'Node.js')!.id,
      type: 'TEACH',
      level: 'ADVANCED'
    }
  })

  await prisma.userSkill.upsert({
    where: {
      userId_skillId_type: {
        userId: users.find(u => u.email === 'dave@test.com')!.id,
        skillId: createdSkills.find(s => s.name === 'UI/UX Design')!.id,
        type: 'LEARN'
      }
    },
    update: {},
    create: {
      userId: users.find(u => u.email === 'dave@test.com')!.id,
      skillId: createdSkills.find(s => s.name === 'UI/UX Design')!.id,
      type: 'LEARN',
      level: 'BEGINNER'
    }
  })

  // Eve - Graphic Design teacher, TypeScript learner
  await prisma.userSkill.upsert({
    where: {
      userId_skillId_type: {
        userId: users.find(u => u.email === 'eve@test.com')!.id,
        skillId: createdSkills.find(s => s.name === 'Graphic Design')!.id,
        type: 'TEACH'
      }
    },
    update: {},
    create: {
      userId: users.find(u => u.email === 'eve@test.com')!.id,
      skillId: createdSkills.find(s => s.name === 'Graphic Design')!.id,
      type: 'TEACH',
      level: 'ADVANCED'
    }
  })

  await prisma.userSkill.upsert({
    where: {
      userId_skillId_type: {
        userId: users.find(u => u.email === 'eve@test.com')!.id,
        skillId: createdSkills.find(s => s.name === 'TypeScript')!.id,
        type: 'LEARN'
      }
    },
    update: {},
    create: {
      userId: users.find(u => u.email === 'eve@test.com')!.id,
      skillId: createdSkills.find(s => s.name === 'TypeScript')!.id,
      type: 'LEARN',
      level: 'INTERMEDIATE'
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log('\n📋 Test Users Created:')
  testUsers.forEach(user => {
    console.log(`  - ${user.name} (${user.email})`)
  })
  console.log('\n🔑 You can sign in with any of these email addresses using any password')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 