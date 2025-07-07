'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, Award, Crown, Star, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PageWrapper } from '@/components/page-wrapper'

interface LeaderboardUser {
  id: string
  name: string
  xp: number
  avatarUrl?: string
  teachingSessions: number
  averageRating: number
  rank: number
}

export default function Leaderboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    
    if (session?.user?.email) {
      fetchLeaderboard()
    }
  }, [session, status, router])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/leaderboard')
      if (response.ok) {
        const data = await response.json()
        setLeaderboard(data.leaderboard)
        setCurrentUserRank(data.currentUserRank)
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Award className="h-6 w-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
    }
  }

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      const colors = {
        1: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
        2: 'bg-gradient-to-r from-gray-300 to-gray-500 text-white',
        3: 'bg-gradient-to-r from-amber-400 to-amber-600 text-white'
      }
      return colors[rank as keyof typeof colors]
    }
    return 'bg-gray-100 text-gray-700'
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Leaderboard</h1>
          <p className="text-lg text-gray-600">
            See how you rank among the top contributors and learners.
          </p>
        </div>

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-12 text-center">
            {/* 2nd Place */}
            <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-md shadow-lg border border-white/20 mt-8">
              <Avatar className="w-24 h-24 mx-auto ring-4 ring-gray-300">
                <AvatarImage src={leaderboard[1].avatarUrl} />
                <AvatarFallback>{leaderboard[1].name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="font-bold text-lg mt-3">{leaderboard[1].name}</h3>
              <p className="text-gray-600">{leaderboard[1].xp} XP</p>
              <div className="mt-2">{getRankIcon(2)}</div>
            </div>
            {/* 1st Place */}
            <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-md shadow-lg border border-white/20">
              <Avatar className="w-32 h-32 mx-auto ring-4 ring-yellow-400">
                <AvatarImage src={leaderboard[0].avatarUrl} />
                <AvatarFallback>{leaderboard[0].name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="font-bold text-xl mt-3">{leaderboard[0].name}</h3>
              <p className="text-gray-600">{leaderboard[0].xp} XP</p>
              <div className="mt-2">{getRankIcon(1)}</div>
            </div>
            {/* 3rd Place */}
            <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-md shadow-lg border border-white/20 mt-8">
              <Avatar className="w-24 h-24 mx-auto ring-4 ring-amber-500">
                <AvatarImage src={leaderboard[2].avatarUrl} />
                <AvatarFallback>{leaderboard[2].name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="font-bold text-lg mt-3">{leaderboard[2].name}</h3>
              <p className="text-gray-600">{leaderboard[2].xp} XP</p>
              <div className="mt-2">{getRankIcon(3)}</div>
            </div>
          </div>
        )}

        {/* User's Rank */}
        {currentUserRank && (
          <div className="mb-8">
            <Card className="p-4 bg-white/60 backdrop-blur-md shadow-lg border border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-xl font-bold text-purple-600">#{currentUserRank}</div>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={session?.user?.image || ''} />
                    <AvatarFallback>{session?.user?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">Your Rank</p>
                    <p className="text-sm text-gray-600">Keep it up!</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{leaderboard.find(u => u.id === session?.user?.id)?.xp || ''} XP</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="p-2 rounded-2xl bg-white/40 backdrop-blur-md shadow-lg border border-white/20">
          <div className="space-y-2">
            {leaderboard.map((user, index) => (
              <Card 
                key={user.id} 
                className={`p-3 transition-all ${
                  index < 3 ? 'bg-purple-100/50' : 'bg-white/50'
                } ${
                  session?.user?.id === user.id ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 text-center text-lg font-bold text-gray-500">{getRankIcon(user.rank)}</div>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <div className="flex items-center space-x-3 text-xs text-gray-600">
                      <span className="flex items-center space-x-1"><TrendingUp className="h-3 w-3" /><span>{user.teachingSessions} sessions</span></span>
                      {user.averageRating > 0 && <span className="flex items-center space-x-1"><Star className="h-3 w-3" /><span>{user.averageRating.toFixed(1)} rating</span></span>}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-base bg-purple-100 text-purple-700">{user.xp} XP</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}