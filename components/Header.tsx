'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  Sparkles,
  Utensils,
  MessageSquare,
  User,
  X,
  Mail,
  Shield,
  Briefcase,
  Settings
} from 'lucide-react';

interface HeaderProps {
  showCuisine: boolean;
  setShowCuisine: (show: boolean) => void;
}

export default function Header({ showCuisine, setShowCuisine }: HeaderProps) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-[#f0eae1] sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            {/* Brand */}
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-tr from-[#e05a33] to-[#d64520] p-2 rounded-xl shadow-sm flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-base font-bold tracking-tight text-slate-900">
                    DineIntellect
                  </h1>
                  <p className="text-[10px] text-amber-700/80 font-medium">
                    AI Operations &amp; Retention
                  </p>
                </div>
              </div>
            </div>

            {/* Right Settings & User Profile Icons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettingsModal(true)}
                title="Application Settings"
                className="w-10 h-10 rounded-full bg-[#f8f5ee] border border-[#f0eae1] text-slate-700 flex items-center justify-center shadow-2xs hover:bg-[#f4ebe1] hover:shadow-sm transition-all cursor-pointer"
              >
                <Settings className="w-4 h-4 text-[#e05a33]" />
              </button>
              <button
                onClick={() => setShowProfileModal(true)}
                title="View Profile"
                className="w-10 h-10 rounded-full bg-[#f8f5ee] border border-[#f0eae1] text-slate-700 flex items-center justify-center shadow-2xs hover:bg-[#f4ebe1] hover:shadow-sm transition-all cursor-pointer"
              >
                <User className="w-4 h-4 text-[#e05a33]" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xs transition-opacity"
            onClick={() => setShowSettingsModal(false)}
          />
          <div className="relative bg-white border border-[#f0eae1] rounded-3xl p-6 max-w-sm w-full shadow-2xl z-10 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0eae1]">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#e05a33]" />
                Application Settings
              </h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="w-8 h-8 rounded-full bg-[#f8f5ee] border border-[#f0eae1] text-slate-600 hover:text-slate-900 hover:bg-[#f4ebe1] hover:shadow-2xs flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between bg-[#fcfbf9] p-3.5 rounded-2xl border border-[#f0eae1]">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Preferred Cuisine Filter</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Show cuisine categories &amp; analytics</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCuisine}
                    onChange={(e) => setShowCuisine(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e05a33]"></div>
                </label>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="w-full py-2.5 bg-[#e05a33] hover:bg-[#cf4e28] text-white rounded-xl font-bold text-xs shadow-sm transition-colors cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xs transition-opacity"
            onClick={() => setShowProfileModal(false)}
          />

          {/* Modal Card */}
          <div className="relative bg-white border border-[#f0eae1] rounded-3xl p-6 max-w-sm w-full shadow-2xl z-10 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0eae1]">
              <h3 className="text-sm font-bold text-slate-900">User Profile</h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="w-8 h-8 rounded-full bg-[#f8f5ee] border border-[#f0eae1] text-slate-600 hover:text-slate-900 hover:bg-[#f4ebe1] hover:shadow-2xs flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 pt-2">
              <div className="w-16 h-16 rounded-full bg-[#faedd9] border-2 border-[#f4dbb8] text-[#e05a33] flex items-center justify-center shadow-md">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Alex Thorne</h4>
                <p className="text-xs text-slate-500 mt-0.5">Enterprise Operations &amp; Retention</p>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center gap-3 bg-[#fcfbf9] p-3 rounded-xl border border-[#f0eae1]">
                <div className="w-8 h-8 rounded-lg bg-[#faedd9] text-[#e05a33] flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Position</span>
                  <span className="font-bold text-slate-800">General Manager (Operations &amp; Churn Prevention)</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#fcfbf9] p-3 rounded-xl border border-[#f0eae1]">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Email</span>
                  <span className="font-bold text-slate-800 font-mono">manager@dineintellect.com</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#fcfbf9] p-3 rounded-xl border border-[#f0eae1]">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Security Role</span>
                  <span className="font-bold text-slate-800">Enterprise Administrator (Full RBAC Access)</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowProfileModal(false)}
                className="w-full py-2.5 bg-[#e05a33] hover:bg-[#cf4e28] text-white rounded-xl font-bold text-xs shadow-sm transition-colors cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
