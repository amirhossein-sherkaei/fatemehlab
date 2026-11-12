export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-[#fafafc]">
      <div className="h-[74px] border-b border-[#e9e5eb] bg-white/80 backdrop-blur-md" />
      <div className="container-custom py-8 animate-pulse">
        <div className="w-56 h-10 bg-gray-200 rounded-lg mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-white rounded-3xl border border-[#e9e5eb] p-8 space-y-4">
            <div className="w-40 h-6 bg-gray-200 rounded mb-6" />
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-2">
                <div className="w-24 h-3 bg-gray-200 rounded" />
                <div className="w-full h-12 bg-gray-200 rounded-xl" />
              </div>
            ))}
          </div>
          <div className="lg:col-span-2 bg-white rounded-3xl border border-[#e9e5eb] p-6 h-96" />
        </div>
      </div>
    </div>
  );
}