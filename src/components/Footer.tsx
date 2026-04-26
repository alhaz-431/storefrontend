export default function Footer() {
  return (
    <footer className="w-full bg-[#0b0f1a] border-t border-white/5 py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-xl font-black italic text-white uppercase tracking-tighter">
            Medi<span className="text-blue-500">Store</span>
          </h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Trusted Medicine Shop</p>
        </div>
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
          © 2026 MediStore. Built by Alfaz.
        </p>
      </div>
    </footer>
  );
}