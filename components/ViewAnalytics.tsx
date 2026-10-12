'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Users,
  AlertTriangle,
  Clock,
  DollarSign,
  Filter,
  RefreshCw,
  Sparkles,
  Activity,
  Award,
  Smile,
  Frown,
  Meh,
  X,
  ShieldAlert,
  AlertOctagon
} from 'lucide-react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import CustomerTable from './CustomerTable';

interface ViewAnalyticsProps {
  data: any[];
  selectedCustomer: any | null;
  setSelectedCustomer: (customer: any | null) => void;
  onSelectForCopilot: (customer: any) => void;
  showCuisine: boolean;
  setShowCuisine: (show: boolean) => void;
}

export default function ViewAnalytics({
  data,
  selectedCustomer,
  setSelectedCustomer,
  onSelectForCopilot,
  showCuisine
}: ViewAnalyticsProps) {
  // Filter states
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [diningOccasion, setDiningOccasion] = useState<string>('ALL');
  const [mealType, setMealType] = useState<string>('ALL');

  const [satisfactionStatus, setSatisfactionStatus] = useState<string>('ALL');
  const [loyaltyFilter, setLoyaltyFilter] = useState<string>('ALL');
  const [maxWaitTime, setMaxWaitTime] = useState<number>(60);

  // Slide-over AI Diagnostic state
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<any | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const fetchDiagnostic = async (cust: any) => {
    setLoadingAi(true);
    setAiError(null);
    try {
      const res = await fetch('/api/gemini/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer: cust }),
      });
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || 'AI diagnostic failed');
      }
      setAiResult(json.result);
    } catch (err: any) {
      setAiError(err.message || 'Failed to connect to AI Retention Copilot');
    } finally {
      setLoadingAi(false);
    }
  };

  const handleSelectCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    fetchDiagnostic(customer);
  };

  const handleCloseDrawer = () => {
    setSelectedCustomer(null);
    setAiResult(null);
    setAiError(null);
  };

  // Toggle cuisine filter
  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]
    );
  };

  // Filtered dataset
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (showCuisine && selectedCuisines.length > 0 && !selectedCuisines.includes(item.PreferredCuisine)) {
        return false;
      }
      if (diningOccasion !== 'ALL' && item.DiningOccasion !== diningOccasion) {
        return false;
      }
      if (mealType !== 'ALL' && item.MealType !== mealType) {
        return false;
      }
      if (satisfactionStatus === 'SATISFIED' && item.HighSatisfaction !== 1) return false;
      if (satisfactionStatus === 'CHURN_RISK' && item.HighSatisfaction !== 0) return false;
      if (loyaltyFilter === 'MEMBERS' && item.LoyaltyProgramMember !== 1) return false;
      if (loyaltyFilter === 'NON_MEMBERS' && item.LoyaltyProgramMember !== 0) return false;
      if (item.WaitTime > maxWaitTime) return false;

      return true;
    });
  }, [data, showCuisine, selectedCuisines, diningOccasion, mealType, satisfactionStatus, loyaltyFilter, maxWaitTime]);

  // KPI Calculations
  const totalResponses = filteredData.length;
  const positiveCount = filteredData.filter((d) => d.HighSatisfaction === 1).length;
  const negativeCount = filteredData.filter(
    (d) =>
      d.HighSatisfaction === 0 &&
      (d.FoodRating + d.ServiceRating + d.AmbianceRating) / 3 < 3.0
  ).length;
  const neutralCount = Math.max(0, totalResponses - positiveCount - negativeCount);

  const positivePct = totalResponses > 0 ? ((positiveCount / totalResponses) * 100).toFixed(1) : '0.0';
  const negativePct = totalResponses > 0 ? ((negativeCount / totalResponses) * 100).toFixed(1) : '0.0';
  const neutralPct = totalResponses > 0 ? ((neutralCount / totalResponses) * 100).toFixed(1) : '0.0';

  // Chart 1 Data
  const scatterData = filteredData.slice(0, 300).map((i) => ({
    waitTime: Number(i.WaitTime).toFixed(2),
    serviceRating: i.ServiceRating,
    spend: i.AverageSpend,
    satisfaction: i.HighSatisfaction === 1 ? 'Satisfied' : 'Churn Risk',
    id: i.CustomerID,
  }));

  // Chart 2 Data
  const occasionMap: { [key: string]: { occasion: string; satisfied: number; churnRisk: number } } = {};
  filteredData.forEach((i) => {
    const occ = i.DiningOccasion || 'Unknown';
    if (!occasionMap[occ]) {
      occasionMap[occ] = { occasion: occ, satisfied: 0, churnRisk: 0 };
    }
    if (i.HighSatisfaction === 1) occasionMap[occ].satisfied += 1;
    else occasionMap[occ].churnRisk += 1;
  });
  const occasionChartData = Object.values(occasionMap);

  // Chart 3 Data
  const cuisineMap: { [key: string]: { cuisine: string; totalSpend: number; count: number; churnCount: number } } = {};
  filteredData.forEach((i) => {
    const cuis = i.PreferredCuisine || 'Other';
    if (!cuisineMap[cuis]) {
      cuisineMap[cuis] = { cuisine: cuis, totalSpend: 0, count: 0, churnCount: 0 };
    }
    cuisineMap[cuis].totalSpend += i.AverageSpend || 0;
    cuisineMap[cuis].count += 1;
    if (i.HighSatisfaction === 0) cuisineMap[cuis].churnCount += 1;
  });
  const cuisineChartData = Object.values(cuisineMap).map((c) => ({
    cuisine: c.cuisine,
    avgSpend: Math.round(c.totalSpend / (c.count || 1)),
    churnRatePct: c.count > 0 ? Number(((c.churnCount / c.count) * 100).toFixed(1)) : 0,
  }));

  const resetFilters = () => {
    setSelectedCuisines([]);
    setDiningOccasion('ALL');
    setMealType('ALL');
    setSatisfactionStatus('ALL');
    setLoyaltyFilter('ALL');
    setMaxWaitTime(60);
  };

  return (
    <div className="space-y-6 pb-12 relative">
      
      {/* Top Unified Customer Satisfaction KPI Card Container */}
      <div className="bg-white border border-[#f0eae1] rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Customer Satisfaction Intelligence
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
          
          {/* 1. Response Received */}
          <div className="flex items-center gap-4 bg-[#fcfbf9] p-4 rounded-xl border border-[#f0eae1]">
            <div className="w-11 h-11 rounded-full bg-[#faedd9] text-[#b45309] flex items-center justify-center flex-shrink-0 shadow-2xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Response Received</p>
              <h4 className="text-xl font-bold text-slate-900 mt-0.5">{totalResponses.toLocaleString()}</h4>
            </div>
          </div>

          {/* 2. Positive */}
          <div className="flex items-center gap-4 bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/60">
            <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
              <Smile className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-emerald-700 font-medium">Positive</p>
              <h4 className="text-xl font-bold text-emerald-700 mt-0.5">{positivePct}% <span className="text-xs font-normal text-emerald-600">({positiveCount})</span></h4>
            </div>
          </div>

          {/* 3. Negative */}
          <div className="flex items-center gap-4 bg-rose-50/60 p-4 rounded-xl border border-rose-200/60">
            <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
              <Frown className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-rose-700 font-medium">Negative (High Risk)</p>
              <h4 className="text-xl font-bold text-rose-700 mt-0.5">{negativePct}% <span className="text-xs font-normal text-rose-600">({negativeCount})</span></h4>
            </div>
          </div>

          {/* 4. Neutral */}
          <div className="flex items-center gap-4 bg-amber-50/60 p-4 rounded-xl border border-amber-200/60">
            <div className="w-11 h-11 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 shadow-2xs">
              <Meh className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-amber-800 font-medium">Neutral (Potential Risk)</p>
              <h4 className="text-xl font-bold text-amber-800 mt-0.5">{neutralPct}% <span className="text-xs font-normal text-amber-700">({neutralCount})</span></h4>
            </div>
          </div>

        </div>
      </div>

      {/* Enhanced Diagnostic Filter Parameters */}
      <div className="bg-white border border-[#f0eae1] rounded-2xl p-5 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#e05a33]" />
            <h3 className="text-sm font-bold text-slate-900">Diagnostic Filter Parameters</h3>
          </div>
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 transition-colors font-medium cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        </div>

        {/* Row 1 */}
        <div className={`grid grid-cols-1 ${showCuisine ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 pt-3 border-t border-[#f0eae1] items-center`}>
          {showCuisine && (
            <div className="space-y-1.5 md:col-span-1">
              <label className="text-xs font-semibold text-slate-700 block">Preferred Cuisine</label>
              <div className="flex flex-wrap gap-1.5">
                {['Chinese', 'American', 'Indian', 'Mexican', 'Italian'].map((c) => {
                  const selected = selectedCuisines.includes(c);
                  return (
                    <button
                      key={c}
                      onClick={() => toggleCuisine(c)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selected
                          ? 'bg-[#e05a33] text-white shadow-xs'
                          : 'bg-[#f8f5ee] text-slate-600 hover:bg-[#f4ebe1] border border-[#f0eae1]'
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Dining Occasion</label>
            <select
              value={diningOccasion}
              onChange={(e) => setDiningOccasion(e.target.value)}
              className="w-full bg-[#fcfbf9] border border-[#f0eae1] rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#e05a33] font-medium cursor-pointer"
            >
              <option value="ALL">All Occasions</option>
              <option value="Casual">Casual</option>
              <option value="Business">Business</option>
              <option value="Celebration">Celebration</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Meal Type</label>
            <div className="inline-flex bg-[#f8f5ee] p-1 rounded-xl border border-[#f0eae1] w-full">
              {['ALL', 'Dine-in', 'Takeaway'].map((type) => (
                <button
                  key={type}
                  onClick={() => setMealType(type)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    mealType === type ? 'bg-[#e05a33] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-[#f0eae1]'
                  }`}
                >
                  {type === 'ALL' ? 'All Types' : type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#f0eae1] items-center">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Satisfaction Status</label>
            <select
              value={satisfactionStatus}
              onChange={(e) => setSatisfactionStatus(e.target.value)}
              className="w-full bg-[#fcfbf9] border border-[#f0eae1] rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#e05a33] font-medium cursor-pointer"
            >
              <option value="ALL">All Customers</option>
              <option value="SATISFIED">High Satisfaction [1]</option>
              <option value="CHURN_RISK">Churn Risk [0]</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Loyalty Program</label>
            <div className="inline-flex bg-[#f8f5ee] p-1 rounded-xl border border-[#f0eae1] w-full">
              {[
                { label: 'All', value: 'ALL' },
                { label: 'Members', value: 'MEMBERS' },
                { label: 'Non-Members', value: 'NON_MEMBERS' }
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setLoyaltyFilter(item.value)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    loyaltyFilter === item.value ? 'bg-[#e05a33] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-[#f0eae1]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">Max Wait Time Threshold</span>
              <span className="font-bold text-[#e05a33] bg-[#faedd9] px-2 py-0.5 rounded-md border border-[#f4dbb8]">
                {maxWaitTime} mins
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={60}
              step={1}
              value={maxWaitTime}
              onChange={(e) => setMaxWaitTime(Number(e.target.value))}
              className="w-full accent-[#e05a33] cursor-pointer pt-2"
            />
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className={`grid grid-cols-1 ${showCuisine ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6`}>
        
        {/* Chart 1 */}
        <div className="bg-white border border-[#f0eae1] rounded-2xl p-5 shadow-xs flex flex-col">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#e05a33]" />
              Wait Time vs. Service Rating Correlation
            </h4>
            <p className="text-xs text-slate-500">Correlating table wait delay with staff service scores</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0eae1" opacity={0.8} />
                <XAxis dataKey="waitTime" name="Wait Time" unit="m" stroke="#64748b" fontSize={10} />
                <YAxis dataKey="serviceRating" name="Service Rating" domain={[1, 5]} stroke="#64748b" fontSize={10} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#f0eae1', borderRadius: '0.75rem', fontSize: '11px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Scatter name="Customers" data={scatterData} fill="#e05a33">
                  {scatterData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.satisfaction === 'Satisfied' ? '#10b981' : '#f43f5e'}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-4 mt-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-600 font-medium">Satisfied</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-slate-600 font-medium">Churn Risk</span>
            </div>
          </div>
        </div>

        {/* Chart 2 */}
        <div className="bg-white border border-[#f0eae1] rounded-2xl p-5 shadow-xs flex flex-col">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              Satisfaction by Dining Occasion
            </h4>
            <p className="text-xs text-slate-500">Comparing outcomes across business, casual, &amp; celebrations</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occasionChartData} margin={{ top: 10, right: 10, bottom: 10, left: -25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0eae1" opacity={0.8} />
                <XAxis dataKey="occasion" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#f0eae1', borderRadius: '0.75rem', fontSize: '11px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="satisfied" name="Satisfied" fill="#10b981" stackId="a" radius={[0, 0, 4, 4]} />
                <Bar dataKey="churnRisk" name="Churn Risk" fill="#f43f5e" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-4 mt-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-600 font-medium">Satisfied</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-slate-600 font-medium">Churn Risk</span>
            </div>
          </div>
        </div>

        {/* Chart 3 */}
        {showCuisine && (
          <div className="bg-white border border-[#f0eae1] rounded-2xl p-5 shadow-xs flex flex-col">
            <div className="mb-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Cuisine Economics &amp; Churn %
              </h4>
              <p className="text-xs text-slate-500">Average spend &amp; dissatisfaction rate by preferred cuisine</p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cuisineChartData} margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0eae1" opacity={0.8} />
                  <XAxis dataKey="cuisine" stroke="#64748b" fontSize={10} />
                  <YAxis yAxisId="left" stroke="#64748b" fontSize={10} />
                  <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={10} unit="%" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#f0eae1', borderRadius: '0.75rem', fontSize: '11px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar yAxisId="left" dataKey="avgSpend" name="Avg Spend ($)" fill="#e05a33" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="churnRatePct" name="Churn Rate (%)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#e05a33]" />
                <span className="text-slate-600 font-medium">Avg Spend ($)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-slate-600 font-medium">Churn %</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Searchable Customer Table */}
      <CustomerTable data={filteredData} onSelectForCopilot={handleSelectCustomer} showCuisine={showCuisine} />

      {/* Slide-Over Drawer for AI Incident Diagnostics */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xs transition-opacity"
            onClick={handleCloseDrawer}
          />

          {/* Drawer Panel (~45% width from right) */}
          <div className="absolute inset-y-0 right-0 max-w-xl w-full bg-white shadow-2xl border-l border-[#f0eae1] z-50 flex flex-col overflow-y-auto">
            
            {/* Drawer Header */}
            <div className="p-6 bg-[#f8f5ee] border-b border-[#f0eae1] flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#faedd9] text-[#e05a33] flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5 text-[#e05a33]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Customer #{selectedCustomer.CustomerID} Incident Intelligence
                  </h3>
                </div>
              </div>
              <button
                onClick={handleCloseDrawer}
                className="w-8 h-8 rounded-full bg-white border border-[#f0eae1] text-slate-600 hover:text-slate-900 hover:bg-[#f4ebe1] hover:shadow-2xs flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 space-y-6 flex-1">

              {/* Clean Unified Customer Summary Card */}
              <div className="bg-[#fcfbf9] border border-[#f0eae1] rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-white text-slate-900 border border-[#f0eae1] font-bold">
                    Customer #{selectedCustomer.CustomerID}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    selectedCustomer.HighSatisfaction === 1
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {selectedCustomer.HighSatisfaction === 1 ? 'Satisfied' : 'Churn Risk'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-[#f0eae1]">
                    <span className="text-slate-400 block text-[10px] font-semibold">Demographics</span>
                    <span className="font-bold text-slate-800">{selectedCustomer.Age} yrs, {selectedCustomer.Gender}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-[#f0eae1]">
                    <span className="text-slate-400 block text-[10px] font-semibold">AvgSpend</span>
                    <span className="font-bold text-emerald-600">${selectedCustomer.AverageSpend?.toFixed(2)}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-[#f0eae1]">
                    <span className="text-slate-400 block text-[10px] font-semibold">Wait Time</span>
                    <span className="font-bold text-amber-600">{Number(selectedCustomer.WaitTime).toFixed(2)}m</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-[#f0eae1]">
                    <span className="text-slate-400 block text-[10px] font-semibold">Ratings (S/F/A)</span>
                    <span className="font-mono font-bold text-slate-800">★ {selectedCustomer.ServiceRating} / {selectedCustomer.FoodRating} / {selectedCustomer.AmbianceRating}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1 border-t border-[#f0eae1]">
                  <div className="bg-white p-2.5 rounded-xl border border-[#f0eae1]">
                    <span className="text-slate-400 block text-[10px] font-semibold">{showCuisine ? 'Cuisine & Occasion' : 'Occasion'}</span>
                    <span className="font-bold text-slate-800">{showCuisine ? `${selectedCustomer.PreferredCuisine}, ${selectedCustomer.DiningOccasion}, ${selectedCustomer.MealType}` : `${selectedCustomer.DiningOccasion}, ${selectedCustomer.MealType}`}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-[#f0eae1]">
                    <span className="text-slate-400 block text-[10px] font-semibold">Frequency &amp; Time</span>
                    <span className="font-bold text-slate-800">{selectedCustomer.VisitFrequency || 'Weekly'}, {selectedCustomer.TimeOfVisit || selectedCustomer.MealType || 'Breakfast'}</span>
                  </div>
                </div>
              </div>

              {/* Loading AI State */}
              {loadingAi && (
                <div className="bg-white border border-[#f0eae1] rounded-2xl p-12 text-center space-y-3 shadow-xs">
                  <div className="w-10 h-10 bg-[#faedd9] text-[#e05a33] rounded-full flex items-center justify-center mx-auto animate-pulse border border-[#f4dbb8]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Running AI Incident Diagnostics...</h4>
                  <p className="text-xs text-slate-500">Cross-referencing true wait times and ratings against enterprise retention dataset.</p>
                </div>
              )}

              {/* AI Error State */}
              {aiError && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-700 text-xs">
                  <div className="font-bold flex items-center gap-2 mb-1">
                    <AlertOctagon className="w-4 h-4 text-rose-600" />
                    AI Diagnostic Error
                  </div>
                  {aiError}
                </div>
              )}

              {/* AI Result Report (Only Incident Severity & Operational Root Cause) */}
              {aiResult && !loadingAi && (
                <div className="space-y-4">
                  
                  {/* 1. Incident Severity Badge */}
                  <div className="bg-white border border-[#f0eae1] rounded-2xl p-4 shadow-xs flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-semibold">Incident Severity</span>
                    <span className={`px-3 py-1 rounded-xl text-xs font-extrabold tracking-wide uppercase border inline-flex items-center gap-1.5 ${
                      aiResult.retention_risk_level === 'CRITICAL'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : aiResult.retention_risk_level === 'HIGH'
                        ? 'bg-orange-50 text-orange-700 border-orange-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      <ShieldAlert className="w-3.5 h-3.5" />
                      {aiResult.retention_risk_level}
                    </span>
                  </div>

                  {/* 2. Operational Root Cause */}
                  <div className="bg-white border border-[#f0eae1] rounded-2xl p-4 shadow-xs space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <AlertOctagon className="w-4 h-4 text-amber-600" />
                      Operational Root Cause
                    </h4>
                    <div className="bg-[#fcfbf9] p-3 rounded-xl border border-[#f0eae1] space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Primary Bottleneck:</span>
                        <p className="text-rose-600 font-bold text-sm mt-0.5">
                          {aiResult.failure_point}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#f0eae1]">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Key Diagnostic Highlights:</span>
                        <ul className="space-y-1.5 text-slate-700 font-medium">
                          {Array.isArray(aiResult.metrics_analysis) ? (
                            aiResult.metrics_analysis.map((item: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-[#e05a33] font-bold">•</span>
                                <span>{item}</span>
                              </li>
                            ))
                          ) : (
                            <li className="flex items-start gap-2">
                              <span className="text-[#e05a33] font-bold">•</span>
                              <span>{aiResult.metrics_analysis}</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-[#f8f5ee] border-t border-[#f0eae1] text-right">
              <button
                onClick={handleCloseDrawer}
                className="px-5 py-2 bg-[#f0eae1] hover:bg-[#e4d9cc] text-slate-800 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
