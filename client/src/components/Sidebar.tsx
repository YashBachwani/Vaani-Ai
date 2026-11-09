import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  History,
  GraduationCap,
  TrendingUp,
  Settings,
  Sparkles
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/assistant', label: 'VAANI Assistant', icon: Bot },
    { to: '/assistant/history', label: 'Conversation History', icon: History },
    { to: '/learn', label: 'VAANI Learn', icon: GraduationCap },
    { to: '/learn/progress', label: 'Learning Progress', icon: TrendingUp },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#080B16] border-r border-[#27324A] shrink-0 p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1.5 flex-1">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
          Platform Experience
        </div>

        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/learn' || link.to === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#8B5CF6]/20 to-[#3B82F6]/10 text-white border border-[#8B5CF6]/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#151D32]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  />
                  <span>{link.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Powered by Gnani & VAANI CORE badge */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#151D32] to-[#10172A] border border-[#27324A] text-xs">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-slate-200">VAANI CORE 1.0</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          100% LLM-free intelligence + official Gnani.ai speech inference.
        </p>
      </div>
    </aside>
  );
};

