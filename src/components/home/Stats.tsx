"use client";
import { motion } from "framer-motion";
import { FiUsers, FiPackage, FiCheckCircle, FiStar } from "react-icons/fi";

export default function Stats({ stats }: any) {
  return (
    <section className="py-8 md:py-12 bg-white border-y border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {[
            { value: stats.users.toLocaleString() + '+', label: 'Happy Customers', icon: <FiUsers /> },
            { value: stats.medicines.toLocaleString() + '+', label: 'Medicines', icon: <FiPackage /> },
            { value: stats.orders.toLocaleString() + '+', label: 'Orders Delivered', icon: <FiCheckCircle /> },
            { value: stats.rating + '/5', label: 'Customer Rating', icon: <FiStar /> }
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-2xl mb-2 md:mb-3 text-emerald-600">{stat.icon}</div>
              <div className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-1">{stat.value}</div>
              <p className="text-gray-600 font-semibold text-xs md:text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}