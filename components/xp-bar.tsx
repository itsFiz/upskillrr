'use client'

import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Trophy, Star, Zap } from 'lucide-react'

interface XPBarProps {
  currentXP: number
  className?: string
}

export function XPBar({ currentXP, className = '' }: XPBarProps) {
  const getBadgeInfo = (xp: number) => {
    if (xp >= 1000) return { level: 'Expert', icon: Trophy, color: 'bg-yellow-500', nextLevel: 2000 }
    if (xp >= 500) return { level: 'Advanced', icon: Star, color: 'bg-purple-500', nextLevel: 1000 }
    if (xp >= 100) return { level: 'Intermediate', icon: Zap, color: 'bg-blue-500', nextLevel: 500 }
    return { level: 'Beginner', icon: Zap, color: 'bg-green-500', nextLevel: 100 }
  }

  const badgeInfo = getBadgeInfo(currentXP)
  const progress = (currentXP / badgeInfo.nextLevel) * 100
  const Icon = badgeInfo.icon

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className={`${badgeInfo.color} text-white`}>
            <Icon className="w-3 h-3 mr-1" />
            {badgeInfo.level}
          </Badge>
          <span className="text-sm font-medium text-gray-600">
            {currentXP} XP
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {badgeInfo.nextLevel - currentXP} XP to next level
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
}