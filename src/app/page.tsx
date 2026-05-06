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
import MedicineList from "@/components/medicines/MedicineList";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function HomePage() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  // API থেকে ডেটা আনার লজিক
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch("https://storemedistore.onrender.com/api/v1/medicines");
        const data = await response.json();
        setMedicines(data); 
      } catch (error) {
        console.error("Error fetching medicines:", error);
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
    <h2 className="text-3xl font-black text-gray-800 mb-8">Popular Medicines</h2>
    
   
    <MedicineList /> 
    
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