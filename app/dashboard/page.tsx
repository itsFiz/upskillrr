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
import { Plus, BookOpen, Users, Calendar, Trophy, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, Star, MessageCircle, MoreVertical } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PageWrapper } from '@/components/page-wrapper'
import Link from 'next/link'

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

interface Session {
  id: string
  date: string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  teacher?: { id: string; name: string; avatarUrl?: string }
  learner?: { id: string; name: string; avatarUrl?: string }
  skill: { id: string; name: string; category: string }
  testimonials: any[]
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
  const [sessions, setSessions] = useState<{
    teachingSessions: Session[]
    learningSessions: Session[]
  }>({
    teachingSessions: [],
    learningSessions: []
  })
  const [isAddingSkill, setIsAddingSkill] = useState(false)
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: '',
    type: 'TEACH' as 'TEACH' | 'LEARN',
    level: 'BEGINNER' as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  })
  const [isTestimonialOpen, setIsTestimonialOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [testimonial, setTestimonial] = useState({
    message: '',
    rating: 5
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    
    if (session?.user?.email) {
      fetchUserSkills()
      fetchUserStats()
      fetchSessions()
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

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/sessions')
      if (response.ok) {
        const data = await response.json()
        setSessions(data)
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
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

  const handleUpdateSession = async (sessionId: string, status: string) => {
    try {
      const response = await fetch('/api/sessions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, status })
      })

      if (response.ok) {
        fetchSessions()
        fetchUserStats() // Refresh stats in case XP was awarded
      }
    } catch (error) {
      console.error('Error updating session:', error)
    }
  }

  const handleOpenTestimonial = (session: Session) => {
    setSelectedSession(session)
    setIsTestimonialOpen(true)
  }

  const handleSubmitTestimonial = async () => {
    if (!selectedSession || !testimonial.message) return

    const toUserId = selectedSession.teacher?.id || selectedSession.learner?.id
    if (!toUserId) return

    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: selectedSession.id,
          toUserId,
          message: testimonial.message,
          rating: testimonial.rating
        })
      })

      if (response.ok) {
        setIsTestimonialOpen(false)
        setSelectedSession(null)
        setTestimonial({ message: '', rating: 5 })
        fetchSessions() // Refresh to show testimonial was left
        fetchUserStats() // Refresh stats in case XP was awarded
        alert('Testimonial submitted successfully!')
      } else {
        const errorData = await response.json()
        alert(`Failed to submit testimonial: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error submitting testimonial:', error)
      alert('Failed to submit testimonial. Please try again.')
    }
  }

  const getUpNextAction = () => {
    if (!sessions) return null;

    // 1. Check for pending teaching sessions
    const pendingRequest = sessions.teachingSessions.find(s => s.status === 'PENDING');
    if (pendingRequest && pendingRequest.learner) {
      return {
        type: 'PENDING_REQUEST',
        title: 'You have a new session request!',
        description: `${pendingRequest.learner.name} wants to learn ${pendingRequest.skill.name}.`,
        href: '#sessions'
      };
    }

    // 2. Check for upcoming confirmed sessions
    const upcomingSession = [...sessions.teachingSessions, ...sessions.learningSessions]
      .filter(s => s.status === 'CONFIRMED' && new Date(s.date) > new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
    
    if (upcomingSession && upcomingSession.teacher && upcomingSession.learner) {
      const otherUser = upcomingSession.teacher.id === session?.user?.id ? upcomingSession.learner : upcomingSession.teacher;
      return {
        type: 'UPCOMING_SESSION',
        title: 'Your next session is approaching!',
        description: `You have a session for ${upcomingSession.skill.name} with ${otherUser.name} on ${new Date(upcomingSession.date).toLocaleDateString()}.`,
        href: '#sessions'
      };
    }

    // 3. Check for completed sessions needing a review
    const sessionToReview = [...sessions.teachingSessions, ...sessions.learningSessions]
      .filter(s => s.status === 'COMPLETED' && s.testimonials.length === 0)[0];

    if (sessionToReview) {
      return {
        type: 'LEAVE_REVIEW',
        title: "How was your session?",
        description: `Leave a review for your recent ${sessionToReview.skill.name} session.`,
        action: () => handleOpenTestimonial(sessionToReview)
      };
    }

    return null;
  }

  const upNextAction = getUpNextAction();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
    <PageWrapper>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {session?.user?.name}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's your personal hub for learning and teaching.
        </p>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex mb-8 bg-white/60 backdrop-blur-md border border-white/20 shadow-sm">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">My Skills</TabsTrigger>
          <TabsTrigger value="sessions">My Sessions</TabsTrigger>
        </TabsList>

        {/* Glassmorphism background for all tab content */}
        <div className="p-6 rounded-2xl bg-white/40 backdrop-blur-md shadow-lg border border-white/20">
          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-0">
            {upNextAction && (
              <Card className="mb-6 bg-purple-50 border-purple-200">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{upNextAction.title}</h4>
                    <p className="text-sm text-gray-600">{upNextAction.description}</p>
                  </div>
                  {upNextAction.href ? (
                    <Link href={upNextAction.href}><Button>View</Button></Link>
                  ) : (
                    <Button onClick={upNextAction.action}>Leave Review</Button>
                  )}
                </CardContent>
              </Card>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-white/60">
                <p className="text-sm text-gray-600">Total XP</p>
                <p className="text-2xl font-bold">{stats.xp}</p>
              </div>
              <div className="p-4 rounded-lg bg-white/60">
                <p className="text-sm text-gray-600">Teaching</p>
                <p className="text-2xl font-bold">{stats.teachingSessions}</p>
              </div>
              <div className="p-4 rounded-lg bg-white/60">
                <p className="text-sm text-gray-600">Learning</p>
                <p className="text-2xl font-bold">{stats.learningSessions}</p>
              </div>
              <div className="p-4 rounded-lg bg-white/60">
                <p className="text-sm text-gray-600">Rating</p>
                <p className="text-2xl font-bold">{stats.averageRating.toFixed(1)} ★</p>
              </div>
            </div>
            <XPBar currentXP={stats.xp} />
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Sessions</h3>
              <div className="space-y-4">
                {[...sessions.teachingSessions, ...sessions.learningSessions]
                  .filter(s => s.status === 'CONFIRMED' && new Date(s.date) > new Date())
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(0, 3)
                  .map(session => (
                    <Card key={session.id}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={(session.teacher?.id !== session.id ? session.teacher?.avatarUrl : session.learner?.avatarUrl) || ''} />
                            <AvatarFallback>{(session.teacher?.id !== session.id ? session.teacher?.name?.[0] : session.learner?.name?.[0]) || 'U'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{session.skill.name} <span className="text-sm font-normal text-gray-500">with {session.teacher?.id !== session.id ? session.teacher?.name : session.learner?.name}</span></p>
                            <p className="text-sm text-gray-600">{new Date(session.date).toLocaleString()}</p>
                          </div>
                        </div>
                        <Badge variant="secondary">Confirmed</Badge>
                      </CardContent>
                    </Card>
                  ))
                }
                 {([...sessions.teachingSessions, ...sessions.learningSessions]
                  .filter(s => s.status === 'CONFIRMED' && new Date(s.date) > new Date()).length === 0) &&
                  <p className="text-gray-500 text-center py-4">No upcoming confirmed sessions.</p>
                }
              </div>
            </div>
          </TabsContent>
          
          {/* Skills Tab */}
          <TabsContent value="skills" className="mt-0">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Skills I Teach</h3>
                  <Dialog open={isAddingSkill && newSkill.type === 'TEACH'} onOpenChange={(open) => {
                    setIsAddingSkill(open)
                    if (open) setNewSkill(prev => ({ ...prev, type: 'TEACH' }))
                  }}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Skill
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Teaching Skill</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label htmlFor="skill-name">Skill Name</Label>
                          <Input id="skill-name" value={newSkill.name} onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g., React Development"/>
                        </div>
                        <div>
                          <Label htmlFor="skill-category">Category</Label>
                          <Input id="skill-category" value={newSkill.category} onChange={(e) => setNewSkill(prev => ({ ...prev, category: e.target.value }))} placeholder="e.g., Programming"/>
                        </div>
                        <div>
                          <Label htmlFor="skill-level">Your Level</Label>
                          <Select value={newSkill.level} onValueChange={(value: any) => setNewSkill(prev => ({ ...prev, level: value }))}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BEGINNER">Beginner</SelectItem>
                              <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                              <SelectItem value="ADVANCED">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={handleAddSkill} className="w-full">Add Skill</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="space-y-2">
                  {teachingSkills.length === 0 ? (
                    <div className="text-center text-gray-500 py-8 rounded-lg bg-white/60">
                      <p>No teaching skills yet.</p>
                    </div>
                  ) : (
                    teachingSkills.map((skill) => (
                      <SkillCard key={skill.id} skill={{ id: skill.id, name: skill.skill.name, category: skill.skill.category, type: skill.type, level: skill.level }} onRemove={handleRemoveSkill} />
                    ))
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Skills I Want to Learn</h3>
                  <Dialog open={isAddingSkill && newSkill.type === 'LEARN'} onOpenChange={(open) => {
                      setIsAddingSkill(open)
                      if (open) setNewSkill(prev => ({ ...prev, type: 'LEARN' }))
                  }}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Skill
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Learning Goal</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label htmlFor="learn-skill-name">Skill Name</Label>
                          <Input id="learn-skill-name" value={newSkill.name} onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g., Python Programming" />
                        </div>
                        <div>
                          <Label htmlFor="learn-skill-category">Category</Label>
                          <Input id="learn-skill-category" value={newSkill.category} onChange={(e) => setNewSkill(prev => ({ ...prev, category: e.target.value }))} placeholder="e.g., Programming" />
                        </div>
                        <div>
                          <Label htmlFor="learn-skill-level">Desired Level</Label>
                          <Select value={newSkill.level} onValueChange={(value: any) => setNewSkill(prev => ({ ...prev, level: value }))}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BEGINNER">Beginner</SelectItem>
                              <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                              <SelectItem value="ADVANCED">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={handleAddSkill} className="w-full">Add Learning Goal</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="space-y-2">
                  {learningSkills.length === 0 ? (
                    <div className="text-center text-gray-500 py-8 rounded-lg bg-white/60">
                      <p>No learning goals set yet.</p>
                    </div>
                  ) : (
                    learningSkills.map((skill) => (
                      <SkillCard key={skill.id} skill={{ id: skill.id, name: skill.skill.name, category: skill.skill.category, type: skill.type, level: skill.level }} onRemove={handleRemoveSkill} />
                    ))
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="mt-0">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Teaching Sessions</h3>
                <div className="space-y-3">
                  {sessions.teachingSessions.length === 0 ? (
                    <div className="text-center text-gray-500 py-8 rounded-lg bg-white/60">
                      <p>No teaching sessions yet.</p>
                    </div>
                  ) : (
                    sessions.teachingSessions.map((session) => (
                      <div key={session.id} className="p-3 rounded-lg bg-white/60">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={session.learner?.avatarUrl || ''} />
                              <AvatarFallback>{session.learner?.name?.[0] || 'L'}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{session.skill.name} with {session.learner?.name}</p>
                              <p className="text-sm text-gray-500">{new Date(session.date).toLocaleString()}</p>
                            </div>
                          </div>
                          <Badge variant={
                              session.status === 'COMPLETED' ? 'default' :
                              session.status === 'CONFIRMED' ? 'secondary' :
                              session.status === 'CANCELLED' ? 'destructive' : 'outline'
                            }>{session.status}</Badge>
                        </div>
                        <div className="mt-3 flex justify-end space-x-2">
                          {session.status === 'PENDING' && (
                            <>
                              <Button size="sm" onClick={() => handleUpdateSession(session.id, 'CONFIRMED')} className="bg-green-600 hover:bg-green-700 text-white">Confirm</Button>
                              <Button size="sm" variant="ghost" onClick={() => handleUpdateSession(session.id, 'CANCELLED')}>Cancel</Button>
                            </>
                          )}
                          {session.status === 'CONFIRMED' && (
                            <Button size="sm" onClick={() => handleUpdateSession(session.id, 'COMPLETED')}>Mark as Complete</Button>
                          )}
                          {session.status === 'COMPLETED' && session.testimonials.length === 0 && (
                            <Button size="sm" variant="outline" onClick={() => handleOpenTestimonial(session)}>Leave Review</Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Learning Sessions</h3>
                <div className="space-y-3">
                  {sessions.learningSessions.length === 0 ? (
                    <div className="text-center text-gray-500 py-8 rounded-lg bg-white/60">
                      <p>No learning sessions yet.</p>
                    </div>
                  ) : (
                    sessions.learningSessions.map((session) => (
                      <div key={session.id} className="p-3 rounded-lg bg-white/60">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={session.teacher?.avatarUrl || ''} />
                              <AvatarFallback>{session.teacher?.name?.[0] || 'T'}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{session.skill.name} with {session.teacher?.name}</p>
                              <p className="text-sm text-gray-500">{new Date(session.date).toLocaleString()}</p>
                            </div>
                          </div>
                          <Badge variant={
                              session.status === 'COMPLETED' ? 'default' :
                              session.status === 'CONFIRMED' ? 'secondary' :
                              session.status === 'CANCELLED' ? 'destructive' : 'outline'
                            }>{session.status}</Badge>
                        </div>
                        <div className="mt-3 flex justify-end space-x-2">
                          {session.status === 'PENDING' && (
                            <p className="text-sm text-orange-600">Awaiting confirmation</p>
                          )}
                          {session.status === 'CONFIRMED' && (
                            <Button size="sm" onClick={() => handleUpdateSession(session.id, 'COMPLETED')}>Mark as Complete</Button>
                          )}
                          {session.status === 'COMPLETED' && session.testimonials.length === 0 && (
                            <Button size="sm" variant="outline" onClick={() => handleOpenTestimonial(session)}>Leave Review</Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Testimonial Dialog */}
      <Dialog open={isTestimonialOpen} onOpenChange={setIsTestimonialOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Leave a Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rating">Rating</Label>
              <div className="flex space-x-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setTestimonial(prev => ({ ...prev, rating: star }))}
                    className={`p-1 rounded ${star <= testimonial.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                  >
                    <Star className="w-6 h-6 fill-current" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="testimonial-message">Your Review</Label>
              <Textarea
                id="testimonial-message"
                placeholder="Share your experience with this session..."
                value={testimonial.message}
                onChange={(e) => setTestimonial(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsTestimonialOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitTestimonial}
                disabled={!testimonial.message}
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Submit Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  )
}