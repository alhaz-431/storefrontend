"use client";

import { useState, useEffect } from "react";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import Categories from "@/components/home/Categories";
import WhyChoose from "@/components/home/WhyChoose";
import HowItWorks from "@/components/home/HowItWorks";
import Features from "@/components/home/Features";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";
import MedicineList, { Medicine } from "@/components/medicines/MedicineList"; // ✅ সঠিক পাথ
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function HomePage() {
  // ✅ এখন আর 'never[]' এরর আসবে না, কারণ টাইপ ইম্পোর্ট করা হয়েছে
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch(
          "https://storemedistore.onrender.com/api/v1/medicines"
        );
        const resData = await response.json();
        const finalData = resData?.data || resData;
        setMedicines(Array.isArray(finalData) ? finalData : []);
      } catch (error) {
        console.error("Error fetching medicines:", error);
        setMedicines([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  return (
    <main className="w-full overflow-x-hidden bg-white">
      <Hero />
      <Stats stats={{ users: 15000, medicines: 5000, orders: 25000, rating: 4.9 }} />

      <section className="py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-black text-gray-800 mb-8">
            Popular Medicines
          </h2>

          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : medicines.length > 0 ? (
            <MedicineList medicines={medicines} />
          ) : (
            <div className="text-center py-10 text-gray-500 font-bold">
              No medicines found at the moment.
            </div>
          )}
        </div>
      </section>

      <Categories />
      <WhyChoose />
      <HowItWorks />
      <Features />
      <Testimonials />
      <CTA />
    </main>
  );
}