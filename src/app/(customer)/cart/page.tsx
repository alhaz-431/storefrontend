"use client";
import { useCart } from "@/context/CartContext";
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from "react-icons/fi";
import Link from "next/link";

export default function CartPage() {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();

  // টোটাল প্রাইস ক্যালকুলেশন
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <FiShoppingBag size={80} className="text-slate-800" />
        <h2 className="text-2xl font-black text-white uppercase italic">Your cart is empty</h2>
        <Link href="/shop" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-blue-600 transition-all">
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-10">
        Shopping <span className="text-blue-600">Cart</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white/5 border border-white/5 p-6 rounded-[32px] flex items-center gap-6">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-contain bg-[#161b2a] rounded-2xl p-2" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">{item.name}</h3>
                <p className="text-blue-400 font-black">৳{item.price}</p>
              </div>
              
              <div className="flex items-center gap-4 bg-black/20 p-2 rounded-xl border border-white/5">
                <button onClick={() => removeFromCart(item.id)} className="p-2 text-slate-400 hover:text-white"><FiMinus /></button>
                <span className="text-white font-black">{item.quantity}</span>
                <button onClick={() => addToCart(item)} className="p-2 text-slate-400 hover:text-white"><FiPlus /></button>
              </div>

              <button onClick={() => removeFromCart(item.id)} className="p-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all">
                <FiTrash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-[#0d111c] border border-blue-600/20 p-8 rounded-[40px] h-fit sticky top-28">
          <h3 className="text-xl font-black text-white uppercase italic mb-6">Order Summary</h3>
          <div className="space-y-4 border-b border-white/5 pb-6">
            <div className="flex justify-between text-slate-400 font-bold text-xs uppercase">
              <span>Subtotal</span>
              <span>৳{totalPrice}</span>
            </div>
            <div className="flex justify-between text-slate-400 font-bold text-xs uppercase">
              <span>Delivery</span>
              <span className="text-green-500 font-black">FREE</span>
            </div>
          </div>
          <div className="flex justify-between items-center py-6">
            <span className="text-white font-black uppercase italic">Total</span>
            <span className="text-3xl font-black text-blue-500 italic">৳{totalPrice}</span>
          </div>
          <Link href="/checkout" className="w-full bg-blue-600 text-white flex items-center justify-center py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white hover:text-blue-600 transition-all shadow-xl shadow-blue-600/20">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}