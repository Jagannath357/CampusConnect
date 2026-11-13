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
} from 'lucide-react';
import { Button } from '../../components/ui/button';

export const AboutPage: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  const pillars = [
    {
      title: 'Peer Collaboration & Academic Q&A',
      desc: 'Connect with peers across departments, find teammates with complementary skills for hackathons and capstone projects, and resolve course doubts with seniors.',
      icon: Users2,
      color: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
    },
    {
      title: 'Verified Resource Repository',
      desc: 'Centralized repository for lecture materials, lab manuals, and previous years examination question papers uploaded and vetted by university departments.',
      icon: BookOpen,
      color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    },
    {
      title: 'Campus Events & Club Governance',
      desc: 'Real-time event seat reservation system with automated fill rates, alongside an administrative club charter application and verification pipeline.',
      icon: Calendar,
      color: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    },
    {
      title: 'Photo-Verified Lost & Found Claims',
      desc: 'Dual-sided reporting system for lost and found campus belongings featuring student ownership explanation auditing, serial matching, and administrative resolution.',
      icon: Search,
      color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    },
    {
      title: 'Career & Placement Pipeline',
      desc: 'Direct synchronization of campus recruitment drives filtered strictly by branch eligibility and student CGPA thresholds for fair, organized recruitment.',
      icon: Briefcase,
      color: 'bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800',
    },
    {
      title: 'Cryptographic Anonymous Grievance Redressal',
      desc: 'Guarantees 100% student privacy for sensitive campus complaints using zero-knowledge randomized tracking tickets, departmental routing, and status auditing.',
      icon: AlertOctagon,
      color: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800',
    },
  ];

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

      {/* Hero Header */}
      <section className="relative py-14 sm:py-20 bg-gradient-to-b from-white via-indigo-50/20 to-slate-50 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-6 shadow-xs">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <span>About Silicon University CampusConnect</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
            One Unified Digital Hub for Silicon University
          </h1>

          <p className="mt-5 text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
            CampusConnect is the centralized institutional operating platform designed specifically for the faculty,
            administration, and students of Silicon University, Bhubaneswar. It replaces fragmented social channels and disparate forms with a secure, role-governed digital campus ecosystem.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="font-bold text-slate-800 dark:text-slate-200">Silicon University, Bhubaneswar</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold text-slate-800 dark:text-slate-200">Official Domain (@silicon.ac.in)</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <Radio className="w-4 h-4 text-rose-600 dark:text-rose-400 animate-pulse" />
              <span className="font-bold text-slate-800 dark:text-slate-200">Live Campus Broadcaster</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Institutional Pillars & Capabilities
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Engineered with strict single-campus boundaries and decision tables for unbiased academic governance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${pillar.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Security & Governance Highlight */}
      <section className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Single-Campus Integrity & Access Control
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Unlike public social networks, CampusConnect strictly requires student email verification against official university records.
            Accounts are monitored for academic guideline compliance, with administrative suspension mechanisms, session token revocation, and audit logs.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link to="/register">
              <Button variant="primary" size="sm" className="font-bold text-xs">
                Register Student Account <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="sm" className="font-semibold text-xs">
                Portal Sign In
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
