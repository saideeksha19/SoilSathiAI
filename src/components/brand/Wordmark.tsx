import Link from "next/link";
import { Logo } from "./Logo";

export function Wordmark({ href = "/", compact = false }: { href?: string; compact?: boolean }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-3">
      <Logo size={compact ? 30 : 38} />
      <span className="leading-tight">
        <span className="block font-semibold tracking-tight text-brand-950 text-[1.05rem]">
          SoilSathi <span className="text-accent-600">AI</span>
        </span>
        <span className="block text-[0.65rem] font-medium uppercase tracking-[0.16em] text-brand-600">
          Farm Decision Engine
        </span>
      </span>
    </Link>
  );
}
