export default function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="card-hover p-6 text-center">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center text-4xl border-2 border-amber-200 shadow-lg">
          {icon}
        </div>
      </div>
      <div className="text-lg font-semibold text-amber-800/90 mb-1">
        {label}
      </div>
      <div className="text-3xl font-extrabold font-display text-gray-800">
        {value}
      </div>
    </div>
  );
}
