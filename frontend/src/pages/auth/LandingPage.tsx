import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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
} from 'lucide-react';
import { Button } from '../../components/ui/button';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  const features = [
    {
      title: 'Project Teammate Finder',
      desc: 'Form high-impact squads for hackathons, capstones, and technical innovation.',
      icon: Users2,
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      title: 'Academic Peer Q&A',
      desc: 'Ask course questions, share code snippets, and master subjects with seniors.',
      icon: HelpCircle,
      color: 'bg-sky-50 text-sky-600',
    },
    {
      title: 'Academic Resource Repository',
      desc: 'Access lecture notes, previous-year question banks, and lab documents.',
      icon: BookOpen,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Lost and Found Hub',
      desc: 'Report lost campus belongings with verified photographic claim processing.',
      icon: Search,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Campus Event Reservations',
      desc: 'Discover workshops, cultural fests, and hackathons with instant seat booking.',
      icon: Calendar,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Student Club Discovery',
      desc: 'Explore officially verified technical and cultural clubs in Silicon University.',
      icon: Compass,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Eligible Placements',
      desc: 'Personalized recruitment opportunities filtered strictly by branch & CGPA.',
      icon: Briefcase,
      color: 'bg-teal-50 text-teal-600',
    },
    {
      title: 'Anonymous Grievance',
      desc: 'Submit feedback with zero identity tracking via random cryptographic tickets.',
      icon: AlertOctagon,
      color: 'bg-rose-50 text-rose-600',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base text-slate-900">CampusConnect</span>
              <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                Silicon
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link to="/grievance/submit" className="text-xs font-semibold text-slate-600 hover:text-slate-900 hidden sm:block">
              Anonymous Grievance
            </Link>
            {isAuthenticated ? (
              <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'}>
                <Button size="sm" variant="primary">
                  Go to {isAdmin ? 'Admin Console' : 'Student Portal'}
                </Button>
              </Link>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button size="sm" variant="outline">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" variant="primary">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold mb-6">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Silicon University Bhubaneswar • Centralized Campus Portal</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-[1.1]">
            One Campus. One Community. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-sky-600 bg-clip-text text-transparent">
              One Connection.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            CampusConnect bridges academic discussions, project collaboration, official event registrations, 
            verified lost-and-found claims, anonymous grievances, and real-time emergency broadcasts under a single digital university platform.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            {isAuthenticated ? (
              <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'} className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-base">
                  Open {isAdmin ? 'Admin Console' : 'Student Portal'} <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto text-base">
                    Register Student Account <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link to="/login" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-base">
                    Log In to Portal
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="mt-10 flex items-center justify-center space-x-6 text-xs text-slate-500">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Strict Role-Based Access Control</span>
            </span>
            <span>•</span>
            <span>WebSocket Real-Time Broadcasts</span>
            <span>•</span>
            <span>Single-Campus Boundary</span>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 flex-1">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Integrated Campus Services
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Every feature connects students with campus administration through a unified, high-integrity architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${feat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 sm:px-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Silicon University, Bhubaneswar. CampusConnect Single-Campus Prototype.</p>
      </footer>
    </div>
  );
};
