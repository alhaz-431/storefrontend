import MedicineCard from "@/components/medicines/MedicineCard";

export default function MedicineList({ medicines }: any) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {medicines.map((item: any) => (
        <MedicineCard key={item.id} medicine={item} />
      ))}
    </div>
  );
}