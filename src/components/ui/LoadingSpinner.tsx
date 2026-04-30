"use client";
import { motion } from "framer-motion";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-10 min-h-[300px]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ 
          repeat: Infinity, 
          duration: 1, 
          ease: "linear" 
        }}
        className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full shadow-lg"
      />
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-emerald-600 font-bold text-sm tracking-widest uppercase"
      >
        Loading...
      </motion.p>
    </div>
  );
}