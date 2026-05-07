"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Edit3, Search, X, Package,
  Image as ImageIcon, Eye
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

interface Medicine {
  id: string;
  name: string;
  category: { name: string; id: string } | any;
  price: number;
  stock: number;
  image?: string;
  manufacturer?: string;
  description?: string;
}

export default function SellerMedicines() {

  // ================= STATES =================
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMedicine, setViewMedicine] = useState<Medicine | null>(null);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const itemRefs = useRef<{ [key: string]: HTMLTableRowElement | null }>({});

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    manufacturer: "Beximco Pharma",
    categoryId: "9a539a21-2b99-422c-8aff-adb1ce801782",
    description: "",
    image: null as File | null,
  });

  // ================= FETCH =================
  const fetchMedicines = async () => {
    try {
      const res = await api.medicines.getAll();
      const data = Array.isArray(res?.data) ? res.data : res || [];
      setMedicines(data);
    } catch {
      toast.error("ডাটা লোড করা যায়নি");
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // ================= SCROLL =================
  const scrollToItem = (id: string) => {
    setTimeout(() => {
      const el = itemRefs.current[id];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });

        el.classList.add("bg-emerald-500/20");

        setTimeout(() => {
          el.classList.remove("bg-emerald-500/20");
        }, 2000);
      }
    }, 400);
  };

  // ================= VIEW =================
  const openView = (med: Medicine) => {
    setViewMedicine(med);
  };

  // ================= EDIT =================
  const startEdit = (med: Medicine) => {
    setEditingMedicine(med);

    setFormData({
      name: med.name,
      price: String(med.price),
      stock: String(med.stock),
      manufacturer: med.manufacturer || "Beximco Pharma",
      categoryId: med.category?.id || "",
      description: med.description || "",
      image: null,
    });

    setPreviewImage(med.image || null);
    setIsModalOpen(true);
  };

  // ================= CLOSE MODAL =================
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMedicine(null);
    setPreviewImage(null);

    setFormData({
      name: "",
      price: "",
      stock: "",
      manufacturer: "Beximco Pharma",
      categoryId: "9a539a21-2b99-422c-8aff-adb1ce782",
      description: "",
      image: null,
    });
  };

  // ================= IMAGE =================
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this medicine?")) return;

    const toastId = toast.loading("Deleting...");

    try {
      await api.medicines.delete(id);
      setMedicines(prev => prev.filter(m => m.id !== id));
      toast.success("Deleted successfully", { id: toastId });
    } catch {
      toast.error("Delete failed", { id: toastId });
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading(editingMedicine ? "Updating..." : "Adding...");

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("manufacturer", formData.manufacturer);
      data.append("categoryId", formData.categoryId);
      data.append("description", formData.description);

      if (formData.image) data.append("image", formData.image);

      let res;

      if (editingMedicine) {
        res = await api.medicines.update(editingMedicine.id, data);
        toast.success("Updated successfully", { id: toastId });
      } else {
        res = await api.medicines.create(data);
        toast.success("Added successfully", { id: toastId });
      }

      const id = res?.data?.id || editingMedicine?.id;

      closeModal();
      await fetchMedicines();

      if (id) scrollToItem(id);

    } catch {
      toast.error("Operation failed", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // ================= FILTER =================
  const filtered = medicines.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ================= UI =================
  return (
    <div className="p-4 md:p-10 min-h-screen bg-[#02040a] text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black italic uppercase">
          Inventory <span className="text-emerald-500">Manager</span>
        </h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 px-6 py-3 rounded-xl font-bold"
        >
          <Plus size={18} /> Add Medicine
        </button>
      </div>

      {/* SEARCH */}
      <input
        className="w-full mb-6 p-4 bg-white/5 rounded-xl"
        placeholder="Search..."
        onChange={e => setSearchTerm(e.target.value)}
      />

      {/* TABLE */}
      <table className="w-full">
        <tbody>
          {filtered.map(med => (
            <tr
              key={med.id}
              ref={(el) => (itemRefs.current[med.id] = el)}
              className="border-b border-white/10"
            >
              <td className="p-4">{med.name}</td>
              <td>৳{med.price}</td>
              <td>{med.stock}</td>

              <td className="flex gap-2">
                <button onClick={() => openView(med)}>
                  <Eye size={16} />
                </button>

                <button onClick={() => startEdit(med)}>
                  <Edit3 size={16} />
                </button>

                <button onClick={() => handleDelete(med.id)}>
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* VIEW MODAL */}
      <AnimatePresence>
        {viewMedicine && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
            <div className="bg-[#111] p-6 rounded-xl w-[320px]">
              <h2 className="text-xl font-bold">{viewMedicine.name}</h2>
              <p>Price: ৳{viewMedicine.price}</p>
              <p>Stock: {viewMedicine.stock}</p>

              <button
                onClick={() => setViewMedicine(null)}
                className="mt-4 bg-red-500 px-3 py-1 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD / EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
            <form
              onSubmit={handleSubmit}
              className="bg-[#111] p-6 rounded-xl w-[350px]"
            >
              <h2 className="mb-4 text-lg font-bold">
                {editingMedicine ? "Edit Medicine" : "Add Medicine"}
              </h2>

              <input
                className="w-full p-2 mb-2"
                placeholder="Name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />

              <input
                className="w-full p-2 mb-2"
                placeholder="Price"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
              />

              <input
                className="w-full p-2 mb-2"
                placeholder="Stock"
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: e.target.value })}
              />

              <button className="w-full bg-emerald-600 py-2">
                {loading ? "Saving..." : "Save"}
              </button>

              <button
                type="button"
                onClick={closeModal}
                className="w-full mt-2 bg-red-500 py-2"
              >
                Close
              </button>
            </form>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}