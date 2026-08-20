import React, { useState } from 'react';
import { X, User, ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('Alex Morgan');
  const [email, setEmail] = useState('alex.morgan@example.com');
  const [password, setPassword] = useState('••••••••');
  const [role, setRole] = useState<'attendee' | 'organizer'>('attendee');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      id: `usr-${Date.now()}`,
      name: name || 'Demo User',
      email: email || 'user@example.com',
      role,
      avatar: role === 'organizer'
        ? 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    });
    onClose();
  };

  const handleQuickLogin = (demoRole: 'attendee' | 'organizer') => {
    if (demoRole === 'attendee') {
      onLogin({
        id: 'usr-attendee-1',
        name: 'Alex Morgan',
        email: 'alex.morgan@example.com',
        role: 'attendee',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      });
    } else {
      onLogin({
        id: 'usr-organizer-1',
        name: 'Sarah Jenkins (Host)',
        email: 'sarah.organizer@eventpulse.io',
        role: 'organizer',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
              <User className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {isSignUp ? 'Create Your Account' : 'Welcome Back to EventPulse'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs text-slate-800 dark:text-slate-200">
          
          {/* Quick Demo Login Preset Buttons */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
              Quick 1-Click Demo Profiles
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('attendee')}
                className="p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/40 hover:bg-indigo-100 transition-colors text-left"
              >
                <p className="font-bold text-indigo-900 dark:text-indigo-200">Attendee Login</p>
                <p className="text-[10px] text-slate-500">Alex Morgan</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('organizer')}
                className="p-2.5 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/40 hover:bg-amber-100 transition-colors text-left"
              >
                <p className="font-bold text-amber-900 dark:text-amber-200">Organizer Hub</p>
                <p className="text-[10px] text-slate-500">Sarah Jenkins</p>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 my-2">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Or with credentials</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isSignUp && (
              <div>
                <label className="block font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850"
                />
              </div>
            )}

            <div>
              <label className="block font-semibold mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850"
              />
            </div>

            {isSignUp && (
              <div>
                <label className="block font-semibold mb-1">Account Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('attendee')}
                    className={`p-2 rounded-xl border text-center font-bold ${
                      role === 'attendee'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    Ticket Buyer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('organizer')}
                    className={`p-2 rounded-xl border text-center font-bold ${
                      role === 'organizer'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    Event Organizer
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5"
            >
              <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
