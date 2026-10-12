'use client';

import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Bot,
  Users,
  Sparkles,
  Settings,
  ShieldAlert,
  Database,
  Utensils
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'analytics' | 'copilot';
  setActiveTab: (tab: 'analytics' | 'copilot') => void;
  totalCount: number;
  churnRate: number;
}

export default function Sidebar({ activeTab, setActiveTab, totalCount, churnRate }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 z-45 select-none hidden lg:flex shadow-xs">
      
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-100 flex items-center space-x-3">
        <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-md shadow-indigo-500/20 flex items-center justify-center">
          <Utensils className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-slate-900">
            DineIntellect
          </h1>
          <p className="text-[11px] text-slate-500 font-medium">
            AI Operations &amp; Retention
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Main Menu
        </div>
        
        <button
          onClick={() => setActiveTab('analytics')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'analytics'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Diagnostic Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('copilot')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'copilot'
              ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-md shadow-rose-500/20'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span className="flex-1 text-left">AI Retention Copilot</span>
          <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
        </button>

        <div className="pt-6">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            System Status
          </div>
          
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-500" />
                Dataset:
              </span>
              <span className="font-semibold text-slate-900">{totalCount} Rows</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                Churn Rate:
              </span>
              <span className={`font-semibold ${churnRate > 25 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {churnRate}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Footer / User Profile Card */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            GM
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate">General Manager</h4>
            <p className="text-[10px] text-slate-500 truncate">Operations &amp; Retention</p>
          </div>
        </div>
      </div>

    </aside>
  );
}
