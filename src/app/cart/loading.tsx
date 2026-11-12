export default function CartLoading() {
  return (
    <div className="min-h-screen bg-[#fafafc]">
      <div className="h-[74px] border-b border-[#e9e5eb] bg-white/80 backdrop-blur-md" />
      <div className="container-custom py-8 animate-pulse">
        <div className="w-48 h-10 bg-gray-200 rounded-lg mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-[#e9e5eb] p-4 flex gap-3">
                <div className="w-24 h-24 bg-gray-200 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="w-3/4 h-4 bg-gray-200 rounded" />
                  <div className="w-1/4 h-3 bg-gray-200 rounded" />
                  <div className="w-1/3 h-6 bg-gray-200 rounded mt-4" />
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#e9e5eb] p-6 h-72" />
          </div>
        </div>
      </div>
    </div>
  );
}