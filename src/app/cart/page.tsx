"use client";

import { useEffect, useState } from "react";

// কার্ট আইটেমের টাইপ
type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // পেজ লোড হওয়ার সময় localStorage থেকে ডাটা আনা
  useEffect(() => {
    const savedCart = localStorage.getItem("medistore_cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  return (
    <div className="p-6 lg:p-20 max-w-7xl mx-auto text-white">
      <h2 className="text-3xl font-black uppercase mb-8">My Shopping Cart</h2>
      
      {cartItems.length === 0 ? (
        <div className="bg-white/5 border border-white/10 p-10 rounded-[32px] text-center">
          <p className="text-slate-400">Your cart is currently empty.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-emerald-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-mono font-bold text-xl">৳{item.price * item.quantity}</p>
            </div>
          ))}
          
          <div className="mt-8 p-6 border-t border-white/10">
             <p className="text-right text-2xl font-bold">
                Total: ৳{cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)}
             </p>
          </div>
        </div>
      )}
    </div>
  );
}