import Link from "next/link";
import { Metadata } from "next";
import NewsletterSignup from "@/components/NewsletterSignup";

export const metadata: Metadata = {
  title: "Dog Atlas Shop - Coming Soon | Dog Gear & Accessories",
  description: "Get ready for the Dog Atlas Shop! T-shirts, mugs, posters, dog collars, and more for dog lovers. Sign up to be notified when we launch.",
  openGraph: {
    title: "Dog Atlas Shop - Coming Soon",
    description: "T-shirts, mugs, posters, dog collars, and more for dog lovers. Sign up to be notified when we launch.",
  },
};

const PRODUCT_PREVIEWS = [
  {
    name: "Dog Atlas T-Shirts",
    emoji: "👕",
    description: "Comfortable cotton tees with unique dog-themed designs",
  },
  {
    name: "Travel Mugs",
    emoji: "☕",
    description: "Keep your coffee warm on dog walks and adventures",
  },
  {
    name: "Dog Collars & Leashes",
    emoji: "🦮",
    description: "Stylish and durable gear for your furry companion",
  },
  {
    name: "Wall Art & Posters",
    emoji: "🖼️",
    description: "Beautiful prints celebrating dog-friendly destinations",
  },
  {
    name: "Tote Bags",
    emoji: "👜",
    description: "Carry treats, toys, and essentials in style",
  },
  {
    name: "Dog Bandanas",
    emoji: "🧣",
    description: "Adorable accessories for photogenic pups",
  },
];

export default function ShopPage() {
  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-orange-50 via-white to-amber-50">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <span className="animate-pulse">🔔</span>
          Coming Soon
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          Dog Atlas Shop
        </h1>
        
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Gear up for adventures with your best friend! We're launching a curated collection 
          of apparel, accessories, and dog gear for explorers and their pups.
        </p>

        {/* Product Preview Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {PRODUCT_PREVIEWS.map((product, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-3">{product.emoji}</div>
              <h3 className="font-semibold text-slate-900 mb-1">{product.name}</h3>
              <p className="text-sm text-slate-500">{product.description}</p>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Be the First to Know! 🐕
          </h2>
          <p className="text-slate-600 mb-6">
            Sign up to get early access, exclusive discounts, and launch announcements.
          </p>
          
          <NewsletterSignup 
            source="shop_launch"
            buttonText="Notify Me"
            placeholder="Enter your email"
          />
          
          <p className="text-xs text-slate-400 mt-4">
            No spam, ever. We'll only email you about shop updates and special offers.
          </p>
        </div>

        {/* Back to exploring */}
        <div className="mt-12">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to exploring dog-friendly places
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            Why Shop With Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl mb-3">🌍</div>
              <h3 className="font-semibold mb-2">Dog-Inspired Designs</h3>
              <p className="text-slate-400 text-sm">
                Unique artwork celebrating dog-friendly destinations worldwide
              </p>
            </div>
            <div>
              <div className="text-3xl mb-3">💚</div>
              <h3 className="font-semibold mb-2">Quality Materials</h3>
              <p className="text-slate-400 text-sm">
                Durable, comfortable products built for adventures
              </p>
            </div>
            <div>
              <div className="text-3xl mb-3">🐾</div>
              <h3 className="font-semibold mb-2">Community Driven</h3>
              <p className="text-slate-400 text-sm">
                Part of proceeds support dog rescue organizations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
