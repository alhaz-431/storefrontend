import Hero from "@/components/Hero";
import MedicineCard from "@/components/MedicineCard";
import { FiTruck, FiShield, FiClock, FiCheckCircle } from "react-icons/fi";

// ব্যাকএন্ড থেকে ডাটা আনার ফাংশন
async function getMedicines() {
  try {
    const res = await fetch(`https://storemedistore.onrender.com/api/v1/medicines`, {
      next: { revalidate: 60 }, // প্রতি ৬০ সেকেন্ড পর ডাটা আপডেট হবে
    });
    if (!res.ok) throw new Error("Failed to fetch medicines");
    const data = await res.json();
    return data?.data || []; // আপনার API এর স্ট্রাকচার অনুযায়ী ডাটা রিটার্ন
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Home() {
  const medicines = await getMedicines();

  return (
    <div className="pb-20">
      {/* ১. হিরো সেকশন */}
      <Hero />

      {/* ২. ফিডব্যাক বা ফিচার সেকশন (MediStore Related Features) */}
      <section className="bg-white/5 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <FeatureItem icon={<FiTruck />} title="Fast Delivery" desc="Medicine at your door in 24h" />
          <FeatureItem icon={<FiShield />} title="100% Genuine" desc="Directly from manufacturers" />
          <FeatureItem icon={<FiClock />} title="24/7 Support" desc="Expert pharmacists available" />
          <FeatureItem icon={<FiCheckCircle />} title="Secure Payment" desc="Safe & encrypted checkout" />
        </div>
      </section>

      {/* ৩. ব্যাকএন্ড থেকে আসা মেডিসিন সেকশন */}
      <section className="max-w-7xl mx-auto px-6 mt-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em]">Our Pharmacy</span>
            <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter">
              Latest <span className="text-blue-600">Arrivals</span>
            </h2>
          </div>
          <button className="text-blue-500 text-xs font-black uppercase tracking-widest hover:text-white transition-all">
            Explore All Store
          </button>
        </div>

        {/* যদি ডাটা থাকে তবে কার্ড দেখাবে, না থাকলে মেসেজ */}
        {medicines.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {medicines.slice(0, 8).map((med: any) => (
              <MedicineCard key={med._id || med.id} medicine={med} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
            <p className="text-slate-500 font-bold italic uppercase tracking-widest">
              Connecting to Backend... No medicines found.
            </p>
          </div>
        )}
      </section>

      {/* ৪. ট্রাস্ট সেকশন (অতিরিক্ত বড় করার জন্য) */}
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

// ফিচার আইটেম সাব-কম্পোনেন্ট
function FeatureItem({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-3">
      <div className="text-blue-500 text-3xl mb-2">{icon}</div>
      <h4 className="text-white font-black text-xs uppercase tracking-widest">{title}</h4>
      <p className="text-slate-500 text-[10px] font-bold leading-relaxed">{desc}</p>
    </div>
  );
}