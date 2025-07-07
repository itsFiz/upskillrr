'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { XPBar } from '@/components/xp-bar'
import { Calendar as CalendarIcon, Star, Users, BookOpen, MessageCircle, Trophy } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { TimePicker } from '@/components/ui/time-picker'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { PageWrapper } from '@/components/page-wrapper'

interface UserProfile {
  id: string
  name: string
  bio?: string
  xp: number
  avatarUrl?: string
  teachingSkills: Array<{
    id: string
    skill: { name: string; category: string }
    level: string
  }>
  learningSkills: Array<{
    id: string
    skill: { name: string; category: string }
    level: string
  }>
  stats: {
    teachingSessions: number
    learningSessions: number
    averageRating: number
  }
}

interface Testimonial {
  id: string
  message: string
  rating: number
  createdAt: string
  fromUser: {
    id: string
    name: string
    avatarUrl?: string
  }
  session: {
    skill: {
      name: string
      category: string
    }
  }
}

interface ProfilePageProps {
  params: {
    username: string
  }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [bookingDate, setBookingDate] = useState<Date | undefined>(new Date())
  const [bookingTime, setBookingTime] = useState('12:00')
  const [bookingMessage, setBookingMessage] = useState('')

  useEffect(() => {
    fetchUserProfile()
  }, [params.username])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/profile/${params.username}`)
      if (response.ok) {
        const data = await response.json()
        setUserProfile(data.user)
        setTestimonials(data.testimonials)
      } else if (response.status === 404) {
        router.push('/404')
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookSession = () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }
    setIsBookingOpen(true)
  }

  const handleConfirmBooking = async () => {
    if (!userProfile || !bookingDate || !bookingTime) return

    const [hour, minute] = bookingTime.split(':').map(Number)
    const combinedDateTime = new Date(bookingDate)
    combinedDateTime.setHours(hour)
    combinedDateTime.setMinutes(minute)

    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: userProfile.id,
          date: combinedDateTime.toISOString(),
          message: bookingMessage,
          skillName: userProfile.teachingSkills[0]?.skill.name
        })
      })

      if (response.ok) {
        setIsBookingOpen(false)
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">User not found</h1>
          <p className="text-gray-600">The user you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const isOwnProfile = session?.user?.email === userProfile.name // Simplified check for now

  return (
    <PageWrapper>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (User Info) */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="p-6 bg-white/40 backdrop-blur-md shadow-lg border border-white/20 text-center">
            <Avatar className="w-32 h-32 mx-auto ring-4 ring-white/30">
              <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} />
              <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold text-gray-900 mt-4">{userProfile.name}</h1>
            <p className="text-gray-600">{userProfile.bio}</p>
            {!isOwnProfile && (
              <Button onClick={handleBookSession} className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white">Book Session</Button>
            )}
          </Card>
          
          <Card className="p-6 bg-white/40 backdrop-blur-md shadow-lg border border-white/20">
            <CardHeader className="p-0 mb-4"><CardTitle>Stats & Progress</CardTitle></CardHeader>
            <CardContent className="p-0 space-y-3">
              <XPBar currentXP={userProfile.xp} />
              <div className="text-sm space-y-1">
                <div className="flex justify-between"><span>Sessions Taught</span><span className="font-semibold">{userProfile.stats.teachingSessions}</span></div>
                <div className="flex justify-between"><span>Sessions Learned</span><span className="font-semibold">{userProfile.stats.learningSessions}</span></div>
                <div className="flex justify-between"><span>Average Rating</span><span className="font-semibold">{userProfile.stats.averageRating.toFixed(1)} ★</span></div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6 bg-white/40 backdrop-blur-md shadow-lg border border-white/20">
            <CardHeader className="p-0 mb-4"><CardTitle>Teaching Skills</CardTitle></CardHeader>
            <CardContent className="p-0 flex flex-wrap gap-2">
              {userProfile.teachingSkills.map((s) => <Badge key={s.id} variant="secondary">{s.skill.name}</Badge>)}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Reviews) */}
        <div className="lg:col-span-2">
          <Card className="p-6 bg-white/40 backdrop-blur-md shadow-lg border border-white/20">
            <CardHeader className="p-0 mb-4"><CardTitle>Latest Reviews</CardTitle></CardHeader>
            <CardContent className="p-0 space-y-4">
              {testimonials.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No reviews yet.</p>
              ) : (
                testimonials.slice(0, 5).map((testimonial) => (
                  <div key={testimonial.id} className="border-b border-white/20 pb-4 last:border-b-0">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={testimonial.fromUser.avatarUrl} />
                        <AvatarFallback>{testimonial.fromUser.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm">{testimonial.fromUser.name}</span>
                          <div className="flex items-center space-x-1">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{testimonial.message}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book a Session with {userProfile.name}</DialogTitle>
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
                className="flex-1 bg-purple-600 text-white hover:bg-purple-700"
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