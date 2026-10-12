'use client';

import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Sparkles, AlertTriangle, CheckCircle2, ArrowUpDown } from 'lucide-react';

interface CustomerTableProps {
  data: any[];
  onSelectForCopilot: (customer: any) => void;
  showCuisine: boolean;
}

export default function CustomerTable({ data, onSelectForCopilot, showCuisine }: CustomerTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('DEFAULT');
  const [currentPage, setCurrentPage] = useState(1);
  const [showRatingTooltip, setShowRatingTooltip] = useState(false);
  const itemsPerPage = 20; // 20 records per page for smooth performance

  // Filter logic
  const filteredData = data.filter((item) => {
    const matchesSearch =
      String(item.CustomerID).includes(searchTerm) ||
      (showCuisine && item.PreferredCuisine?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.DiningOccasion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Gender?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Sort logic
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === 'WAIT_TIME') {
      return (b.WaitTime || 0) - (a.WaitTime || 0);
    }
    if (sortBy === 'SPEND') {
      return (b.AverageSpend || 0) - (a.AverageSpend || 0);
    }
    if (sortBy === 'SERVICE_RATING') {
      return (a.ServiceRating || 0) - (b.ServiceRating || 0);
    }
    // DEFAULT
    return (a.CustomerID || 0) - (b.CustomerID || 0);
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="bg-white border border-[#f0eae1] rounded-2xl shadow-xs overflow-visible">
      {/* Table Header & Toolbar */}
      <div className="p-5 border-b border-[#f0eae1] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Customer Dining Records Explorer
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Explore real dining records and trigger AI incident intelligence</p>
        </div>

        {/* Toolbar: Search & Sort By */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search exact ID or cuisine..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#fcfbf9] border border-[#f0eae1] rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#e05a33] w-56 sm:w-64 font-mono transition-all"
            />
          </div>

          <div className="relative">
            <div className="flex items-center gap-1.5 bg-[#fcfbf9] border border-[#f0eae1] rounded-xl px-3 py-2 text-xs text-slate-700 font-medium hover:bg-[#f8f5ee] transition-all cursor-pointer">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent focus:outline-none cursor-pointer text-slate-800 font-medium"
              >
                <option value="DEFAULT">Sort: ID (Default)</option>
                <option value="WAIT_TIME">Sort: Longest Wait Time</option>
                <option value="SPEND">Sort: Highest Spend</option>
                <option value="SERVICE_RATING">Sort: Lowest Service Rating</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table with overflow-visible to ensure tooltip is never clipped */}
      <div className="overflow-visible">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#f8f5ee]/80 text-slate-600 border-b border-[#f0eae1] font-semibold relative">
              <th className="py-3 px-4">Customer ID</th>
              <th className="py-3 px-4">Demographics</th>
              <th className="py-3 px-4">{showCuisine ? 'Cuisine & Occasion' : 'Occasion'}</th>
              <th className="py-3 px-4">Frequency &amp; Time</th>
              <th className="py-3 px-4">AvgSpend</th>
              <th className="py-3 px-4">Wait Time</th>
              <th
                className="py-3 px-4 relative select-none cursor-pointer"
                onMouseEnter={() => setShowRatingTooltip(true)}
                onMouseLeave={() => setShowRatingTooltip(false)}
              >
                Ratings (S/F/A)
                {showRatingTooltip && (
                  <div className="absolute z-50 left-4 top-full mt-1 w-48 bg-white/95 backdrop-blur-md border border-[#f0eae1] text-slate-900 text-[11px] rounded-xl p-3 shadow-2xl space-y-1 font-sans animate-in fade-in duration-200 pointer-events-none">
                    <div className="font-bold border-b border-[#f0eae1] pb-1 mb-1 text-[#e05a33]">Rating Breakdown</div>
                    <div><strong>S</strong>: ServiceRating</div>
                    <div><strong>F</strong>: FoodRating</div>
                    <div><strong>A</strong>: AmbianceRating</div>
                  </div>
                )}
              </th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">AI Analyse</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f5f0e8] text-slate-700">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  No matching real CSV customer records found.
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr key={row.CustomerID} className="hover:bg-[#fcfbf9] transition-colors group">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    #{row.CustomerID}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{row.Age} yrs, {row.Gender}</div>
                    <div className="text-[10px] text-slate-400">Income: ${row.Income?.toLocaleString()}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{showCuisine ? `${row.PreferredCuisine}, ${row.DiningOccasion}, ${row.MealType}` : `${row.DiningOccasion}, ${row.MealType}`}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{row.VisitFrequency || 'Weekly'}, {row.TimeOfVisit || row.MealType || 'Breakfast'}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">
                    ${row.AverageSpend?.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-lg font-medium inline-block ${
                      row.WaitTime > 40 ? 'bg-rose-50 text-rose-700 border border-rose-200 font-semibold' : 'bg-[#f8f5ee] text-slate-700'
                    }`}>
                      {Number(row.WaitTime).toFixed(2)}m
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 font-mono text-[11px] font-medium">
                      <span className="text-amber-600 font-bold">★ {row.ServiceRating}</span>
                      <span className="text-slate-300">/</span>
                      <span className="text-slate-600">{row.FoodRating}</span>
                      <span className="text-slate-300">/</span>
                      <span className="text-slate-600">{row.AmbianceRating}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {row.HighSatisfaction === 1 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Satisfied
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
                        <AlertTriangle className="w-3 h-3 text-rose-600" /> Churn Risk
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectForCopilot(row)}
                      title="AI Analyse"
                      className="inline-flex items-center justify-center p-2.5 bg-[#e05a33] hover:bg-[#cf4e28] hover:shadow-sm text-white rounded-xl transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-[#f0eae1] flex items-center justify-between text-xs text-slate-500">
        <div>
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, sortedData.length)} to{' '}
          {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} entries
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-[#f8f5ee] text-slate-700 hover:bg-[#f4ebe1] hover:shadow-2xs transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-slate-700">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1.5 rounded-lg bg-[#f8f5ee] text-slate-700 hover:bg-[#f4ebe1] hover:shadow-2xs transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
