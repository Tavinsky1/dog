import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Rich, detailed descriptions for top places
const ENRICHED_DESCRIPTIONS: Record<string, { short: string; full: string }> = {
  // AMSTERDAM
  'vondelpark': {
    short: "Amsterdam's most famous park with dedicated off-leash dog areas and scenic paths along ponds",
    full: `Vondelpark is Amsterdam's crown jewel for dog owners, spanning 47 hectares of beautifully landscaped gardens, ponds, and open meadows. This iconic urban park welcomes over 10 million visitors annually, including countless four-legged friends.

**Dog-Friendly Features:**
The park features several designated off-leash areas where dogs can run freely and socialize. The main off-leash zone is located near the Groot Melkhuis cafe, perfect for morning play sessions. Throughout the park, you'll find multiple water fountains where your pup can hydrate, and the ponds provide scenic backdrops for your walks.

**Best Times to Visit:**
Early mornings (7-9 AM) and late afternoons (5-7 PM) are ideal for avoiding crowds while still enjoying the social atmosphere. The park is beautiful year-round, but spring brings stunning flower displays that make your walk extra special. Summer evenings feature open-air performances that dogs can enjoy from a distance.

**Facilities & Amenities:**
- Multiple entrance points with bike parking
- Several dog waste stations throughout
- Nearby cafes with outdoor seating (dogs welcome)
- Well-maintained gravel and paved paths suitable for all dog sizes
- Shaded areas for hot days
- Open meadows perfect for fetch and frisbee

**Local Tips:**
Keep your dog on-leash in the central paths and near playgrounds. The park can get busy on weekends, so weekday visits offer more space. In winter, the ponds sometimes freeze over creating a magical atmosphere. There's a dog-friendly cafe (Groot Melkhuis) where you can grab coffee while your dog rests in the shade.`
  },

  'amsterdamse-bos': {
    short: "Massive forest park south of Amsterdam with extensive off-leash areas and dog swimming spots",
    full: `Amsterdamse Bos (Amsterdam Forest) is a dog paradise - one of the largest recreational areas in the Netherlands, covering an area three times larger than Central Park in New York. This is where Amsterdam dogs come to truly run free.

**Why Dogs Love It:**
With over 150 kilometers of paths winding through forests, meadows, and along waterways, your dog will never tire of exploring new routes. The park features several designated off-leash areas where dogs can run through open fields and wooded trails. The Bosbaan lake has special dog swimming areas where water-loving pups can cool off during warm months.

**Terrain & Trails:**
The park offers diverse landscapes - dense forests with shaded trails perfect for summer walks, open meadows ideal for running and playing fetch, and waterside paths along canals and ponds. The terrain is mostly flat with well-maintained dirt and gravel paths that are easy on dog paws.

**Dog Swimming Areas:**
Several designated spots allow dogs to swim safely. The main dog beach is near the Bosbaan, complete with shallow entry points perfect for cautious swimmers. Always check water quality signs before letting your dog swim.

**Facilities:**
- Ample free parking at multiple entrances
- Dog waste bins every 200 meters
- Water fountains at major junctions
- Picnic areas where dogs are welcome
- Several cafes with outdoor terraces (dogs allowed)
- Year-round accessibility

**Best Routes:**
The full loop around Bosbaan is about 7km - perfect for energetic dogs. For shorter walks, try the forest trails near the main entrance. The southern meadows are ideal for off-leash running with excellent visibility.

**Important Notes:**
Leash rules are more relaxed here than in Vondelpark, but always maintain voice control. Watch for cyclists on shared paths. In hunting season (limited areas), some trails may have temporary restrictions - check signage.`
  },

  // PARIS
  'bois-de-vincennes': {
    short: "Paris's largest public park with extensive trails, dog-friendly lakes, and off-leash areas",
    full: `The Bois de Vincennes is an urban oasis spanning 995 hectares on Paris's eastern edge - making it the largest public park in the city and an absolute paradise for Parisian dogs and their owners.

**Park Overview:**
This former royal hunting ground offers everything a dog could dream of: endless trails through dense forests, open meadows for running, four lakes for water-loving pups, and a more relaxed attitude toward leash laws compared to central Paris parks.

**Off-Leash Areas:**
While Paris is generally strict about leash requirements, Bois de Vincennes has several de facto off-leash zones where locals exercise their dogs freely, particularly in the forest paths away from main thoroughfares. The meadows near Lac Daumesnil are popular morning spots where well-behaved dogs can run under voice control.

**Lake Access:**
Lac Daumesnil and Lac des Minimes have dog-friendly shores where your pup can cool off (swimming not officially allowed but tolerated in designated spots). The lakeside paths offer stunning views and plenty of shade in summer.

**Trail Network:**
Over 30 kilometers of trails wind through the park, from wide paved paths perfect for leisurely walks to narrow forest trails for adventure. The diversity means you can visit daily and always find something new. Popular routes include:
- The full loop around Lac Daumesnil (3.5km)
- Forest trails near the Buddhist Temple (peaceful and shaded)
- Meadow paths in the Parc Floral area (wide open spaces)

**Facilities & Amenities:**
- Multiple entrance points with parking (fees apply)
- Regular dog waste stations (bring backup bags)
- Several cafes and kiosks where outdoor dining welcomes dogs
- Water fountains throughout (bring a collapsible bowl)
- Well-maintained paths suitable for all breeds and sizes

**Best Times:**
Early mornings (before 9 AM) offer the most freedom as the park is less crowded and dog owners are more relaxed about leashes. Weekdays are significantly quieter than weekends. Autumn brings spectacular foliage that makes walks extra special.

**Local Tips:**
French dog etiquette emphasizes good behavior - ensure your dog has solid recall before off-leash time. The park hosts events occasionally (check schedules) which may restrict access to certain areas. In summer, visit early or late to avoid heat. The Cartoucherie area is particularly dog-friendly with theater crowds who love pups.`
  },

  // BERLIN
  'tempelhofer-feld': {
    short: "Former airport turned into Berlin's largest dog park with vast open spaces for off-leash freedom",
    full: `Tempelhofer Feld is legendary among Berlin dog owners - a 386-hectare former airport that's now one of Europe's largest inner-city open spaces. This is where Berlin dogs experience ultimate freedom.

**The Off-Leash Paradise:**
Unlike most urban parks, Tempelhofer Feld's main rule is simple: dogs must be off-leash except in designated on-leash zones. This reverse policy makes it a mecca for dogs who need space to run. The vast former runways offer uninterrupted sight lines - you can see your dog from hundreds of meters away.

**Why It's Special:**
The open grasslands flanking the old runways create natural off-leash zones where dogs socialize freely. On any given day, you'll see dozens of dogs playing together, from tiny dachshunds to great danes. The space is so large that even shy dogs can find their comfort zone.

**Layout & Zones:**
- **The Runways**: Remain paved, popular with cyclists and skaters (dogs allowed but keep them aside)
- **The Grasslands**: Massive meadows on both sides of runways - this is where dogs run free
- **Community Gardens**: On-leash only areas (clearly marked)
- **BBQ Zones**: Dogs welcome if well-behaved

**Best Features for Dogs:**
- No obstacles or hidden corners - total visibility
- Natural pack behavior as dogs form temporary play groups
- Space for any activity: fetch, frisbee, agility practice, or just running
- Flat terrain ideal for older dogs or those recovering from injury
- Different areas have different dog "cultures" - find your pack

**Practical Information:**
Open from sunrise to sunset year-round. Main entrances at Columbiadamm, Tempelhofer Damm, and Oderstraße. No parking inside but bike stands at all gates. Limited facilities inside the park:
- Portable toilets at entrances (basic)
- No dog water stations - bring plenty of water
- Mobile food vendors on weekends (some allow dogs at tables)
- Dog waste bags provided at entrances

**Weather Considerations:**
This is an exposed site - fantastic in nice weather but brutal in Berlin winters. Strong winds are common. Summer can be hot with limited shade (stick to mornings/evenings). Rain makes the grass muddy but most dogs love it.

**Social Scene:**
Morning regular groups form informal dog clubs. Weekend afternoons are peak social time with hundreds of dogs. For training or calm walks, visit early weekday mornings. The community is friendly and diverse - everyone from families to dog sports enthusiasts.

**Important Rules:**
- Pick up waste (strictly enforced with fines up to €35)
- Dogs must be under voice control even off-leash
- Leash near community gardens and during protected bird breeding season (April-May in some areas)
- Respect the on-leash zones (clearly signed)

This isn't just a park - it's a dog philosophy. Berlin's trust-based approach to dog ownership shines here.`
  }
};

async function enrichDescriptions() {
  console.log('🎨 Starting place description enrichment...\n');

  let updated = 0;
  let skipped = 0;

  for (const [slug, descriptions] of Object.entries(ENRICHED_DESCRIPTIONS)) {
    try {
      const place = await prisma.place.findFirst({
        where: { slug },
      });

      if (!place) {
        console.log(`⚠️  Place not found: ${slug}`);
        skipped++;
        continue;
      }

      await prisma.place.update({
        where: { id: place.id },
        data: {
          shortDescription: descriptions.short,
          fullDescription: descriptions.full,
        },
      });

      console.log(`✅ Updated: ${place.name}`);
      updated++;

    } catch (error) {
      console.error(`❌ Error updating ${slug}:`, error);
      skipped++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✨ Enrichment complete!`);
  console.log(`   Updated: ${updated} places`);
  console.log(`   Skipped: ${skipped} places`);
  console.log('='.repeat(50));
}

enrichDescriptions()
  .catch((e) => {
    console.error('❌ Enrichment failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
