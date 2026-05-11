"use client";

import { useEffect, useState } from "react";

// ✅ ১. কার্ট আইটেমের টাইপ (ইমেজ এবং এক্সট্রা ডাটা হ্যান্ডেল করার জন্য)
type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string | null; 
  category?: { name: string };
  [key: string]: any; 
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // ✅ ২. পেজ লোড হওয়ার সময় localStorage থেকে ডাটা আনা
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("medistore_cart");
      if (savedCart) {
        const parsedData = JSON.parse(savedCart);
        setCartItems(Array.isArray(parsedData) ? parsedData : []);
      }
    } catch (error) {
      console.error("Cart Loading Error:", error);
      setCartItems([]);
    }
  }, []);

  return (
    <div className="p-6 lg:p-20 max-w-7xl mx-auto text-white min-h-screen">
      <h2 className="text-3xl font-black uppercase mb-8 tracking-tighter">My Shopping Cart</h2>
      
      {cartItems.length === 0 ? (
        <div className="bg-white/5 border border-white/10 p-10 rounded-[32px] text-center">
          <p className="text-slate-400">Your cart is currently empty.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {cartItems.map((item, index) => (
            <div 
              key={item.id || index} 
              className="bg-white/5 border border-white/10 p-4 md:p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 hover:border-emerald-500/30 transition-all"
            >
              <div className="flex items-center gap-4 w-full">
                {/* ✅ ৩. ইমেজ সেকশন (যদি ইমেজ না থাকে তবে placeholder দেখাবে) */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/10 flex-shrink-0 border border-white/5">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500 text-center p-2 uppercase">
                      No Photo
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-emerald-500 text-sm font-semibold">Qty: {item.quantity}</p>
                    {item.category?.name && (
                      <span className="text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded-full text-emerald-400 border border-emerald-500/20">
                        {item.category.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right w-full md:w-auto border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                <p className="font-mono font-bold text-xl">৳{Number(item.price) * Number(item.quantity)}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">৳{item.price} each</p>
              </div>
            </div>
          ))}
          
          {/* ✅ ৪. টোটাল এবং চেকআউট বাটন */}
          <div className="mt-8 p-8 bg-white/5 border border-white/10 rounded-3xl shadow-2xl">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Subtotal Amount</span>
                <span className="text-3xl font-black text-emerald-500">
                  ৳{cartItems.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0)}
                </span>
              </div>
              <button className="w-full mt-6 bg-emerald-500 hover:bg-emerald-400 text-black font-black py-4 rounded-xl transition-all uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                Proceed to Checkout
              </button>
          </div>
        </div>
      )}
    </div>
  );
}