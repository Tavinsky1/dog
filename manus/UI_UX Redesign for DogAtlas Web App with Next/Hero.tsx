import Image from "next/image";

export default function Hero({ title, subtitle, cta }: { title: string; subtitle?: string; cta?: React.ReactNode }) {
  return (
    <section className="relative rounded-3xl overflow-hidden bg-amber-50/50">
      <div className="absolute inset-0 bg-hero-pattern opacity-60" />
      <div className="relative px-8 py-16 md:py-24 text-center max-w-4xl mx-auto">
        <div className="mb-6">
          <span className="inline-block p-4 bg-white/80 rounded-full shadow-lg">
            <span className="text-6xl md:text-7xl">🐕‍🦺</span>
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold font-display text-amber-900 mb-6 leading-tight">
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-amber-800/80">
            {subtitle}
          </p>
        )}
        
        {cta && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {cta}
          </div>
        )}
        
        <div className="mt-12 flex justify-center space-x-8 text-4xl opacity-70">
          <span>🐕</span>
          <span>🦮</span>
          <span>�</span>
          <span>�</span>
          <span>🦴</span>
        </div>
      </div>
    </section>
  );
}
