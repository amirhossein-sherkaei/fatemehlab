'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2 } from 'lucide-react';


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push('/admin');
      } else {
        const data = await res.json();
        setError(data.message || 'خطا در ورود');
      }
    } catch (err) {
      setError('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-sage/20 blur-[120px] rounded-full" />
      
      <div className="glass-panel p-8 w-full max-w-md z-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black mb-2">ورود به پنل مدیریت</h1>
          <p className="text-sm text-muted-foreground">فاطمه بیوتی لند - بخش مدیریت</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">ایمیل</label>
            <div className="relative">
              <Mail className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pr-10 pl-4 py-2 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/50"
                placeholder="admin@fatemehlab.ir"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">رمز عبور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10 pl-4 py-2 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/50"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && <p className="text-rose text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-foreground text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-foreground/80 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'ورود به پنل'}
          </button>
        </form>
      </div>
    </div>
  );
}
