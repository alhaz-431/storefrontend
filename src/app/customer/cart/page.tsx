"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  medicineId: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  image?: string;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const savedCart = localStorage.getItem("medistore_cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("medistore_cart", JSON.stringify(newCart));
  };

  const updateQuantity = (medicineId: string, delta: number) => {
    const newCart = cart.map((item) => {
      if (item.medicineId === medicineId) {
        const newQty = Math.max(1, Math.min(item.stock, item.quantity + delta));
        return { ...item, quantity: newQty };
      }
      return item;
    });
    updateCart(newCart);
  };

  const removeItem = (medicineId: string) => {
    const newCart = cart.filter((item) => item.medicineId !== medicineId);
    updateCart(newCart);
    toast.success("Removed from cart");
  };

  const clearCart = () => {
    if (confirm("Clear entire cart?")) {
      updateCart([]);
      toast.success("Cart cleared");
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some medicines to get started!</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl transition"
          >
            <ShoppingBag size={20} />
            Browse Medicines
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-800 mb-2">
              Shopping <span className="text-emerald-600">Cart</span>
            </h1>
            <p className="text-gray-600">{cart.length} items in your cart</p>
          </div>
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 font-semibold text-sm"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={item.medicineId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-2xl shadow-md p-4 md:p-6 flex gap-4 hover:shadow-xl transition"
                >
                  {/* Image */}
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center text-3xl md:text-4xl flex-shrink-0">
                    💊
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-base md:text-lg mb-1">
                      {item.name}
                    </h3>
                    <p className="text-emerald-600 font-bold text-lg md:text-xl mb-2">
                      ৳{item.price}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.medicineId, -1)}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded hover:bg-emerald-100 transition"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-10 text-center font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.medicineId, 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded hover:bg-emerald-100 transition"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <span className="text-sm text-gray-500">Stock: {item.stock}</span>
                    </div>
                  </div>

                  {/* Price & Delete */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.medicineId)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash2 size={20} />
                    </button>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Total</p>
                      <p className="text-xl md:text-2xl font-black text-gray-800">
                        ৳{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">৳{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="font-semibold text-emerald-600">Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-emerald-600">৳{total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold hover:shadow-xl transition flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight size={20} />
              </Link>

              <Link
                href="/shop"
                className="block w-full text-center mt-4 text-emerald-600 font-semibold hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}