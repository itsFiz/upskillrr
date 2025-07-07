'use client'

import { Home, Compass, User, Trophy, Plus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/discover', icon: Compass, label: 'Discover' },
  { href: '/matching', icon: Plus, label: 'Match', isCentral: true },
  { href: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export function Dock() {
  const pathname = usePathname()

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 md:hidden">
      <div className="bg-white/70 backdrop-blur-lg border-t border-gray-200">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            
            if (item.isCentral) {
              return (
                <Link key={item.href} href={item.href} className="-mt-8">
                  <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                    <item.icon className="w-8 h-8" />
                  </div>
                </Link>
              )
            }

            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center w-full">
                <item.icon className={cn('w-6 h-6 mb-1', isActive ? 'text-purple-600' : 'text-gray-500')} />
                <span className={cn('text-xs', isActive ? 'text-purple-600' : 'text-gray-500')}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
} 