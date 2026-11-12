export default function JournalLoading() {
  return (
    <div className="min-h-screen bg-[#fafafc]">
      <div className="h-[74px] border-b border-[#e9e5eb] bg-white/80 backdrop-blur-md" />
      <div className="container-custom py-8 md:py-12 animate-pulse">
        <div className="text-center mb-12">
          <div className="w-48 h-5 bg-gray-200 rounded-full mx-auto mb-4" />
          <div className="w-80 h-10 bg-gray-200 rounded-lg mx-auto mb-3" />
          <div className="w-96 h-4 bg-gray-200 rounded mx-auto" />
        </div>
        <div className="flex gap-2 overflow-x-auto mb-10 justify-center">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-24 h-10 bg-gray-200 rounded-full shrink-0" />)}
        </div>
        <div className="w-full h-96 bg-white border border-[#e9e5eb] rounded-3xl mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="space-y-3">
              <div className="aspect-[4/3] bg-gray-200 rounded-2xl" />
              <div className="w-20 h-4 bg-gray-200 rounded" />
              <div className="w-full h-5 bg-gray-200 rounded" />
              <div className="w-3/4 h-4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}