import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import {
  GraduationCap,
  Users2,
  HelpCircle,
  BookOpen,
  Search,
  Calendar,
  Compass,
  Briefcase,
  AlertOctagon,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Radio,
  Lock,
  Info,
} from 'lucide-react';
import { Button } from '../../components/ui/button';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  const features = [
    {
      title: 'Project Teammate Finder',
      desc: 'Form high-impact squads for hackathons, capstones, and technical innovation with cross-branch skill matching.',
      icon: Users2,
      color: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
    },
    {
      title: 'Academic Peer Q&A',
      desc: 'Ask course questions, share verified code snippets, and master engineering subjects with seniors.',
      icon: HelpCircle,
      color: 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800',
    },
    {
      title: 'Academic Resource Repository',
      desc: 'Access verified lecture notes, previous-year question banks, and department lab documents.',
      icon: BookOpen,
      color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    },
    {
      title: 'Lost and Found Hub',
      desc: 'Report misplaced belongings and audit student ownership claims with photo proof and serial records.',
      icon: Search,
      color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    },
    {
      title: 'Campus Event Reservations',
      desc: 'Discover technical workshops, cultural fests, and hackathons with real-time seat booking and capacity tracking.',
      icon: Calendar,
      color: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    },
    {
      title: 'Student Club Discovery',
      desc: 'Explore officially verified technical and cultural clubs in Silicon University with faculty oversight.',
      icon: Compass,
      color: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    },
    {
      title: 'Eligible Placements',
      desc: 'Personalized campus recruitment opportunities filtered strictly by student branch and CGPA thresholds.',
      icon: Briefcase,
      color: 'bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800',
    },
    {
      title: 'Anonymous Grievance',
      desc: 'Submit sensitive complaints with zero identity tracking via random cryptographic ticket verification.',
      icon: AlertOctagon,
      color: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors w-full">
      {/* Header Navbar - Homepage only */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between min-w-0">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-2.5 group min-w-0">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform flex-shrink-0">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1 sm:space-x-1.5 min-w-0">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-slate-100 truncate">CampusConnect</span>
                <span className="text-[9px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 uppercase flex-shrink-0">
                  Silicon
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block truncate">Silicon University, Bhubaneswar</p>
            </div>
          </Link>

          <div className="flex items-center space-x-1.5 sm:space-x-3 flex-shrink-0">
            {/* About Page Link - Hidden on mobile view, visible on md+ screens */}
            <Link
              to="/about"
              className="hidden md:inline-flex text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors items-center space-x-1"
            >
              <Info className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>About</span>
            </Link>

            <Link
              to="/grievance/submit"
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hidden lg:block px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Anonymous Grievance
            </Link>

            {/* Theme Toggle - Always visible in all views, all conditions, all devices */}
            <ThemeToggle className="flex-shrink-0" />

            {isAuthenticated ? (
              <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'} className="hidden sm:inline-flex">
                <Button size="sm" variant="primary" className="font-bold text-xs">
                  Open {isAdmin ? 'Admin Console' : 'Student Portal'}
                </Button>
              </Link>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
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

      {/* Hero Section with Welcome Image */}
      <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white via-indigo-50/20 to-slate-50 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-5">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-xs">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <span>Silicon University Bhubaneswar • Centralized Campus Portal</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.12]">
                One Campus. One Community. <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-400 bg-clip-text text-transparent">
                  One Connection.
                </span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Welcome to CampusConnect—the digital heartbeat of Silicon University. Streamline academic discussions, teammate discovery, verified lost-and-found claims, anonymous grievance routing, and official event reservations under a single institutional portal.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 max-w-md mx-auto lg:mx-0">
                {isAuthenticated ? (
                  <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'} className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto text-sm sm:text-base font-bold shadow-md">
                      Open {isAdmin ? 'Admin Console' : 'Student Portal'} <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="w-full sm:w-auto">
                      <Button size="lg" className="w-full sm:w-auto text-sm sm:text-base font-bold shadow-md">
                        Register Student Account <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Button>
                    </Link>
                    <Link to="/login" className="w-full sm:w-auto">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm sm:text-base font-semibold">
                        Log In to Portal
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-6 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Role-Based Access Control</span>
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center space-x-1.5">
                  <Radio className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                  <span>WebSocket Live Alerts</span>
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center space-x-1.5">
                  <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                  <span>Silicon Boundary</span>
                </span>
              </div>
            </div>

            {/* Right Welcome / Hero Image Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md lg:max-w-none">
                {/* Decorative background glow */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-3xl blur-md opacity-30 dark:opacity-40 animate-pulse" />
                
                {/* Hero Campus Image Container */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/80 dark:border-slate-800 bg-slate-900 group">
                  <img
                    src="/campus-hero.jpg"
                    alt="Silicon University Bhubaneswar CampusConnect Welcome"
                    className="w-full h-72 sm:h-84 lg:h-96 object-cover object-center transform group-hover:scale-103 transition-transform duration-500"
                    loading="eager"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                  {/* Overlaid Welcome Campus Badge */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-slate-900/85 backdrop-blur-md text-white border border-white/10 flex items-center justify-between">
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">Silicon University Campus</p>
                        <p className="text-[10px] text-slate-300 truncate">Bhubaneswar, Odisha</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 flex-shrink-0">
                      Official
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Architecture Metrics Strip */}
      <section className="border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">100%</div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">Verified University Domain</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">@silicon.ac.in authentication</p>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">Real-Time</div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">Campus Emergency Broadcasts</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Instant socket alerting</p>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 font-mono">Zero-Leak</div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">Cryptographic Grievances</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Anonymous ticket resolution</p>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 font-mono">Single</div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">Unified Digital Campus Hub</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Academics, events, placements</p>
          </div>
        </div>
      </section>

      {/* Dedicated About Platform Section */}
      <section className="py-12 sm:py-16 bg-slate-100/70 dark:bg-slate-900/40 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-white to-indigo-50/40 dark:from-slate-900 dark:to-indigo-950/30 rounded-3xl border border-indigo-100 dark:border-indigo-900/50 p-6 sm:p-10 lg:p-12 shadow-xs relative overflow-hidden">
            {/* Ambient background decoration */}
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl space-y-4 sm:space-y-5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
                <Info className="w-3.5 h-3.5" />
                <span>About Silicon CampusConnect</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Built for the Silicon Community, <br className="hidden sm:inline" />
                Engineered for Integrity & Excellence.
              </h2>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                CampusConnect is the centralized digital ecosystem developed for Silicon University, Bhubaneswar. Built to bridge students, faculty, and administrative departments, the platform unites academic peer discussions, verified study resource repositories, photographic lost-and-found resolution, event ticketing, placement drives, and cryptographic anonymous grievances under a unified institutional single-sign-on network.
              </p>

              {/* Key Highlights Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 pb-2">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
                  <div className="text-indigo-600 dark:text-indigo-400 font-black text-sm flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> 100% Verified
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Exclusive to @silicon.ac.in university community.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
                  <div className="text-emerald-600 dark:text-emerald-400 font-black text-sm flex items-center gap-1.5">
                    <Radio className="w-4 h-4" /> Instant Broadcasts
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Real-time emergency & advisory push alerts.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
                  <div className="text-rose-600 dark:text-rose-400 font-black text-sm flex items-center gap-1.5">
                    <Lock className="w-4 h-4" /> Zero-Trace Privacy
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Cryptographic tickets for anonymous grievances.</p>
                </div>
              </div>

              {/* Call to action button */}
              <div className="pt-2">
                <Link to="/about">
                  <Button
                    size="lg"
                    className="font-black text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md inline-flex items-center gap-2 px-6 py-3"
                  >
                    <Info className="w-4 h-4" />
                    <span>About Us</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Presentation Grid (Display Cards without links as requested) */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Integrated Campus Services
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Every feature connects students with campus administration through a unified, high-integrity architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${feat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
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
            <Link to="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              About Platform
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
export default LandingPage;
