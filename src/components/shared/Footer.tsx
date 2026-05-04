"use client";
import Link from "next/link";
import { Pill, Mail, Phone, MapPin } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#02040a] border-t border-white/10 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 text-2xl font-black italic text-white mb-4">
            <Pill className="text-emerald-500" size={28} /> MEDI<span className="text-emerald-500">STORE</span>
          </div>
          <p className="text-sm text-slate-400">Your trusted online pharmacy.</p>
        </div>

        <div>
          <h3 className="text-white font-bold mb-4 uppercase text-sm">Quick Links</h3>
          <ul className="flex flex-col gap-2 text-sm text-slate-400">
            <li><Link href="/" className="hover:text-emerald-500">Home</Link></li>
            <li><Link href="/shop" className="hover:text-emerald-500">Shop</Link></li>
            <li><Link href="/cart" className="hover:text-emerald-500">Cart</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-4 uppercase text-sm">Support</h3>
          <ul className="flex flex-col gap-2 text-sm text-slate-400">
            {/* Page gula ekhono banano hoyni bole href="#" hoyeche */}
            <li><Link href="#" className="hover:text-emerald-500">Contact Us</Link></li>
            <li><Link href="#" className="hover:text-emerald-500">About Us</Link></li>
            <li><Link href="#" className="hover:text-emerald-500">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-emerald-500">Terms & Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-4 uppercase text-sm">Contact</h3>
          <div className="flex flex-col gap-3 text-sm text-slate-400">
            <p className="flex items-center gap-2"><MapPin size={16} /> Dhaka, Bangladesh</p>
            <p className="flex items-center gap-2"><Phone size={16} /> +880 1234-567890</p>
          </div>
        </div>
      </div>
    </footer>
  );
}