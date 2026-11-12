export default function AddressesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="w-48 h-8 bg-gray-200 rounded-lg" />
        <div className="w-32 h-10 bg-gray-200 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map(i => (
          <div key={i} className="h-[200px] bg-white/60 rounded-2xl border border-[#e9e5eb] p-5 space-y-3">
            <div className="w-24 h-5 bg-gray-200 rounded" />
            <div className="w-40 h-4 bg-gray-200 rounded" />
            <div className="w-full h-4 bg-gray-200 rounded" />
            <div className="w-full h-4 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}