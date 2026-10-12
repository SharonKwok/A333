import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fbf9f6] flex items-center justify-center p-4 font-sans">
      <div className="bg-white border border-[#f0eae1] rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-xl">
        <h2 className="text-xl font-bold text-slate-900">Page Not Found</h2>
        <p className="text-xs text-slate-500">The page you are looking for does not exist or has been moved.</p>
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-[#e05a33] hover:bg-[#cf4e28] text-white rounded-xl text-xs font-semibold transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
