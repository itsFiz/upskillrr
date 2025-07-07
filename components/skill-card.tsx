'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, Lightbulb, Users, Star } from 'lucide-react'

interface SkillCardProps {
  skill: {
    id: string
    name: string
    category: string
    type: 'TEACH' | 'LEARN'
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  }
  onRemove?: (skillId: string) => void
  showActions?: boolean
}

export function SkillCard({ skill, onRemove, showActions = true }: SkillCardProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'bg-green-100 text-green-800'
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800'
      case 'ADVANCED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    return type === 'TEACH' ? Lightbulb : BookOpen
  }

  const getTypeColor = (type: string) => {
    return type === 'TEACH' 
      ? 'bg-purple-100 text-purple-800 border-purple-200' 
      : 'bg-blue-100 text-blue-800 border-blue-200'
  }

  const Icon = getTypeIcon(skill.type)

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-purple-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg">{skill.name}</CardTitle>
          </div>
          <Badge variant="outline" className={getTypeColor(skill.type)}>
            {skill.type === 'TEACH' ? 'Teaching' : 'Learning'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {skill.category}
          </Badge>
          <Badge variant="outline" className={getLevelColor(skill.level)}>
            {skill.level.toLowerCase()}
          </Badge>
        </div>
        
        {showActions && onRemove && (
          <div className="flex justify-end pt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onRemove(skill.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Remove
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}