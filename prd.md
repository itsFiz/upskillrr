🧾 Product Requirements Document (PRD)

🧠 Product Name: Upskillr

A peer-powered skill swap platform that connects people who want to learn with those who can teach — all through quick 30-minute sessions, XP rewards, and public profiles. Think: Bumble meets Calendly meets Duolingo XP.
1. 🎯 Product Goals

Objective	Description
Enable users to swap skills	Let users list skills they can teach/learn and get matched accordingly
Gamify growth through XP	Award XP and badges for completed sessions, ratings, and feedback loops
Simplify 1-on-1 coaching	Let users book 30-minute sessions seamlessly with basic scheduling
Build public learning profiles	Showcase user contributions, testimonials, and skill mastery
Prepare for B2B Guild integrations	Allow future pivot into private org use (e.g., "Upskillr for Teams")
2. 🧑‍💻 User Personas

🎓 Self-Improver Sarah
Wants to learn UI/UX
Comfortable with Zoom/Discord
Seeks short bursts of knowledge, not full courses
👨‍🏫 Tech Bro Amir
Can teach Laravel or TypeScript
Wants to gain reputation, XP, maybe clients
Enjoys mentoring but dislikes bureaucracy
🧑‍💼 HR Hanna (Phase 2)
Wants private Upskillr for internal staff
Interested in analytics, booking dashboard, and CareerRPG synergy
3. 🧩 Key Features (MVP)

🔐 Authentication
Clerk.dev or NextAuth
Email/password or social login (Google/GitHub)
📋 Skill Declaration
Add “I can teach...” skills
Add “I want to learn...” skills
Set experience level: Beginner, Intermediate, Expert
🤝 Matching Engine
Match users based on skill overlap and availability
Show mutual match profiles with “Book” CTA
📅 Session Booking
30-minute session format
Use Calendar embed (Calendly or custom modal)
Confirm, reschedule, cancel options
🧠 XP & Gamification
Gain XP for:
Hosting sessions
Completing sessions
Getting good ratings
Level-based badges (Bronze, Silver, Gold)
Weekly leaderboard
🧾 Testimonials & Ratings
After each session, allow rating (1–5) and short feedback
👤 Public Profiles
Bio, skills, XP level, badges, testimonials
“Book a session” button
🔍 Discovery Feed
Explore trending skills, top coaches, and new learners
Filter by category, experience level, or tag
4. 🛠️ Technical Requirements

Frontend
Next.js 15 App Router
TailwindCSS + shadcn/ui
PWA-ready layout
SEO for skill landing pages (e.g., /learn/figma)
Backend
NeonDB (PostgreSQL) via Prisma ORM
API Routes: /api/session, /api/match, /api/skills, etc.
Caching via Vercel or Redis for match suggestions
Key Tables
User           // Core profile
Skill          // Skill list (e.g., “React”, “UI/UX”)
UserSkill      // Teach or Learn skills + level
Session        // Coaching session records
Testimonial    // Feedback & reviews
XPLog          // XP system
MatchRequest   // Match suggestions + status
5. 📱 UI Pages / Components

Page	Components
/ Home	Hero, How it works, Trending skills carousel
/profile/:username	User card, badges, XP bar, book button
/dashboard	Skill manager, XP summary, session history
/book/:sessionId	Booking details, calendar modal
/learn or /teach	Skill discovery + filters
6. 🪙 Gamification Logic

Action	XP Earned
Hosting a session	+100 XP
Completing as a learner	+50 XP
Getting 5-star feedback	+25 XP
Referring a new user	+50 XP
Daily login streak	+5 XP
7. 📦 MVP Scope

Must-Have (Core)
Auth
Add/Match skills
Book sessions
Profiles
XP system
Ratings
Should-Have
XP badges
Discovery feed
Session reschedule/cancel
Nice-to-Have
AI skill suggestions
Pomodoro timer per session
Notion recap template
8. 💰 Monetization Model

Model	Description
Freemium	Free for all users with session limits
Premium	Unlock more matches, featured profile, badge skins
Commission	(Optional) 5–10% cut on paid coaching sessions
B2B (Phase 2)	Upskillr for Teams: Private guilds, analytics
9. 📆 Timeline

Week	Milestone
1	Design system, DB schema, auth
2	Skill input, profile setup, XP
3	Matching + session flow
4	Booking + rating + XP dashboard
5	Gamification polish + deployment
6	Launch beta + waitlist campaign
