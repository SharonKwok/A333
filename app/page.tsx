'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ViewAnalytics from '@/components/ViewAnalytics';
import ViewCopilot from '@/components/ViewCopilot';
import { Loader2, AlertCircle, Utensils, Sparkles } from 'lucide-react';

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [showCuisine, setShowCuisine] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);

  // Lifted chat messages state so history persists across opening/closing
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'model'; content: string }>>([
    {
      role: 'model',
      content: 'Hello General Manager. I am your DineIntellect AI Copilot. Ask me operational questions, analyze churn drivers, or test our dining metrics.',
    },
  ]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/data');
        const json = await res.json();
        if (!json.success) {
          throw new Error(json.error || 'Failed to load dataset');
        }
        setData(json.data);
      } catch (err: any) {
        setError(err.message || 'Error loading dataset');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSelectForCopilot = (customer: any) => {
    setSelectedCustomer(customer);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbf9f6] flex flex-col items-center justify-center text-slate-900 space-y-4">
        <div className="w-16 h-16 bg-gradient-to-tr from-[#e05a33] to-[#d64520] rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
          <Utensils className="w-8 h-8 text-white" />
        </div>
        <div className="flex items-center gap-2 text-slate-700 text-sm font-medium">
          <Loader2 className="w-4 h-4 animate-spin text-[#e05a33]" />
          Loading DineIntellect Enterprise Analytics &amp; Dataset...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fbf9f6] flex items-center justify-center p-4">
        <div className="bg-white border border-[#f0eae1] rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mx-auto border border-rose-100">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Failed to Initialize Dataset</h3>
          <p className="text-xs text-slate-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#e05a33] hover:bg-[#cf4e28] text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf9f6] text-slate-900 flex flex-col font-sans selection:bg-[#e05a33] selection:text-white relative">
      
      {/* Top Header */}
      <Header
        showCuisine={showCuisine}
        setShowCuisine={setShowCuisine}
      />

      {/* Main Content Area (Compresses to the left when AI copilot panel is open) */}
      <main className={`flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300 ${isCopilotOpen ? 'lg:mr-[420px]' : ''}`}>
        <ViewAnalytics
          data={data}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          onSelectForCopilot={handleSelectForCopilot}
          showCuisine={showCuisine}
          setShowCuisine={setShowCuisine}
        />
      </main>

      {/* Floating Bottom-Right AI Copilot Button (Image 2 & 3 Style) */}
      {!isCopilotOpen && (
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-tr from-[#e05a33] to-[#d64520] hover:from-[#cf4e28] hover:to-[#be3e1a] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-all cursor-pointer group"
          title="Open AI Copilot Chat"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-[#e05a33] rounded-full text-[10px] font-bold flex items-center justify-center shadow-md border border-[#f0eae1]">
            AI
          </span>
        </button>
      )}

      {/* Slide-Over Side Chat Window (Right Side of Overview, Freely Resizable) */}
      {isCopilotOpen && (
        <div
          style={{ resize: 'both', overflow: 'auto', minWidth: '340px', minHeight: '480px', maxWidth: '900px', maxHeight: '90vh' }}
          className="fixed right-4 bottom-4 top-24 w-[440px] h-[680px] z-50 flex flex-col shadow-2xl rounded-3xl border border-[#f0eae1] bg-white animate-in slide-in-from-right duration-300"
        >
          <ViewCopilot
            data={data}
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
            mode="copilot"
            messages={messages}
            setMessages={setMessages}
            onClose={() => setIsCopilotOpen(false)}
          />
        </div>
      )}

    </div>
  );
}
