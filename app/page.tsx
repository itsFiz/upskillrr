'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, Users, Trophy, Calendar, ArrowRight, Star, Zap, CheckCircle, Code, Palette, Mic } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserProfileCard } from '@/components/user-profile-card'
import { MotionDiv, MotionH1, MotionP } from '@/components/motion'

interface Mentor {
  id: string;
  name: string;
  bio?: string;
  xp: number;
  avatarUrl?: string;
  skills: Array<{ id: string; name: string; category: string; level: string; }>;
  rating?: number;
  sessionsCompleted?: number;
}

interface HomeData {
  featuredMentors: Mentor[];
}

export default function Home() {
  const { data: session } = useSession()
  const [homeData, setHomeData] = useState<HomeData | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/discover'); // Re-using discovery endpoint
        if (response.ok) {
          const data = await response.json();
          setHomeData(data);
        }
      } catch (error) {
        console.error("Failed to fetch homepage data:", error);
      }
    }
    fetchData();
  }, []);

  const features = [
    {
      icon: Users,
      title: 'Smart Matching',
      description: 'Get matched with the perfect mentor or student based on your skills and goals.',
    },
    {
      icon: Calendar,
      title: 'Easy Booking',
      description: 'Schedule 30-minute sessions with just a few clicks. No hassle, just learning.',
    },
    {
      icon: Trophy,
      title: 'Gamified Learning',
      description: 'Earn XP, unlock badges, and climb the leaderboard as you teach and learn.',
    },
    {
      icon: Star,
      title: 'Quality Assured',
      description: 'Rate and review sessions to maintain high-quality learning experiences.',
    }
  ]

  const howItWorks = [
    {
      title: 'Declare Your Skills',
      description: 'List the skills you can teach and the ones you want to learn. Set your experience level for each.'
    },
    {
      title: 'Get Matched',
      description: 'Our algorithm connects you with users who have complementary skills and availability.'
    },
    {
      title: 'Book & Meet',
      description: 'Schedule a 30-minute video session to share knowledge, ask questions, and grow.'
    },
    {
      title: 'Earn & Grow',
      description: 'Gain XP, get ratings, and build your public profile with every completed session.'
    }
  ]
  
  const trendingSkills = [
    { name: 'TypeScript', icon: Code, color: 'text-blue-500' },
    { name: 'UI/UX Design', icon: Palette, color: 'text-purple-500' },
    { name: 'Public Speaking', icon: Mic, color: 'text-green-500' },
    { name: 'React', icon: Code, color: 'text-sky-500' },
  ]

  const testimonials = [
    { name: 'Alice', quote: "I learned more in a 30-minute session than I did in a 2-hour tutorial. Amazing!" },
    { name: 'Bob', quote: "Teaching on Upskillrr has been a fantastic way to solidify my own knowledge." },
    { name: 'Carol', quote: "The gamified approach makes learning feel less like a chore and more like a fun challenge." }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section with animation */}
      <section className="relative overflow-hidden py-24 px-4">
        <div className="absolute inset-0 -z-10 bg-white [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="relative max-w-5xl mx-auto text-center">
          <Badge className="mb-6 bg-purple-100 text-purple-700 hover:bg-purple-200 shadow-sm">
            Peer-Powered Learning is Here
          </Badge>
          <MotionH1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            The Ultimate <span className="bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 bg-clip-text text-transparent">Skill-Sharing</span> Platform
          </MotionH1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Connect with mentors, share your expertise, and unlock your potential. All through quick, gamified, 30-minute sessions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center my-10">
            {session ? (
              <Link href="/dashboard">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all">
                  Go to Your Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/auth/signin">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured Mentors Section with staggered animation */}
      <MotionDiv initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Mentors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {homeData?.featuredMentors.map(mentor => (
            <MotionDiv key={mentor.id} variants={cardVariants} whileHover={{ y: -5, scale: 1.03 }}>
              <UserProfileCard user={mentor} showBookButton={false} />
            </MotionDiv>
          ))}
        </div>
      </MotionDiv>

      {/* How It Works Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Four simple steps to start your learning journey with Upskillrr.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative p-8 rounded-2xl bg-white/40 backdrop-blur-md shadow-lg border border-white/20">
                <div className="absolute top-0 left-0 -mt-4 -ml-4 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold ring-8 ring-white/20">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-3 mt-4 text-gray-900">{step.title}</h3>
                <p className="text-gray-700">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why People Love Upskillrr</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 bg-white/40 backdrop-blur-md shadow-lg border border-white/20">
                <CardContent className="p-0">
                  <p className="italic text-gray-700">"{testimonial.quote}"</p>
                  <p className="font-semibold text-right mt-4">- {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 rounded-2xl bg-white/40 backdrop-blur-md shadow-lg border border-white/20">
                <div className="flex-shrink-0">
                  <div className="p-3 rounded-full bg-purple-100">
                    <feature.icon className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-700 mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative rounded-2xl p-12 overflow-hidden bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-2xl">
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-12 -right-0 w-48 h-48 bg-white/10 rounded-full"></div>
            <div className="relative">
              <Zap className="h-12 w-12 mx-auto mb-6 text-yellow-300" />
              <h2 className="text-3xl font-bold mb-4">
                Ready to Start Learning?
              </h2>
              <p className="text-lg mb-8 text-purple-100">
                Join thousands of learners and teachers already growing their skills.
              </p>
              {!session && (
                <Link href="/auth/signin">
                  <Button size="lg" className="text-lg px-8 py-6 bg-white text-purple-700 hover:bg-gray-100 shadow-md">
                    Join the Community
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}