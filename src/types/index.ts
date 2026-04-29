// ১. ইউজারের রোল এবং ডাটা টাইপ
export type UserRole = "ADMIN" | "SELLER" | "CUSTOMER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
}

// ২. ওষুধের (Medicine) টাইপ
export interface Medicine {
  id: string;
  name: string;
  price: number;
  manufacturer: string;
  category: string;
  stock: number;
  description?: string;
  image?: string;
  createdAt?: string;
}

// ৩. কার্ট আইটেমের টাইপ (Medicine এর সাথে Quantity যোগ হবে)
export interface CartItem extends Medicine {
  quantity: number;
}

// ৪. অর্ডারের টাইp
export interface OrderItem {
  medicineId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  address: string;
  createdAt: string;
}

// ৫. এপিআই রেসপন্স টাইপ (Generic)
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  token?: string;
}