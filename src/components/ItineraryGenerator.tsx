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
  vienna: [
    {
      title: "🌅 Imperial Morning",
      description: "Start at Schönbrunn Palace gardens where leashed dogs are welcome. The vast grounds offer beautiful walking paths and photo opportunities."
    },
    {
      title: "☕ Coffee House Culture",
      description: "Experience Vienna's famous Kaffeehaus tradition at dog-friendly cafés in the historic center. Many welcome well-behaved dogs indoors."
    },
    {
      title: "🌳 Prater Park Afternoon",
      description: "Head to Prater, Vienna's largest park with dedicated off-leash zones. Dogs can run freely in designated areas while you enjoy the green space."
    },
    {
      title: "🌆 Danube Evening",
      description: "Walk along the Donaukanal (Danube Canal) with its street art and outdoor bars. Many riverside spots welcome dogs on their terraces."
    }
  ],
  amsterdam: [
    {
      title: "🌅 Canal Morning",
      description: "Start with a walk along the picturesque canals of Jordaan or Grachtengordel. Amsterdam's charming streets are very dog-friendly."
    },
    {
      title: "☕ Brown Café Break",
      description: "Visit traditional 'brown cafés' (bruine kroeg) where dogs are often welcome. Enjoy Dutch coffee and apple pie with your pup by your side."
    },
    {
      title: "🌳 Vondelpark Afternoon",
      description: "Spend time at Vondelpark, Amsterdam's most famous park with off-leash areas. Your dog can socialize while you relax by the ponds."
    },
    {
      title: "🌆 Amsterdam North",
      description: "Take the free ferry to Amsterdam Noord and explore the NDSM wharf area. Many waterfront restaurants have dog-friendly terraces."
    }
  ],
  "new-york": [
    {
      title: "🌅 Central Park Dawn",
      description: "Start early at Central Park before 9 AM when dogs can be off-leash. Visit the North Meadow or Great Lawn for maximum running space."
    },
    {
      title: "☕ Brooklyn Brunch",
      description: "Head to dog-friendly Brooklyn neighborhoods like Williamsburg or Park Slope. Many cafés have outdoor seating and provide water bowls."
    },
    {
      title: "🌳 Dog Run Social",
      description: "Visit one of NYC's 100+ dog runs in neighborhoods like Union Square, Madison Square Park, or Tompkins Square Park for playtime."
    },
    {
      title: "🌆 High Line Sunset",
      description: "Walk the elevated High Line park (dogs on leash) at sunset, then dine at one of Chelsea's many dog-friendly patios."
    }
  ],
  "los-angeles": [
    {
      title: "🌅 Beach Morning",
      description: "Start at Rosie's Dog Beach in Long Beach or Leo Carrillo State Beach where dogs can run off-leash. Perfect for water-loving pups!"
    },
    {
      title: "☕ Canyon Coffee",
      description: "Explore dog-friendly cafés in Laurel Canyon or Silver Lake. LA's outdoor culture means most patios welcome four-legged friends."
    },
    {
      title: "🌳 Runyon Canyon Hike",
      description: "Tackle the famous Runyon Canyon off-leash trails with stunning Hollywood views. Bring plenty of water for you and your pup!"
    },
    {
      title: "🌆 Venice Boardwalk",
      description: "End at Venice Beach boardwalk for people-watching and dog-friendly restaurants along Abbot Kinney Boulevard."
    }
  ],
  sydney: [
    {
      title: "🌅 Harbour Sunrise",
      description: "Begin at Sirius Cove Reserve or Blues Point Reserve for stunning harbour views. These off-leash areas are perfect for morning exercise."
    },
    {
      title: "☕ Bondi to Bronte",
      description: "Walk the scenic coastal path from Bondi to Bronte. Stop at dog-friendly cafés in Bondi—Sydney's café culture is very pet-welcoming."
    },
    {
      title: "🏖️ Beach Afternoon",
      description: "Visit Rosebery Dog Park or head to off-leash times at Bronte Beach. Many beaches allow dogs early morning or evening."
    },
    {
      title: "🌆 Harbour Bridge Walk",
      description: "Stroll around Circular Quay and The Rocks area. Many waterfront restaurants have outdoor seating perfect for dogs."
    }
  ],
  melbourne: [
    {
      title: "🌅 Botanic Gardens",
      description: "Start at the Royal Botanic Gardens (dogs on leash) or nearby off-leash areas. Melbourne's parks are exceptionally dog-friendly."
    },
    {
      title: "☕ Laneway Coffee",
      description: "Explore Melbourne's famous laneways like Degraves Street or Hardware Lane. Many hidden cafés have outdoor seating for dogs."
    },
    {
      title: "🌳 Beach & Parks",
      description: "Visit St Kilda Beach or Albert Park Lake where dogs can run off-leash during designated times. Perfect for active pups!"
    },
    {
      title: "🌆 Yarra River Walk",
      description: "Walk along the Yarra River through Southbank. Many riverside bars and restaurants welcome dogs on their terraces."
    }
  ],
  "buenos-aires": [
    {
      title: "🌅 Palermo Parks",
      description: "Start at Parque 3 de Febrero (Bosques de Palermo), Buenos Aires' largest park. Dogs can explore the vast green spaces on leash."
    },
    {
      title: "☕ Palermo Soho",
      description: "Explore trendy Palermo Soho where most cafés and restaurants have outdoor seating. Porteños (locals) love their dogs!"
    },
    {
      title: "🌳 Ecological Reserve",
      description: "Visit the Costanera Sur Ecological Reserve for nature trails along the river. A peaceful escape where leashed dogs are welcome."
    },
    {
      title: "🌆 San Telmo Evening",
      description: "Stroll through historic San Telmo neighborhood. Many traditional parillas (steakhouses) welcome dogs on outdoor patios."
    }
  ],
  cordoba: [
    {
      title: "🌅 Sarmiento Park",
      description: "Begin at Parque Sarmiento, Córdoba's largest urban park with lakes and green spaces. Dogs on leash can enjoy the morning freshness."
    },
    {
      title: "☕ Nueva Córdoba Cafés",
      description: "Explore the bohemian Nueva Córdoba neighborhood. Student-friendly cafés often have outdoor seating where dogs are welcome."
    },
    {
      title: "🌳 Sierras Hiking",
      description: "Drive to the nearby Sierras de Córdoba for dog-friendly mountain trails. The hills offer spectacular views and fresh mountain air."
    },
    {
      title: "🌆 Historic Center",
      description: "Walk through the UNESCO-listed Jesuit Block area. Many plaza-facing restaurants have outdoor seating for evening meals with your pup."
    }
  ],
  tokyo: [
    {
      title: "🌅 Yoyogi Park Morning",
      description: "Start at Yoyogi Park's designated dog run area where pups can play off-leash. One of Tokyo's most dog-friendly parks!"
    },
    {
      title: "☕ Harajuku Pet Cafés",
      description: "Explore Harajuku and Omotesando where several pet-friendly cafés welcome dogs. Some even have special dog menus!"
    },
    {
      title: "🌳 Meguro River Walk",
      description: "Stroll along the scenic Meguro River. The tree-lined paths are beautiful year-round and dogs on leash are welcome."
    },
    {
      title: "🌆 Daikanyama Evening",
      description: "End in trendy Daikanyama neighborhood known for its dog-friendly culture. Many boutiques and restaurants welcome pets."
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
