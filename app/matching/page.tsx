'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserProfileCard } from '@/components/user-profile-card'
import { Search, Filter, Users, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

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
  const [bookingDate, setBookingDate] = useState('')
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
    if (!selectedUser || !bookingDate) return

    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: selectedUser.id,
          date: bookingDate,
          message: bookingMessage
        })
      })

      if (response.ok) {
        setIsBookingOpen(false)
        setSelectedUser(null)
        setBookingDate('')
        setBookingMessage('')
        // Show success message
        alert('Session booking request sent!')
      }
    } catch (error) {
      console.error('Error booking session:', error)
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
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Find Your Perfect Mentor
          </h1>
          <p className="text-gray-600">
            Discover skilled mentors who can help you learn and grow in your areas of interest.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-purple-600" />
              <span>Search & Filter</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name or skill..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="md:w-64">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
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
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-gray-600">
            <Users className="h-4 w-4" />
            <span>{filteredMatches.length} mentors found</span>
          </div>
        </div>

        {/* Mentor Grid */}
        {filteredMatches.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="py-16 text-center">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No mentors found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or add some learning goals to your profile.
              </p>
            </CardContent>
          </Card>
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
            <div className="space-y-4">
              <div>
                <Label htmlFor="booking-date">Preferred Date & Time</Label>
                <Input
                  id="booking-date"
                  type="datetime-local"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                />
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
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Send Request
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}