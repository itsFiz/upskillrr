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
    <Card className="bg-white/40 backdrop-blur-md shadow-lg border border-white/20 hover:border-purple-300/50 transition-all duration-300">
      <CardContent className="p-4 text-center">
        <Avatar className="w-20 h-20 mx-auto ring-4 ring-white/30">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h3 className="text-lg font-bold text-gray-900 mt-3">{user.name}</h3>
        <p className="text-sm text-gray-600 mb-3">XP: {user.xp}</p>
        
        <div className="flex flex-wrap gap-1 justify-center mb-4">
          {user.skills.slice(0, 3).map((skill) => (
            <Badge key={skill.id} variant="secondary" className="font-normal">{skill.name}</Badge>
          ))}
        </div>

        {showBookButton && onBookSession && (
          <Button onClick={() => onBookSession(user.id)} className="w-full mt-2" size="sm">
            Book Session
          </Button>
        )}
      </CardContent>
    </Card>
  )
}