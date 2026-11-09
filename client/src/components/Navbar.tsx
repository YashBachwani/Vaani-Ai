import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Sparkles,
  Menu,
  X,
  Languages,
  LogOut,
  User,
  Settings,
  Bot,
  GraduationCap
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPublicPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080B16]/85 backdrop-blur-md border-b border-[#27324A]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8B5CF6] via-[#3B82F6] to-[#22D3EE] p-[1.5px] shadow-glow-violet transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-[#080B16] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                VAANI
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded-full font-bold bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/40">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">Your voice. Your language.</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        {isPublicPage ? (
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
            <a href="#showcase" className="hover:text-cyan-400 transition-colors">Products</a>
            <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a>
            <a href="#languages" className="hover:text-cyan-400 transition-colors">Languages</a>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              to="/dashboard"
              className={`hover:text-white transition-colors px-3 py-1.5 rounded-lg ${
                location.pathname === '/dashboard' ? 'text-cyan-400 bg-[#151D32]' : 'text-slate-400'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/assistant"
              className={`flex items-center gap-1.5 hover:text-white transition-colors px-3 py-1.5 rounded-lg ${
                location.pathname === '/assistant' ? 'text-violet-400 bg-[#151D32]' : 'text-slate-400'
              }`}
            >
              <Bot className="w-4 h-4" />
              Assistant
            </Link>
            <Link
              to="/learn"
              className={`flex items-center gap-1.5 hover:text-white transition-colors px-3 py-1.5 rounded-lg ${
                location.pathname.startsWith('/learn') ? 'text-cyan-400 bg-[#151D32]' : 'text-slate-400'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Learn
            </Link>
          </nav>
        )}

        {/* Right CTA / User controls */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {/* Language pill */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#151D32] border border-[#27324A] text-xs text-slate-300">
                <Languages className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-medium">
                  {user.preferredLanguage === 'hi-IN' ? 'हिन्दी' : user.preferredLanguage === 'gu-IN' ? 'ગુજરાતી' : 'English'}
                </span>
              </div>

              {/* User profile dropdown button */}
              <Link
                to="/settings"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#151D32] hover:bg-[#1B2540] border border-[#27324A] transition-colors text-sm text-slate-200"
              >
                <div className="w-6 h-6 rounded-full bg-violet-600/40 border border-violet-400/50 flex items-center justify-center text-xs text-violet-300 font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[120px] truncate font-medium">{user.name}</span>
              </Link>

              {/* Logout button */}
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-[#151D32] border border-transparent hover:border-rose-500/20 transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] hover:from-[#7C3AED] hover:to-[#2563EB] text-white shadow-glow-violet transition-all transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          {isAuthenticated && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#151D32] border border-[#27324A] text-[11px] text-cyan-300">
              <Languages className="w-3 h-3" />
              <span>{user?.preferredLanguage?.split('-')[0]?.toUpperCase()}</span>
            </div>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-[#151D32] border border-[#27324A] text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#10172A] border-b border-[#27324A] px-4 pt-3 pb-6 space-y-3">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#151D32] border border-[#27324A]">
                <div className="w-10 h-10 rounded-full bg-violet-600/30 border border-violet-400 flex items-center justify-center font-bold text-violet-300">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-slate-100">{user?.name}</div>
                  <div className="text-xs text-slate-400">{user?.email}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-xl bg-[#151D32] text-sm font-medium text-slate-200 flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-cyan-400" />
                  Dashboard
                </Link>
                <Link
                  to="/assistant"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-xl bg-[#151D32] text-sm font-medium text-slate-200 flex items-center gap-2"
                >
                  <Bot className="w-4 h-4 text-violet-400" />
                  Assistant
                </Link>
                <Link
                  to="/learn"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-xl bg-[#151D32] text-sm font-medium text-slate-200 flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  Learn
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-xl bg-[#151D32] text-sm font-medium text-slate-200 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4 text-amber-400" />
                  Settings
                </Link>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                  navigate('/login');
                }}
                className="w-full mt-2 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm font-medium flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <div className="space-y-3 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2.5 text-center rounded-xl bg-[#151D32] border border-[#27324A] text-slate-200 font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2.5 text-center rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white font-medium shadow-glow-violet"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

