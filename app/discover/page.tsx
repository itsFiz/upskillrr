'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserProfileCard } from '@/components/user-profile-card'
import { ArrowRight, Compass, TrendingUp, Users, Zap } from 'lucide-react'
import Link from 'next/link'
import { PageWrapper } from '@/components/page-wrapper'

interface Mentor {
  id: string;
  name: string;
  bio?: string;
  xp: number;
  avatarUrl?: string;
  skills: Array<{ id: string; name: string; category: string; level: string; }>;
  rating?: number;
  sessionsCompleted?: number;
}

interface TrendingSkill {
  id: string;
  name: string;
  _count: {
    userSkills: number;
  };
}

interface RecentSession {
  id: string;
  skill: { name: string; };
  teacher: { name: string; avatarUrl?: string; };
  learner: { name: string; avatarUrl?: string; };
}

interface DiscoverData {
  topMentors: Mentor[];
  trendingSkills: TrendingSkill[];
  recentSessions: RecentSession[];
}

export default function DiscoverPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [discoverData, setDiscoverData] = useState<DiscoverData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDiscoverData()
  }, [])

  const fetchDiscoverData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/discover')
      if (response.ok) {
        const data = await response.json()
        setDiscoverData(data)
      }
    } catch (error) {
      console.error('Error fetching discover data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleBookSession = (userId: string) => {
    // Redirect to user's profile or open booking modal
    router.push(`/profile/${userId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <PageWrapper>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Discover</h1>
        <p className="text-lg text-gray-600">
          Explore trending skills and top mentors in the community.
        </p>
      </div>

      {/* Top Mentors Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Mentors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {discoverData?.topMentors.map((user) => (
            <UserProfileCard
              key={user.id}
              user={user}
              onBookSession={() => router.push(`/profile/${user.name}`)}
              showBookButton={true}
            />
          ))}
        </div>
      </div>
      
      {/* Trending Skills & Activity Feed */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Trending Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {discoverData?.trendingSkills.map((skill) => (
              <Card key={skill.id} className="p-4 flex items-center space-x-3 bg-white/40 backdrop-blur-md shadow-lg border border-white/20 hover:border-purple-300 transition-colors">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{skill.name}</p>
                  <p className="text-sm text-gray-600">{skill._count.userSkills} mentors</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {discoverData?.recentSessions.map((session) => (
              <Card key={session.id} className="p-3 bg-white/40 backdrop-blur-md shadow-lg border border-white/20">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={session.learner.avatarUrl} />
                    <AvatarFallback>{session.learner.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">{session.learner.name}</span> learned <span className="font-semibold">{session.skill.name}</span>
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
} 