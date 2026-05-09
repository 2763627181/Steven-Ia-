import Link from "next/link";
import { Zap } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      {/* Grid background */}
      <div className="fixed inset-0 grid-pattern opacity-50 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-600/8 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-8 py-6">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            Steven <span className="text-gradient">IA</span>
          </span>
        </Link>
      </header>

      {/* Content */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-12">
        {children}
      </div>
    </div>
  );
}
