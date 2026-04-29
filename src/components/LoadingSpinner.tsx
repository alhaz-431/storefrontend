export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-[#02040a] z-[999] flex items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <div className="mt-4 text-[10px] text-emerald-500 font-black uppercase tracking-[0.4em] text-center animate-pulse">
          Loading...
        </div>
      </div>
    </div>
  );
}