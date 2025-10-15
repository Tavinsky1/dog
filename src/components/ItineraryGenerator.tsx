"use client";

type PlaceSummary = {
  id: string;
  name: string;
  type: string;
  shortDescription?: string | null;
};

type Segment = {
  title: string;
  description: string;
};

// Curated itinerary suggestions for each city
const CITY_ITINERARIES: Record<string, Segment[]> = {
  berlin: [
    {
      title: "🌅 Morning Adventure",
      description: "Start your day at Volkspark Friedrichshain or Tempelhofer Feld where your pup can run freely. Follow with breakfast at a dog-friendly café in Prenzlauer Berg."
    },
    {
      title: "☕ Midday Break",
      description: "Explore the charming streets of Kreuzberg, stopping at dog-welcoming cafés and shops. Many venues provide water bowls and treats for four-legged guests."
    },
    {
      title: "🌳 Afternoon Exploration",
      description: "Head to Grunewald forest for scenic trails and lake swimming spots. Berlin's green spaces are incredibly dog-friendly with off-leash areas."
    },
    {
      title: "🌆 Evening Wind Down",
      description: "Stroll along the Landwehr Canal at sunset, then enjoy dinner at a dog-friendly restaurant in Neukölln or Charlottenburg."
    }
  ],
  barcelona: [
    {
      title: "🌅 Morning by the Sea",
      description: "Begin at Platja de Llevant, Barcelona's dog beach, where your pup can splash in the Mediterranean. Then grab breakfast at a nearby dog-friendly terrace."
    },
    {
      title: "☕ Gothic Quarter Stroll",
      description: "Wander through the historic Gothic Quarter's narrow streets. Many cafés have outdoor seating perfect for dogs, and shops provide water bowls."
    },
    {
      title: "🌳 Park Afternoon",
      description: "Visit Parc de la Ciutadella or Can Rigal park where dogs can play. These green oases offer shade, fountains, and space to explore."
    },
    {
      title: "🌆 Evening Tapas",
      description: "End your day in Gràcia or Born districts at dog-friendly tapas bars with outdoor seating, where locals welcome well-behaved pups."
    }
  ],
  paris: [
    {
      title: "🌅 Morning Elegance",
      description: "Start with a walk through Jardin du Luxembourg or Bois de Vincennes. Parisians adore dogs, and many gardens welcome leashed companions."
    },
    {
      title: "☕ Café Culture",
      description: "Experience authentic Parisian café culture at dog-friendly terraces in Le Marais or Saint-Germain. Most cafés welcome small to medium dogs."
    },
    {
      title: "🎨 Afternoon Arts",
      description: "Stroll along the Seine or explore Montmartre's artistic streets. Many boutiques and galleries allow well-behaved dogs inside."
    },
    {
      title: "🌆 Evening Seine Walk",
      description: "Enjoy a romantic sunset walk along the Seine, stopping at dog-friendly bistros in the Latin Quarter for dinner."
    }
  ],
  rome: [
    {
      title: "🌅 Ancient Morning",
      description: "Begin at Villa Borghese gardens, Rome's green heart with fountains and shaded paths. Dogs on leash are welcome throughout."
    },
    {
      title: "☕ Trastevere Brunch",
      description: "Explore Trastevere's cobblestone streets and dog-friendly trattorias with outdoor seating. Romans are very welcoming to dogs."
    },
    {
      title: "🏛️ Historical Stroll",
      description: "Walk through ancient streets to the Colosseum area and Roman Forum (dogs allowed in surrounding areas). Stop at fountains to cool off."
    },
    {
      title: "🌆 Evening Aperitivo",
      description: "Head to Testaccio or Monti neighborhoods for aperitivo at dog-friendly bars with outdoor tables and people-watching."
    }
  ],
  // Default itinerary for cities without specific suggestions
  default: [
    {
      title: "🌅 Morning Walk",
      description: "Start your day at a local park or green space where your dog can stretch their legs and explore new scents."
    },
    {
      title: "☕ Coffee Break",
      description: "Find a dog-friendly café with outdoor seating. Many places provide water bowls and welcome well-behaved dogs."
    },
    {
      title: "🌳 Afternoon Adventure",
      description: "Discover dog-friendly trails, beaches, or urban walking routes. Check local regulations for off-leash areas."
    },
    {
      title: "🌆 Evening Relaxation",
      description: "Wind down with a leisurely stroll through the neighborhood, then enjoy dinner at a dog-welcoming restaurant."
    }
  ]
};

export default function ItineraryGenerator({
  city,
  places,
}: {
  city: { name: string; slug: string };
  places: PlaceSummary[];
}) {
  // Get city-specific itinerary or fall back to default
  const segments = CITY_ITINERARIES[city.slug] || CITY_ITINERARIES.default;

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Perfect Day in {city.name} 🐾</h2>
        <p className="text-sm text-slate-600">
          A curated one-day itinerary for exploring {city.name} with your furry companion.
        </p>
      </div>

      <div className="space-y-4">
        {segments.map((segment) => (
          <div key={segment.title} className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              {segment.title}
            </h3>
            <p className="mt-2 text-sm text-slate-700">{segment.description}</p>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-500 italic">
          💡 Pro tip: Always check current dog policies before visiting. Explore {places.length} dog-friendly places in {city.name} above!
        </p>
      </div>
    </div>
  );
}
