export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-brand-500">{eyebrow}</p>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-tight text-brand-950 sm:text-[1.75rem]">{title}</h1>
        {description ? <p className="mt-2 text-sm leading-relaxed text-brand-700">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2 no-print">{actions}</div> : null}
    </div>
  );
}
