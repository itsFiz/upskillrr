# 🧾 Product Requirements Document (Phase 2: Enhancements)

## 🧠 Product Vision: The Polished Experience

This document outlines the features and refinements required to elevate Upskillrr from a functional MVP to a polished, comprehensive, and deeply engaging platform. The focus is on adding depth to existing features, improving user experience through a consistent minimalist aesthetic, and introducing new functionality that drives retention and user satisfaction.

---

### **1. 🏠 Homepage (`/`)**

**Objective:** Transform the homepage from a static landing page into a dynamic and engaging welcome mat that showcases the vibrancy of the Upskillrr community.

**Key Features & Functionality:**
*   **Dynamic "Trending Skills" Section:**
    *   Instead of static examples, this section will now fetch and display the top 4-5 skills with the most active mentors in real-time.
    *   Each skill should be clickable, leading to a new "Skill Detail Page".
*   **"Featured Mentors" Carousel:**
    *   Showcase 3-5 top-rated mentors (based on XP and ratings) in a subtle, auto-scrolling carousel.
    *   Each mentor card should display their name, avatar, and primary teaching skill, linking to their public profile.
*   **Social Proof / Testimonials:**
    *   Add a section that cycles through 3-4 positive testimonials and ratings that users have given each other.
    *   This will provide social proof and highlight the positive interactions happening on the platform.

**Aesthetic & UI/UX Improvements:**
*   **Subtle Animations:** Add fade-in animations on scroll for the "How it Works" and "Features" sections to make the page feel more alive.
*   **Interactive Hover States:** Enhance the hover effects on feature cards and mentor profiles to provide more satisfying visual feedback.
*   **Consistent Glassmorphism:** Ensure all cards and content blocks adhere strictly to the established glassmorphism style.

---

### **2. 🎨 Dashboard (`/dashboard`)**

**Objective:** Evolve the dashboard from a simple stats overview into an actionable, personalized hub that guides the user's next steps.

**Key Features & Functionality:**
*   **Action-Oriented Overview:**
    *   The "Overview" tab will feature a new "Up Next" section.
    *   This section will display the user's single most important next action (e.g., "You have a pending session request from [User]," "Your next session is in 2 hours," or "Leave a review for your recent session").
*   **Weekly Goal Setting:**
    *   Allow users to set a weekly goal for sessions completed (e.g., "Complete 2 sessions this week").
    *   Display a simple progress tracker for this goal on the overview tab.
*   **In-App Notifications Center:**
    *   Add a bell icon to the `Navbar` (and `Dock`) that indicates new notifications.
    *   Create a "Notifications" tab on the dashboard to display a history of session requests, confirmations, and cancellations. This reduces reliance on email.

**Aesthetic & UI/UX Improvements:**
*   **Streamlined Stats:** The four main stat cards will be redesigned into a single, elegant row for a cleaner, more minimalist look.
*   **Improved Session Cards:** Session cards will be made more compact and scannable, with clearer calls to action.
*   **Empty State Refinement:** Enhance the "empty state" messages (e.g., "No sessions yet") with friendly illustrations or icons to guide new users.

---

### **3. 🔍 Discover & Matching Pages (`/discover`, `/matching`)**

**Objective:** Merge the "Discover" and "Matching" concepts into a single, powerful "Explore" page that offers both curated discovery and personalized, AI-driven matching.

**Key Features & Functionality:**
*   **Unified "Explore" Page:**
    *   Combine the "Top Mentors" and "Trending Skills" sections from the current Discover page into a new, unified "Explore" page.
*   **AI-Powered "For You" Section:**
    *   At the top of the "Explore" page, add a new section called "Recommended For You."
    *   This will use a simple AI model (or a robust algorithm) to suggest 3-4 mentors based on the user's "Skills I Want to Learn" and the skills of highly-rated teachers.
*   **Skill Detail Pages:**
    *   Make every skill badge/link clickable, leading to a dynamic page for that skill (e.g., `/explore/react`).
    *   This page will list all mentors who teach that skill, sortable by XP and rating.
*   **Advanced Search & Filtering:**
    *   Implement a more powerful search bar that provides instant results as the user types.
    *   Add filters to the "Explore" page to narrow down mentors by skill level, rating, and potentially availability.

**Aesthetic & UI/UX Improvements:**
*   **Clearer Sectioning:** Use stronger visual cues to separate the "Recommended," "Top Mentors," and "Trending Skills" sections.
*   **Minimalist Mentor Cards:** Refine the `UserProfileCard` further to be as clean and scannable as possible, focusing on the most critical information.

---

### **4. 👤 Profile Page (`/profile/[username]`)**

**Objective:** Enhance the profile page to be a comprehensive and customizable representation of a user's journey and expertise on Upskillrr.

**Key Features & Functionality:**
*   **Edit Profile Functionality:**
    *   Add an "Edit Profile" button for users viewing their own profile.
    *   This will allow them to update their name, bio, and avatar.
*   **Detailed Statistics & Visualizations:**
    *   Add a new "Stats" tab to the profile page.
    *   Include a simple chart visualizing XP gained over the last 30 days.
    *   Provide a clear breakdown of skills taught vs. learned.
*   **Availability Settings:**
    *   In the "Edit Profile" section, allow users to set their general availability (e.g., "Weekdays," "Weekends," "Evenings").
    *   Display this availability on their public profile to help learners make more informed booking decisions.

**Aesthetic & UI/UX Improvements:**
*   **Tabbed Interface:** Organize the profile into "Overview," "Skills," and "Stats" tabs to make it less dense and easier to navigate.
*   **Cleaner Layout:** Use a two-column layout where the main profile card and stats are on the left, and a scrolling list of testimonials is on the right.

---

### **5. 🏆 Leaderboard (`/leaderboard`)**

**Objective:** Make the leaderboard more dynamic and engaging to encourage friendly competition and user retention.

**Key Features & Functionality:**
*   **Time-Based Filters:**
    *   Add filters to allow users to view the leaderboard for the "This Week," "This Month," and "All Time."
    *   This gives new users a chance to compete on a shorter timescale.
*   **Gamified Tiers:**
    *   Introduce visual tiers (e.g., Bronze, Silver, Gold, Platinum) based on XP milestones.
    *   Display these tier badges on the leaderboard and user profiles.

**Aesthetic & UI/UX Improvements:**
*   **Dynamic Podium:** Enhance the animations and styling of the top 3 "podium" to make it feel more prestigious.
*   **Improved List Rendering:** Add subtle hover effects and a cleaner separator between users in the main list.

---

This document will now serve as our guide for the next phase of development. I am ready to begin implementation when you are. 