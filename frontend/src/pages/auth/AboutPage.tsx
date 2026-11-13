import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import {
  GraduationCap,
  Home,
  ShieldCheck,
  Users2,
  HelpCircle,
  BookOpen,
  Search,
  Calendar,
  Compass,
  Briefcase,
  AlertOctagon,
  Radio,
  Lock,
  ArrowRight,
  Sparkles,
  Building2,
  CheckCircle2,
  Layers,
  FileText,
  BellRing,
  Award,
} from 'lucide-react';
import { Button } from '../../components/ui/button';

export const AboutPage: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors w-full">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform flex-shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-slate-100">CampusConnect</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 uppercase">
                    Silicon
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">Silicon University, Bhubaneswar</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
              title="Return to Home Page"
            >
              <Home className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Back to Home</span>
            </Link>

            <ThemeToggle />

            {isAuthenticated ? (
              <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'}>
                <Button size="sm" variant="primary" className="font-bold text-xs">
                  Go to {isAdmin ? 'Admin Console' : 'Student Portal'}
                </Button>
              </Link>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button size="sm" variant="outline" className="font-semibold text-xs">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" variant="primary" className="font-bold text-xs">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Header Section */}
      <section className="relative py-14 sm:py-20 bg-gradient-to-b from-white via-indigo-50/20 to-slate-50 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-6 shadow-xs">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <span>Silicon University Bhubaneswar • Centralized Campus Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
            About CampusConnect
          </h1>

          <p className="mt-5 text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
            CampusConnect is the premier institutional operating system engineered specifically for Silicon University.
            It consolidates fragmented social messaging groups, ad-hoc paper notices, and scattered forms into a single,
            high-integrity web platform connecting students, faculty mentors, and university administration.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="font-bold text-slate-800 dark:text-slate-200">Bhubaneswar Campus</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold text-slate-800 dark:text-slate-200">Domain Auth (@silicon.ac.in)</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <Radio className="w-4 h-4 text-rose-600 dark:text-rose-400 animate-pulse" />
              <span className="font-bold text-slate-800 dark:text-slate-200">Live Campus Broadcaster</span>
            </div>
          </div>
        </div>
      </section>

      {/* Alternating Feature Stories Section (Zigzag Images and Descriptions) */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-20 sm:space-y-28">

        {/* 1. LEFT IMAGE - RIGHT CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Image */}
          <div className="lg:col-span-6">
            <div className="relative group overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900">
              <img
                src="/about-collab.jpg"
                alt="Silicon University Innovation Lab Collaboration"
                className="w-full h-72 sm:h-96 object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-semibold backdrop-blur-md bg-slate-900/60 p-2.5 rounded-xl border border-white/10">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Innovation Lab & Student Hackathons
                </span>
                <span className="text-[10px] uppercase font-bold text-indigo-300">Silicon Tech Commons</span>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold uppercase tracking-wider">
              <Users2 className="w-3.5 h-3.5" />
              <span>Peer Collaboration & Hackathons</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
              Smart Teammate Finder & Peer-Led Academic Q&A
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Finding complementary engineering talent for capstone projects, internal hackathons, and tech competitions used to be difficult across different branches. CampusConnect solves this through the intelligent <strong>Teammate Finder</strong>.
            </p>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Students at Silicon University can post project opportunities, specify exact vacancy requirements (such as React, Python, IoT, ROS2, or AI/ML), and review applicants based on real academic specializations. Additionally, the <strong>Academic Peer Q&A</strong> module empowers students to post course queries and receive verified explanations and code snippets from senior students and mentors.
            </p>

            <div className="pt-2 space-y-2.5">
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span><strong>Cross-Branch Synergy:</strong> Connect Computer Science, ECE, and Electrical engineering minds into unified squads.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span><strong>Verified Answer Threads:</strong> Upvoted and verified explanations for complex engineering syllabus subjects.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span><strong>Real-Time Vacancy Counters:</strong> Automatic status closure when project vacancies are filled.</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. RIGHT IMAGE - LEFT CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Content (Desktop order 1, mobile order 2) */}
          <div className="lg:col-span-6 order-2 lg:order-1 space-y-5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Curated Knowledge Base</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
              Academic Resource Repository & Semester Archives
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Academic excellence requires dependable, vetted course materials. CampusConnect eliminates unverified links and expiring download drives with the <strong>Academic Resource Repository</strong>.
            </p>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Every document is categorized by university branch, semester, course code, and faculty instructor. Silicon University students can instantly access previous-year examination papers (PYQs), faculty-approved lecture notes, and lab manuals in high-definition previews without cumbersome external logins.
            </p>

            <div className="pt-2 space-y-2.5">
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span><strong>Course Code Mapping:</strong> Direct classification under formal curriculum identifiers (CS302, EC401, etc.).</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span><strong>Faculty & Senior Uploads:</strong> Quality-filtered study guides and exam preparation banks.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span><strong>Single-Click Downloads:</strong> Instant retrieval of lab manuals and syllabus documentation.</span>
              </div>
            </div>
          </div>

          {/* Right Image (Desktop order 2, mobile order 1) */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative group overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900">
              <img
                src="/about-library.jpg"
                alt="Silicon University Digital Library & Study Commons"
                className="w-full h-72 sm:h-96 object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-semibold backdrop-blur-md bg-slate-900/60 p-2.5 rounded-xl border border-white/10">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
                  Central Library & Research Commons
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-300">Verified PYQs & Notes</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. LEFT IMAGE - RIGHT CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Image */}
          <div className="lg:col-span-6">
            <div className="relative group overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900">
              <img
                src="/about-events.jpg"
                alt="Silicon University Student Club Fair & Campus Events"
                className="w-full h-72 sm:h-96 object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-semibold backdrop-blur-md bg-slate-900/60 p-2.5 rounded-xl border border-white/10">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                  Campus Events & Club Hub
                </span>
                <span className="text-[10px] uppercase font-bold text-purple-300">Audited Charters</span>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 text-xs font-extrabold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              <span>Campus Life & Verified Societies</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
              Student Club Discovery & Real-Time Event Reservations
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Silicon University buzzes with technical societies, coding leagues, robotics clubs, and cultural initiatives. CampusConnect brings structure and accountability to campus activities through dedicated administrative club governance.
            </p>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              To uphold campus integrity and official accreditation, only university administrators have authorization to charter new clubs. Students can explore verified clubs, learn about faculty advisors and student leads, and book seats for technical workshops, guest seminars, and annual fests with live capacity monitoring.
            </p>

            <div className="pt-2 space-y-2.5">
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span><strong>Admin-Supervised Charters:</strong> Strictly verified clubs ensuring genuine student initiatives and safety.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span><strong>Live Seat Reservation:</strong> Instant digital RSVP with live capacity counters preventing auditorium overbooking.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span><strong>Broadcast Synchronization:</strong> Event updates automatically surfaced on student dashboard feeds.</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. RIGHT IMAGE - LEFT CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Content (Desktop order 1, mobile order 2) */}
          <div className="lg:col-span-6 order-2 lg:order-1 space-y-5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-extrabold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Campus Security & Integrity</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
              Photo-Audited Lost & Found, Career Drives & Anonymous Grievances
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Campus safety, fairness, and accountability form the backbone of CampusConnect. The platform provides specialized systems addressing critical day-to-day student needs.
            </p>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Our <strong>Lost & Found Hub</strong> mandates photo uploads and detailed ownership statements for misplaced items (laptops, IDs, electronics), audited by administration before handover. Graduating seniors benefit from the <strong>Placements Module</strong>, filtering recruitment drives strictly by student CGPA and branch eligibility.
              Crucially, student voices are protected through the <strong>Anonymous Grievance Redressal</strong> system, which generates randomized cryptographic tracking tickets offering 100% privacy with zero identity tracking.
            </p>

            <div className="pt-2 space-y-2.5">
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span><strong>Audited Item Ownership:</strong> Detailed claim explanations and serial verification prevent wrongful pickup.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span><strong>Eligibility-Filtered Placements:</strong> Transparent corporate job postings matched to student CGPA tiers.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span><strong>Zero-Knowledge Grievance:</strong> Cryptographic ticket IDs enable safe follow-ups without exposing identity.</span>
              </div>
            </div>
          </div>

          {/* Right Image (Desktop order 2, mobile order 1) */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative group overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900">
              <img
                src="/campus-hero.jpg"
                alt="Silicon University Administration & Campus Architecture"
                className="w-full h-72 sm:h-96 object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-semibold backdrop-blur-md bg-slate-900/60 p-2.5 rounded-xl border border-white/10">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
                  Silicon University Campus
                </span>
                <span className="text-[10px] uppercase font-bold text-indigo-300">Security & Integrity</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Website Architecture & Capabilities Summary */}
      <section className="border-t border-slate-200/80 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/40 py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Website Architecture & Design Principles
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Built specifically to overcome the limitations of fragmented chat applications and paper-based administrative workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                Domain-Enforced Access
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Guaranteed campus boundary requiring authentic student and faculty email addresses registered under the official university domain.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                Role-Governed Consoles
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Distinct user journeys separating student collaboration workflows from authorized administrative auditing and governance consoles.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                Emergency Alert Broadcast
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Direct administrative broadcast channel that flashes urgent campus notices, weather warnings, and schedule alerts instantly to active sessions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                Responsive Cross-Device UI
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Adaptive layout engineered for seamless productivity whether accessing the platform on desktop workstations, tablets, or mobile phones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-14 px-4 sm:px-6 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join Your University Portal Today</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Ready to Connect with Silicon University?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Create your verified student account or log in with your institutional credentials to discover teammates, download study materials, and participate in campus life.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link to="/register">
              <Button variant="primary" size="sm" className="font-bold text-xs">
                Register Student Account <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="sm" className="font-semibold text-xs">
                Sign In to Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 py-8 px-4 sm:px-6 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="font-bold text-slate-800 dark:text-slate-200">CampusConnect</span>
            <span>•</span>
            <span>Silicon University, Bhubaneswar</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
            <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              Home
            </Link>
            <Link to="/grievance/submit" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              Submit Grievance
            </Link>
            <Link to="/grievance/track" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              Track Ticket
            </Link>
            <Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              Portal Sign In
            </Link>
          </div>

          <p>© {new Date().getFullYear()} Silicon University. Single-Campus Prototype.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
