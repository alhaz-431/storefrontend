"use client";
import { FiPhone, FiMail, FiClock } from "react-icons/fi";

export default function ContactBar() {
  return (
    <section className="py-6 md:py-8 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0"><FiPhone size={18} /></div>
            <div><p className="text-xs text-gray-400">Call Us</p><p className="font-bold text-sm md:text-base">+880 1700-000000</p></div>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0"><FiMail size={18} /></div>
            <div><p className="text-xs text-gray-400">Email</p><p className="font-bold text-sm md:text-base">support@medistore.com</p></div>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-3 sm:col-span-2 lg:col-span-1">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0"><FiClock size={18} /></div>
            <div><p className="text-xs text-gray-400">Working Hours</p><p className="font-bold text-sm md:text-base">24/7 Available</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}