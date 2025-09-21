export default function Hero({
  title,
  subtitle,
  cta,
}: {
  title: string;
  subtitle?: string;
  cta?: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-blue-100 bg-white px-6 py-14 text-center shadow-sm sm:px-10">
      <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-blue-700">
        Built for adventures with dogs
      </p>
      <h1 className="mt-6 text-4xl font-display font-extrabold leading-tight text-slate-900 sm:text-5xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
          {subtitle}
        </p>
      )}
      {cta && <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">{cta}</div>}
      <div className="mt-10 flex justify-center gap-4 text-4xl opacity-80">
        <span>🐕</span>
        <span>🦮</span>
        <span>🐾</span>
        <span>🌲</span>
        <span>🦴</span>
      </div>
    </section>
  );
}
