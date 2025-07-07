'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { XPBar } from '@/components/xp-bar'
import { SkillCard } from '@/components/skill-card'
import { Plus, BookOpen, Users, Calendar, Trophy, TrendingUp } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'

interface UserSkill {
  id: string
  skillId: string
  type: 'TEACH' | 'LEARN'
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  skill: {
    id: string
    name: string
    category: string
  }
}

interface UserStats {
  xp: number
  teachingSessions: number
  learningSessions: number
  averageRating: number
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [skills, setSkills] = useState<UserSkill[]>([])
  const [stats, setStats] = useState<UserStats>({
    xp: 0,
    teachingSessions: 0,
    learningSessions: 0,
    averageRating: 0
  })
  const [isAddingSkill, setIsAddingSkill] = useState(false)
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: '',
    type: 'TEACH' as 'TEACH' | 'LEARN',
    level: 'BEGINNER' as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    
    if (session?.user?.email) {
      fetchUserSkills()
      fetchUserStats()
    }
  }, [session, status, router])

  const fetchUserSkills = async () => {
    try {
      const response = await fetch('/api/user/skills')
      if (response.ok) {
        const data = await response.json()
        setSkills(data)
      }
    } catch (error) {
      console.error('Error fetching skills:', error)
    }
  }

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/user/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleAddSkill = async () => {
    if (!newSkill.name || !newSkill.category) return

    try {
      const response = await fetch('/api/user/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSkill)
      })

      if (response.ok) {
        fetchUserSkills()
        setNewSkill({ name: '', category: '', type: 'TEACH', level: 'BEGINNER' })
        setIsAddingSkill(false)
      }
    } catch (error) {
      console.error('Error adding skill:', error)
    }
  }

  const handleRemoveSkill = async (skillId: string) => {
    try {
      const response = await fetch('/api/user/skills', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillId })
      })

      if (response.ok) {
        fetchUserSkills()
      }
    } catch (error) {
      console.error('Error removing skill:', error)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const teachingSkills = skills.filter(s => s.type === 'TEACH')
  const learningSkills = skills.filter(s => s.type === 'LEARN')

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {session.user?.name}!
          </h1>
          <p className="text-gray-600">
            Track your progress, manage your skills, and continue your learning journey.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total XP</p>
                  <p className="text-3xl font-bold">{stats.xp}</p>
                </div>
                <Trophy className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Teaching Sessions</p>
                  <p className="text-3xl font-bold">{stats.teachingSessions}</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Learning Sessions</p>
                  <p className="text-3xl font-bold">{stats.learningSessions}</p>
                </div>
                <BookOpen className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">Average Rating</p>
                  <p className="text-3xl font-bold">{stats.averageRating.toFixed(1)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* XP Progress */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-purple-600" />
              <span>Your Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <XPBar currentXP={stats.xp} />
          </CardContent>
        </Card>

        {/* Skills Management */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Teaching Skills */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span>Skills I Teach</span>
                  <Badge variant="secondary">{teachingSkills.length}</Badge>
                </CardTitle>
                <Dialog open={isAddingSkill && newSkill.type === 'TEACH'} onOpenChange={(open) => {
                  setIsAddingSkill(open)
                  if (open) setNewSkill(prev => ({ ...prev, type: 'TEACH' }))
                }}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Skill
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Teaching Skill</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="skill-name">Skill Name</Label>
                        <Input
                          id="skill-name"
                          value={newSkill.name}
                          onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., React Development"
                        />
                      </div>
                      <div>
                        <Label htmlFor="skill-category">Category</Label>
                        <Input
                          id="skill-category"
                          value={newSkill.category}
                          onChange={(e) => setNewSkill(prev => ({ ...prev, category: e.target.value }))}
                          placeholder="e.g., Programming"
                        />
                      </div>
                      <div>
                        <Label htmlFor="skill-level">Your Level</Label>
                        <Select value={newSkill.level} onValueChange={(value: any) => setNewSkill(prev => ({ ...prev, level: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BEGINNER">Beginner</SelectItem>
                            <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                            <SelectItem value="ADVANCED">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleAddSkill} className="w-full">
                        Add Skill
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {teachingSkills.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No teaching skills added yet. Share your expertise!
                </p>
              ) : (
                teachingSkills.map((skill) => (
                  <SkillCard
                    key={skill.id}
                    skill={{
                      id: skill.id,
                      name: skill.skill.name,
                      category: skill.skill.category,
                      type: skill.type,
                      level: skill.level
                    }}
                    onRemove={handleRemoveSkill}
                  />
                ))
              )}
            </CardContent>
          </Card>

          {/* Learning Skills */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span>Skills I Want to Learn</span>
                  <Badge variant="secondary">{learningSkills.length}</Badge>
                </CardTitle>
                <Dialog open={isAddingSkill && newSkill.type === 'LEARN'} onOpenChange={(open) => {
                  setIsAddingSkill(open)
                  if (open) setNewSkill(prev => ({ ...prev, type: 'LEARN' }))
                }}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Skill
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Learning Goal</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="learn-skill-name">Skill Name</Label>
                        <Input
                          id="learn-skill-name"
                          value={newSkill.name}
                          onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Python Programming"
                        />
                      </div>
                      <div>
                        <Label htmlFor="learn-skill-category">Category</Label>
                        <Input
                          id="learn-skill-category"
                          value={newSkill.category}
                          onChange={(e) => setNewSkill(prev => ({ ...prev, category: e.target.value }))}
                          placeholder="e.g., Programming"
                        />
                      </div>
                      <div>
                        <Label htmlFor="learn-skill-level">Desired Level</Label>
                        <Select value={newSkill.level} onValueChange={(value: any) => setNewSkill(prev => ({ ...prev, level: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BEGINNER">Beginner</SelectItem>
                            <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                            <SelectItem value="ADVANCED">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleAddSkill} className="w-full">
                        Add Learning Goal
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {learningSkills.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No learning goals set yet. What would you like to learn?
                </p>
              ) : (
                learningSkills.map((skill) => (
                  <SkillCard
                    key={skill.id}
                    skill={{
                      id: skill.id,
                      name: skill.skill.name,
                      category: skill.skill.category,
                      type: skill.type,
                      level: skill.level
                    }}
                    onRemove={handleRemoveSkill}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}