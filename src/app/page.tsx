import Hero from "@/components/Hero";
import MedicineList from "@/components/MedicineList"; // এই নতুন ফাইলটি নিচে দিচ্ছি
import { FiTruck, FiShield, FiClock, FiCheckCircle } from "react-icons/fi";

async function getMedicines() {
  try {
    const res = await fetch(`https://storemedistore.onrender.com/api/v1/medicines`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Failed to fetch medicines");
    const data = await res.json();
    return data?.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Home() {
  const medicines = await getMedicines();

  return (
    <div className="pb-20">
      <Hero />

      {/* ২. ফিচার সেকশন - আগের মতোই আছে */}
      <section className="bg-white/5 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <FeatureItem icon={<FiTruck />} title="Fast Delivery" desc="Medicine at your door in 24h" />
          <FeatureItem icon={<FiShield />} title="100% Genuine" desc="Directly from manufacturers" />
          <FeatureItem icon={<FiClock />} title="24/7 Support" desc="Expert pharmacists available" />
          <FeatureItem icon={<FiCheckCircle />} title="Secure Payment" desc="Safe & encrypted checkout" />
        </div>
      </section>

      {/* ৩. সার্চ, ফিল্টার এবং মেডিসিন সেকশন (Client Side Handling) */}
      <MedicineList initialMedicines={medicines} />

      {/* ৪. ট্রাস্ট সেকশন - আগের মতোই আছে */}
      <section className="max-w-7xl mx-auto px-6 mt-32 bg-blue-600 rounded-[40px] p-12 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">
              Order Via <br /> WhatsApp
            </h2>
            <p className="text-blue-100 font-bold mb-8">Can't find your medicine? Just send us a prescription.</p>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all">
               Send Prescription
            </button>
          </div>
          <div className="text-white/20 text-[150px] font-black absolute right-[-20px] bottom-[-40px] rotate-12 select-none">
            MEDI
          </div>
      </section>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-3">
      <div className="text-blue-500 text-3xl mb-2">{icon}</div>
      <h4 className="text-white font-black text-xs uppercase tracking-widest">{title}</h4>
      <p className="text-slate-500 text-[10px] font-bold leading-relaxed">{desc}</p>
    </div>
  );
}