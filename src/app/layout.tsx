import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
// ১. এখানে Toaster ইম্পোর্ট করা হয়েছে
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MediStore | Trusted Online Pharmacy",
  description: "Get your medicines delivered at your doorstep.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* ২. এই Toaster লাইনটি বসানো হয়েছে যাতে পুরো প্রোজেক্টে টোস্ট মেসেজ দেখা যায় */}
        <Toaster 
          position="top-center" 
          reverseOrder={false} 
          toastOptions={{
            style: {
              background: "#02040a",
              color: "#10b981",
              border: "1px solid rgba(16, 185, 129, 0.2)",
            }
          }}
        />

        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}