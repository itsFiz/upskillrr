'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, Award, Crown, Star, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'

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
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />
      case 2: return <Medal className="h-6 w-6 text-gray-400" />
      case 3: return <Award className="h-6 w-6 text-amber-600" />
      default: return <span className="text-lg font-bold text-gray-600">#{rank}</span>
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
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🏆 Leaderboard
          </h1>
          <p className="text-gray-600">
            See how you rank among our top contributors and learners
          </p>
          {currentUserRank && (
            <div className="mt-4">
              <Badge variant="outline" className="text-lg px-4 py-2">
                Your Rank: #{currentUserRank}
              </Badge>
            </div>
          )}
        </div>

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="mb-12">
            <div className="flex justify-center items-end space-x-4 mb-8">
              {/* 2nd Place */}
              <div className="text-center">
                <div className="bg-gradient-to-br from-gray-300 to-gray-500 rounded-lg p-6 mb-4 h-32 flex flex-col justify-end">
                  <Avatar className="w-16 h-16 mx-auto mb-2 ring-4 ring-gray-300">
                    <AvatarImage src={leaderboard[1]?.avatarUrl} />
                    <AvatarFallback className="bg-gray-200">
                      {leaderboard[1]?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Medal className="h-6 w-6 mx-auto text-white" />
                </div>
                <h3 className="font-bold text-gray-900">{leaderboard[1]?.name}</h3>
                <p className="text-sm text-gray-600">{leaderboard[1]?.xp} XP</p>
              </div>

              {/* 1st Place */}
              <div className="text-center">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg p-6 mb-4 h-40 flex flex-col justify-end">
                  <Avatar className="w-20 h-20 mx-auto mb-2 ring-4 ring-yellow-300">
                    <AvatarImage src={leaderboard[0]?.avatarUrl} />
                    <AvatarFallback className="bg-yellow-200">
                      {leaderboard[0]?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Crown className="h-8 w-8 mx-auto text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{leaderboard[0]?.name}</h3>
                <p className="text-sm text-gray-600">{leaderboard[0]?.xp} XP</p>
              </div>

              {/* 3rd Place */}
              <div className="text-center">
                <div className="bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg p-6 mb-4 h-28 flex flex-col justify-end">
                  <Avatar className="w-14 h-14 mx-auto mb-2 ring-4 ring-amber-300">
                    <AvatarImage src={leaderboard[2]?.avatarUrl} />
                    <AvatarFallback className="bg-amber-200">
                      {leaderboard[2]?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Award className="h-5 w-5 mx-auto text-white" />
                </div>
                <h3 className="font-bold text-gray-900">{leaderboard[2]?.name}</h3>
                <p className="text-sm text-gray-600">{leaderboard[2]?.xp} XP</p>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-purple-600" />
              <span>Top Contributors</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {leaderboard.map((user, index) => (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                    session?.user?.email && user.name === session.user.name ? 'bg-purple-50 border-purple-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12">
                      {getRankIcon(user.rank)}
                    </div>
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>{user.teachingSessions} sessions</span>
                        </span>
                        {user.averageRating > 0 && (
                          <span className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{user.averageRating.toFixed(1)}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getRankBadge(user.rank)}>
                      {user.xp} XP
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {leaderboard.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="py-16 text-center">
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No rankings yet
              </h3>
              <p className="text-gray-600">
                Start teaching and learning to appear on the leaderboard!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}