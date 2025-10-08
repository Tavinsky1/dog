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
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-xl">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=2400&q=80"
          alt="Happy dogs exploring outdoors"
          className="h-full w-full object-cover"
        />
        {/* Subtle dark overlay at bottom for text readability only */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 py-16 text-center sm:px-10 sm:py-24 lg:py-28">
        {/* Badge */}
        <div className="flex justify-center">
          <p className="inline-flex items-center gap-2 text-lg font-semibold uppercase tracking-wide text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
            <span className="text-2xl">🐾</span>
            Built for adventures with dogs
          </p>
        </div>

        {/* Title */}
        <h1 className="mt-8 text-5xl font-display font-extrabold leading-tight text-white sm:text-6xl lg:text-7xl" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)' }}>
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="mx-auto mt-6 max-w-3xl text-lg text-white sm:text-xl lg:text-2xl font-medium leading-relaxed" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.3)' }}>
            {subtitle}
          </p>
        )}

        {/* CTA Buttons */}
        {cta && (
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {cta}
          </div>
        )}

        {/* Decorative Icons */}
        <div className="mt-12 flex justify-center gap-6 text-5xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
          <span className="animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }}>🐕</span>
          <span className="animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '2s' }}>🦮</span>
          <span className="animate-bounce" style={{ animationDelay: '0.4s', animationDuration: '2s' }}>🐾</span>
          <span className="animate-bounce" style={{ animationDelay: '0.6s', animationDuration: '2s' }}>🌲</span>
          <span className="animate-bounce" style={{ animationDelay: '0.8s', animationDuration: '2s' }}>🦴</span>
        </div>

        {/* Subtle bottom decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-blue-500 to-amber-400 opacity-80 shadow-lg" />
      </div>
    </section>
  );
}
