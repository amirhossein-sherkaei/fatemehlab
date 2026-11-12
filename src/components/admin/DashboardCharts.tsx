'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { formatToman } from '@/lib/currency';

export default function DashboardCharts({ data }: { data: any[] }) {
  // فرمت اعداد در Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-md border border-[#e9e5eb] p-3 rounded-xl shadow-xl text-xs" dir="rtl">
          <p className="font-bold text-[#28242b] mb-2">{label}</p>
          <p className="text-[#c61d70] font-black">درآمد: {formatToman(payload[0].value)}</p>
          <p className="text-[#77717b] font-bold mt-1">سفارشات: {payload[1]?.value} عدد</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* نمودار فروش (Area) */}
      <div className="bg-white rounded-3xl border border-[#e9e5eb] p-5 shadow-sm">
        <h3 className="text-sm font-black text-[#28242b] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#c61d70]"></span> روند درآمد ۷ روز اخیر
        </h3>
        <div className="h-[250px] w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c61d70" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#c61d70" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#77717b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#77717b' }} axisLine={false} tickLine={false} tickFormatter={(val) => val.toLocaleString()} width={60} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0edf1" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#c61d70" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* نمودار سفارشات (Bar) */}
      <div className="bg-white rounded-3xl border border-[#e9e5eb] p-5 shadow-sm">
        <h3 className="text-sm font-black text-[#28242b] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span> تعداد سفارشات ۷ روز اخیر
        </h3>
        <div className="h-[250px] w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#77717b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#77717b' }} axisLine={false} tickLine={false} width={30} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0edf1" />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#fafafc' }} />
              <Bar dataKey="orders" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}