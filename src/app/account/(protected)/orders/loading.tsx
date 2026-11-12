export default function OrdersLoading() {
  return (
    <div className="space-y-6">
      <div className="w-48 h-8 bg-gray-200 rounded-lg animate-pulse" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/60 backdrop-blur-md rounded-2xl border border-[#e9e5eb] p-5 h-[120px] flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="w-24 h-6 bg-gray-200 rounded-full animate-pulse" />
            </div>
            <div className="flex justify-between items-center">
              <div className="w-40 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}