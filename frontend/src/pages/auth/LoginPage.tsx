import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { GraduationCap, Lock, Mail, ArrowRight, AlertCircle, Shield } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const searchParams = new URLSearchParams(location.search);
  const sessionExpired = searchParams.get('session_expired') === '1';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const data = await login(email, password);
      if (data.success) {
        if (data.data.user.role === 'ADMIN') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err: any) {
      if (err.response?.status === 403 && err.response?.data?.accountStatus === 'SUSPENDED') {
        navigate('/suspended', { replace: true });
        return;
      }
      setErrorMessage(
        err.response?.data?.message || 'Login failed. Please verify your university email and password.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2.5">
          <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
            <GraduationCap className="w-7 h-7" />
          </div>
        </Link>
        <h2 className="mt-4 text-3xl font-black text-slate-900 tracking-tight">Sign in to CampusConnect</h2>
        <p className="mt-1 text-xs text-slate-500 font-medium">Silicon University, Bhubaneswar</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl border border-slate-200/80 rounded-2xl">
          {sessionExpired && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Your previous session has expired or was revoked. Please sign in again.</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center space-x-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="University Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. rohit.sharma@silicon.ac.in"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
            />

            <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isLoading}>
              Sign In to Portal <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          {/* Academic Evaluation / Demo Credentials Quick Fill Box */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
              Quick Test Credentials:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('rohit.sharma@silicon.ac.in', 'Student@Silicon2026')}
                className="p-2 text-left rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all"
              >
                <span className="font-bold text-slate-800 block text-[11px]">Student Login</span>
                <span className="text-[10px] text-slate-500 truncate block">rohit.sharma@silicon...</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin@silicon.ac.in', 'Admin@Silicon2026')}
                className="p-2 text-left rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all"
              >
                <div className="flex items-center space-x-1">
                  <Shield className="w-3 h-3 text-indigo-600" />
                  <span className="font-bold text-slate-800 text-[11px]">Admin Login</span>
                </div>
                <span className="text-[10px] text-slate-500 truncate block">admin@silicon.ac.in</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            <span>New student at Silicon University? </span>
            <Link to="/register" className="font-bold text-indigo-600 hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
