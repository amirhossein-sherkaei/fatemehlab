export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-[#fafafc]">
      <div className="h-[74px] border-b border-[#e9e5eb] bg-white/80 backdrop-blur-md" />
      <div className="container-custom py-6 animate-pulse">
        {/* Breadcrumb */}
        <div className="flex gap-2 mb-6">
          <div className="w-16 h-3 bg-gray-200 rounded" />
          <div className="w-2 h-3 bg-gray-200 rounded" />
          <div className="w-24 h-3 bg-gray-200 rounded" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Gallery */}
          <div>
            <div className="aspect-square md:aspect-[4/5] rounded-3xl bg-white border border-[#e9e5eb]" />
            <div className="flex gap-2 mt-3">
              {[1, 2, 3, 4].map(i => <div key={i} className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gray-200" />)}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div className="w-24 h-4 bg-gray-200 rounded" />
            <div className="w-3/4 h-10 bg-gray-200 rounded-lg" />
            <div className="w-full h-4 bg-gray-200 rounded" />
            <div className="w-full h-4 bg-gray-200 rounded" />
            <div className="w-2/3 h-4 bg-gray-200 rounded" />
            <div className="h-32 bg-white border border-[#e9e5eb] rounded-2xl mt-6" />
            <div className="flex gap-3 mt-6">
              <div className="flex-1 h-12 bg-gray-200 rounded-xl" />
              <div className="w-32 h-12 bg-gray-200 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="mt-16 max-w-4xl mx-auto space-y-6">
          <div className="h-40 bg-white border border-[#e9e5eb] rounded-2xl" />
          <div className="h-32 bg-white border border-[#e9e5eb] rounded-2xl" />
        </div>
      </div>
    </div>
  );
}