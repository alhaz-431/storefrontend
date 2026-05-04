"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    api.orders.getOrderById(id as string)
      .then((res: any) => setOrder(res.data || res));
  }, [id]);

  if (!order) return <div className="p-10 text-white">Loading...</div>;

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-black">Order Details</h1>

      <p className="mt-4">Total: ৳{order.totalAmount}</p>
    </div>
  );
}