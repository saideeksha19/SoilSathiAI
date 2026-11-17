import Link from "next/link";
import { Sprout } from "lucide-react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-700">
        <Sprout className="h-6 w-6" aria-hidden />
      </div>
      <h2 className="text-lg font-semibold text-brand-950">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-brand-700">{description}</p>
      {action ? (
        <Link href={action.href} className="btn-primary mt-6">
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
