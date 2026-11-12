export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-[#fafafc]">
      {/* هدر اسکلت */}
      <div className="h-[74px] border-b border-[#e9e5eb] bg-white/80 backdrop-blur-md" />
      
      {/* بنر بالای صفحه */}
      <div className="bg-white border-b border-[#e9e5eb] pt-10 pb-8 px-4 md:px-6">
        <div className="container-custom max-w-7xl">
          <div className="w-32 h-4 bg-[#e9e5eb] rounded-full mb-4 animate-pulse" />
          <div className="w-64 h-8 bg-[#e9e5eb] rounded-lg mb-3 animate-pulse" />
          <div className="w-full max-w-2xl h-4 bg-[#e9e5eb] rounded-lg animate-pulse" />
        </div>
      </div>

      <div className="container-custom max-w-7xl py-8 px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* سایدبار فیلتر */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-[#e9e5eb] p-5 h-[400px] animate-pulse" />
          </div>

          {/* گرید محصولات */}
          <div className="flex-1">
            <div className="w-full h-12 bg-white rounded-xl border border-[#e9e5eb] mb-6 animate-pulse" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#e9e5eb] p-4 flex flex-col h-[350px]">
                  <div className="w-full aspect-square bg-[#f8f7fa] rounded-xl mb-4 animate-pulse" />
                  <div className="w-3/4 h-4 bg-[#e9e5eb] rounded mb-2 animate-pulse" />
                  <div className="w-1/2 h-3 bg-[#e9e5eb] rounded mb-4 animate-pulse" />
                  <div className="mt-auto flex justify-between items-center">
                    <div className="w-16 h-4 bg-[#e9e5eb] rounded animate-pulse" />
                    <div className="w-8 h-8 bg-[#e9e5eb] rounded-full animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}