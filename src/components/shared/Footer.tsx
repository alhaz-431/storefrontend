"use client";

import Link from "next/link";
import { Pill, Mail, Phone, MapPin } from "lucide-react"; // সাধারণ আইকনগুলোর জন্য
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa"; // সোশ্যাল আইকনের জন্য

export default function Footer() {
  return (
    <footer className="bg-[#02040a] border-t border-white/10 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">
        
        {/* Logo + About */}
        <div>
          <div className="flex items-center gap-2 text-2xl font-black italic text-white mb-4">
            <Pill className="text-emerald-500" size={28} />
            MEDI<span className="text-emerald-500">STORE</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Your trusted online pharmacy for genuine medicines, healthcare products, and fast delivery across Bangladesh.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase text-sm">Quick Links</h3>
          <ul className="flex flex-col gap-2 text-sm text-slate-400">
            <li><Link href="/" className="hover:text-emerald-500 transition-colors">Home</Link></li>
            <li><Link href="/shop" className="hover:text-emerald-500 transition-colors">Shop</Link></li>
            <li><Link href="/categories" className="hover:text-emerald-500 transition-colors">Categories</Link></li>
            <li><Link href="/cart" className="hover:text-emerald-500 transition-colors">Cart</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase text-sm">Support</h3>
          <ul className="flex flex-col gap-2 text-sm text-slate-400">
            <li><Link href="/contact" className="hover:text-emerald-500 transition-colors">Contact Us</Link></li>
            <li><Link href="/about" className="hover:text-emerald-500 transition-colors">About Us</Link></li>
            <li><Link href="/privacy" className="hover:text-emerald-500 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-emerald-500 transition-colors">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase text-sm">Contact</h3>
          <div className="flex flex-col gap-3 text-sm text-slate-400">
            <p className="flex items-center gap-2">
              <MapPin size={16} /> Dhaka, Bangladesh
            </p>
            <p className="flex items-center gap-2">
              <Phone size={16} /> +880 1234-567890
            </p>
            <p className="flex items-center gap-2">
              <Mail size={16} /> support@medistore.com
            </p>
          </div>

          {/* Social */}
          <div className="flex gap-4 mt-4 text-white">
            <a href="#" target="_blank" rel="noreferrer" className="hover:text-emerald-500 transition-colors">
              <FaFacebook size={20} />
            </a>
            <a href="#" target="_blank" rel="noreferrer" className="hover:text-emerald-500 transition-colors">
              <FaInstagram size={20} />
            </a>
            <a href="#" target="_blank" rel="noreferrer" className="hover:text-emerald-500 transition-colors">
              <FaTwitter size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 text-center text-xs text-slate-500 py-4">
        © {new Date().getFullYear()} MEDISTORE. All rights reserved.
      </div>
    </footer>
  );
}