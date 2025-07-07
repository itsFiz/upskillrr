'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Calendar, MessageCircle } from 'lucide-react'
import { XPBar } from './xp-bar'

interface UserProfileCardProps {
  user: {
    id: string
    name: string
    bio?: string
    xp: number
    avatarUrl?: string
    skills: Array<{
      id: string
      name: string
      category: string
      level: string
    }>
    rating?: number
    sessionsCompleted?: number
  }
  onBookSession?: (userId: string) => void
  showBookButton?: boolean
}

export function UserProfileCard({ 
  user, 
  onBookSession, 
  showBookButton = true 
}: UserProfileCardProps) {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-4">
        <Avatar className="w-20 h-20 mx-auto mb-4 ring-4 ring-purple-100">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xl">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
        {user.bio && (
          <p className="text-sm text-gray-600 mt-2">{user.bio}</p>
        )}
        
        <div className="flex items-center justify-center space-x-4 mt-3 text-sm text-gray-500">
          {user.rating && (
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{user.rating.toFixed(1)}</span>
            </div>
          )}
          {user.sessionsCompleted && (
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{user.sessionsCompleted} sessions</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <XPBar currentXP={user.xp} />
        
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {user.skills.slice(0, 3).map((skill) => (
              <Badge 
                key={skill.id} 
                variant="secondary" 
                className="text-xs bg-purple-100 text-purple-700"
              >
                {skill.name}
              </Badge>
            ))}
            {user.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{user.skills.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {showBookButton && onBookSession && (
          <Button 
            onClick={() => onBookSession(user.id)}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book 30-min Session
          </Button>
        )}
      </CardContent>
    </Card>
  )
}