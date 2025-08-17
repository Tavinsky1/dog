import Link from "next/link";
import Image from "next/image";

export default function CategoryCard({
  href, title, subtitle, imageUrl, count
}: { href: string; title: string; subtitle?: string; imageUrl: string; count?: number }) {
  return (
    <Link href={href} className="group block card-hover overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <Image 
          src={imageUrl} 
          alt={title} 
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        
        {typeof count === "number" && (
          <div className="absolute top-3 right-3 bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1.5">
            <span>🐾</span>
            <span>{count}</span>
          </div>
        )}
      </div>
      
      <div className="p-5">
        {subtitle && (
          <div className="text-sm text-orange-600 font-bold mb-1 uppercase tracking-wider">
            {subtitle}
          </div>
        )}
        <h3 className="text-xl font-display font-extrabold text-gray-800 group-hover:text-orange-600 transition-colors mb-2">
          {title}
        </h3>
        <div className="flex items-center justify-between text-gray-500">
          <span>Explore</span>
          <span className="text-orange-500 group-hover:translate-x-1 transition-transform">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
