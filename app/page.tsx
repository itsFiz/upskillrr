'use client'

import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, Users, Trophy, Calendar, ArrowRight, Star, Zap } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const { data: session } = useSession()

  const features = [
    {
      icon: Users,
      title: 'Smart Matching',
      description: 'Get matched with the perfect mentor or student based on your skills and goals.',
      color: 'text-blue-600'
    },
    {
      icon: Calendar,
      title: 'Easy Booking',
      description: 'Schedule 30-minute sessions with just a few clicks. No hassle, just learning.',
      color: 'text-green-600'
    },
    {
      icon: Trophy,
      title: 'Gamified Learning',
      description: 'Earn XP, unlock badges, and climb the leaderboard as you teach and learn.',
      color: 'text-purple-600'
    },
    {
      icon: Star,
      title: 'Quality Assured',
      description: 'Rate and review sessions to maintain high-quality learning experiences.',
      color: 'text-yellow-600'
    }
  ]

  const stats = [
    { label: 'Active Learners', value: '2,500+', icon: Users },
    { label: 'Skills Available', value: '150+', icon: GraduationCap },
    { label: 'Sessions Completed', value: '10,000+', icon: Calendar },
    { label: 'Success Rate', value: '95%', icon: Trophy }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Learn. Teach.
              </span>
              <br />
              <span className="text-gray-900">Grow Together.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join the ultimate skill-sharing platform where knowledge flows freely. 
              Connect with mentors, share your expertise, and unlock your potential.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {session ? (
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-6">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-6">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-2">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Upskillrr?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We've built the most intuitive and effective platform for peer-to-peer learning.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-gray-50">
                      <feature.icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <CardContent className="py-16 px-8">
              <Zap className="h-16 w-16 mx-auto mb-6 text-yellow-300" />
              <h2 className="text-4xl font-bold mb-4">
                Ready to Start Your Learning Journey?
              </h2>
              <p className="text-xl mb-8 text-purple-100">
                Join thousands of learners and teachers already growing their skills on Upskillrr.
              </p>
              {!session && (
                <Link href="/auth/signin">
                  <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                    Join the Community
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}