'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserProfileCard } from '@/components/user-profile-card'
import { Search, Filter, Users, Calendar as CalendarIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { TimePicker } from '@/components/ui/time-picker'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { PageWrapper } from '@/components/page-wrapper'

interface MatchedUser {
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

export default function Matching() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [matches, setMatches] = useState<MatchedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [selectedUser, setSelectedUser] = useState<MatchedUser | null>(null)
  const [bookingDate, setBookingDate] = useState<Date | undefined>(new Date())
  const [bookingTime, setBookingTime] = useState('12:00')
  const [bookingMessage, setBookingMessage] = useState('')
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    
    if (session?.user?.email) {
      fetchMatches()
    }
  }, [session, status, router])

  const fetchMatches = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/matching')
      if (response.ok) {
        const data = await response.json()
        setMatches(data)
      }
    } catch (error) {
      console.error('Error fetching matches:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookSession = (userId: string) => {
    const user = matches.find(m => m.id === userId)
    if (user) {
      setSelectedUser(user)
      setIsBookingOpen(true)
    }
  }

  const handleConfirmBooking = async () => {
    if (!selectedUser || !bookingDate || !bookingTime) return

    const [hour, minute] = bookingTime.split(':').map(Number)
    const combinedDateTime = new Date(bookingDate)
    combinedDateTime.setHours(hour)
    combinedDateTime.setMinutes(minute)

    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: selectedUser.id,
          date: combinedDateTime.toISOString(),
          message: bookingMessage,
          skillName: selectedUser.skills[0]?.name // Use first matching skill
        })
      })

      if (response.ok) {
        setIsBookingOpen(false)
        setSelectedUser(null)
        setBookingDate(new Date())
        setBookingTime('12:00')
        setBookingMessage('')
        alert('Session booking request sent!')
      } else {
        const errorData = await response.json()
        alert(`Booking failed: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error booking session:', error)
      alert('Failed to book session. Please try again.')
    }
  }

  const filteredMatches = matches.filter(match => {
    const matchesSearch = match.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         match.skills.some(skill => skill.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = !categoryFilter || 
                           match.skills.some(skill => skill.category === categoryFilter)
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(matches.flatMap(m => m.skills.map(s => s.category))))

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
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Your Perfect Mentor</h1>
        <p className="text-lg text-gray-600">
          Discover skilled mentors ready to help you grow.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 p-4 rounded-2xl bg-white/40 backdrop-blur-md shadow-lg border border-white/20">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name or skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50"
              />
            </div>
          </div>
          <div className="md:w-64">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-white/50">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-gray-600">
          <Users className="h-4 w-4" />
          <span>{filteredMatches.length} mentors found</span>
        </div>
      </div>

      {/* Mentor Grid */}
      {filteredMatches.length === 0 ? (
        <div className="text-center py-16">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No mentors found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or add some learning goals to your profile.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((user) => (
            <UserProfileCard
              key={user.id}
              user={user}
              onBookSession={handleBookSession}
              showBookButton={true}
            />
          ))}
        </div>
      )}

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book a Session with {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !bookingDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {bookingDate ? format(bookingDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={bookingDate}
                    onSelect={setBookingDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <TimePicker value={bookingTime} onChange={setBookingTime} />
            </div>
            <div>
              <Label htmlFor="booking-message">Message (Optional)</Label>
              <Textarea
                id="booking-message"
                placeholder="Tell them what you'd like to learn..."
                value={bookingMessage}
                onChange={(e) => setBookingMessage(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsBookingOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmBooking}
                disabled={!bookingDate}
                className="flex-1"
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                Send Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  )
}