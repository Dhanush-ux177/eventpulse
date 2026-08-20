import React, { useState } from 'react';
import { 
  Calendar, 
  Mail, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Heart, 
  Globe, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Github 
} from 'lucide-react';
import { EventCategory } from '../types';

interface FooterProps {
  onSelectCategory: (cat: EventCategory) => void;
  onOpenCreateEvent: () => void;
  onOpenAdmin: () => void;
  onShowToast: (title: string, msg?: string, type?: 'success' | 'error' | 'info') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenCreateEvent,
  onOpenAdmin,
  onShowToast,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !/\S+@\S+\.\S+/.test(emailInput)) {
      onShowToast('Invalid Email', 'Please enter a valid email address.', 'error');
      return;
    }
    setSubscribed(true);
    onShowToast('Subscribed!', 'You will receive weekly alerts for early-bird tickets.', 'success');
    setEmailInput('');
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
        
        {/* Top Newsletter & Banner Callout */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-violet-950/80 border border-indigo-500/20 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">
              Weekly Event Dispatch
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Get Early-Bird Pass Alerts & Exclusive VIP Discounts
            </h3>
            <p className="text-slate-300 text-xs max-w-xl">
              Be the first to hear when popular music headliners, tech keynotes, and culinary masterclasses release tickets in your city.
            </p>
          </div>

          <div className="lg:col-span-5">
            {subscribed ? (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>You're on the VIP priority notification list!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/90 text-white placeholder-slate-500 text-xs rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <span>Subscribe</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pt-4">
          
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Event<span className="text-indigo-400">Pulse</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              EventPulse is a full-stack event discovery and ticket booking ecosystem connecting audiences with concerts, summits, festivals, and hands-on workshops worldwide.
            </p>
            <div className="flex items-center gap-3 text-slate-400 pt-1">
              <a href="#" className="hover:text-white transition-colors" title="Twitter"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="hover:text-white transition-colors" title="Instagram"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="hover:text-white transition-colors" title="LinkedIn"><Linkedin className="w-4 h-4" /></a>
              <a href="#" className="hover:text-white transition-colors" title="GitHub"><Github className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              Explore Events
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectCategory('Music & Concerts')}
                  className="hover:text-white transition-colors"
                >
                  Concerts & Music
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Tech & Conferences')}
                  className="hover:text-white transition-colors"
                >
                  Tech & AI Summits
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Workshops & Masterclasses')}
                  className="hover:text-white transition-colors"
                >
                  Culinary & Craft
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Festivals & Arts')}
                  className="hover:text-white transition-colors"
                >
                  Film & Arts Galas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Sports & Fitness')}
                  className="hover:text-white transition-colors"
                >
                  Marathons & Sports
                </button>
              </li>
            </ul>
          </div>

          {/* For Organizers */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              For Organizers
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onOpenCreateEvent} className="hover:text-white transition-colors">
                  Host an Event
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="hover:text-white transition-colors">
                  Organizer Dashboard
                </button>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  QR Scanner Gate Check-in
                </a>
              </li>
              <li>
                <a href="#promo" className="hover:text-white transition-colors">
                  Promo Engine
                </a>
              </li>
            </ul>
          </div>

          {/* Trust & Support */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              Support & Security
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Buyer Guarantee</span>
              </li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="mailto:support@eventpulse.io" className="hover:text-white transition-colors">support@eventpulse.io</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 EventPulse Technologies Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-current" />
            <span>for modern live experiences</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
