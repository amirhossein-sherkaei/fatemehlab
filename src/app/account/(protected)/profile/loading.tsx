export default function ProfileLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-[250px] bg-white/60 backdrop-blur-md rounded-3xl border border-[#e9e5eb] p-8 flex items-center gap-6">
        <div className="w-32 h-32 rounded-full bg-gray-200 shrink-0" />
        <div className="space-y-3 flex-1">
          <div className="w-48 h-8 bg-gray-200 rounded-lg" />
          <div className="w-64 h-4 bg-gray-200 rounded" />
          <div className="w-32 h-6 bg-gray-200 rounded-full mt-4" />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-white/60 rounded-2xl border border-[#e9e5eb]" />)}
      </div>
      <div className="h-[400px] bg-white/60 rounded-3xl border border-[#e9e5eb]" />
    </div>
  );
}