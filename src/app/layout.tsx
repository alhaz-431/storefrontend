import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext"; // যদি CartContext তৈরি থাকে

export const metadata: Metadata = {
  title: "MediStore - Your Online Pharmacy",
  description: "Get genuine medicines delivered fast.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen bg-[#040610] text-slate-300">
        {/* AuthProvider দিয়ে পুরো অ্যাপকে মুড়িয়ে দিলাম যেন সবাই লগইন ডাটা পায় */}
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}