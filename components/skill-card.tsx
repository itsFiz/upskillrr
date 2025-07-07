'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface SkillCardProps {
  skill: {
    id: string
    name: string
    category: string
    type: 'TEACH' | 'LEARN'
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  }
  onRemove?: (skillId: string) => void
}

export function SkillCard({ skill, onRemove }: SkillCardProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-white/60">
      <div>
        <p className="font-semibold">{skill.name}</p>
        <p className="text-sm text-gray-600">{skill.category} - <span className="capitalize">{skill.level.toLowerCase()}</span></p>
      </div>
      {onRemove && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onRemove(skill.id)}
          className="text-gray-500 hover:text-red-600 hover:bg-red-50 h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}