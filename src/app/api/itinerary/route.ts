import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";

const requestSchema = z.object({
  city: z.object({
    name: z.string(),
    slug: z.string().optional(),
  }),
  places: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.string(),
        shortDescription: z.string().optional().nullable(),
      })
    )
    .min(1),
});

type PlacePayload = z.infer<typeof requestSchema>['places'][number];

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(request: NextRequest) {
  let city: { name: string; slug?: string };
  let places: PlacePayload[];

  try {
    const body = await request.json();
    const parsed = requestSchema.parse(body);
    city = parsed.city;
    places = parsed.places;
  } catch (error) {
    console.error("Failed to parse request body:", error);
    return NextResponse.json(
      { error: "Invalid request format" },
      { status: 400 }
    );
  }

  try {
    // Check if Gemini API is available
    if (!process.env.GOOGLE_AI_API_KEY) {
      // Fallback to simple algorithm if no API key
      return generateSimpleItinerary(city, places);
    }

    // Create prompt for Gemini
    const placesText = places.map(place => 
      `- ${place.name} (${place.type.replace(/_/g, ' ')}): ${place.shortDescription || 'A great dog-friendly spot'}`
    ).join('\n');

    const prompt = `You are a friendly and creative travel planner specializing in dog-friendly experiences. 

Create a one-day itinerary for exploring ${city.name} with a dog. Use only the places from this list:

${placesText}

Organize them into a logical daily flow (morning, afternoon, evening) with creative descriptions that make the experience sound exciting and practical for both dogs and their humans. Make it personal and engaging.

Return your response as a JSON object with this structure:
{
  "segments": [
    {
      "title": "Morning in ${city.name}",
      "description": "Start your adventure at..."
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const parsed = JSON.parse(text);
      if (parsed.segments && Array.isArray(parsed.segments)) {
        return NextResponse.json(parsed);
      }
    } catch {
      // If JSON parsing fails, fallback to simple algorithm
    }

    return generateSimpleItinerary(city, places);
  } catch (error) {
    console.error("Itinerary generation failed", error);
    // Fallback to simple algorithm on error
    return generateSimpleItinerary(city, places);
  }
}

// Fallback simple algorithm
function generateSimpleItinerary(city: { name: string; slug?: string }, places: PlacePayload[]) {
  const dayParts = [
    { title: "Morning", preferences: ["park", "trail", "beach", "activity"] },
    { title: "Afternoon", preferences: ["cafe", "store", "activity", "park"] },
    { title: "Evening", preferences: ["cafe", "hotel", "activity", "park"] },
  ];

  function formatType(type: string) {
    return type
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function pickPlace(preferences: string[], available: PlacePayload[]): PlacePayload | undefined {
    const preferred = available.find((place) => preferences.some(pref => place.type.includes(pref)));
    return preferred ?? available[0];
  }

  const remaining = [...places];
  const segments = dayParts
    .map((part) => {
      const choice = pickPlace(part.preferences, remaining);
      if (!choice) return null;

      const index = remaining.findIndex((item) => item.id === choice.id);
      if (index >= 0) {
        remaining.splice(index, 1);
      }

      const intro = part.title === "Morning" ? "Start" : part.title === "Evening" ? "Wrap up" : "Continue";
      const summary = choice.shortDescription?.trim() || `Enjoy this ${formatType(choice.type).toLowerCase()} with your pup.`;

      return {
        title: `${part.title} in ${city.name}`,
        description: `${intro} your dog-friendly day at ${choice.name}. ${summary}`,
      };
    })
    .filter(Boolean) as { title: string; description: string }[];

  if (remaining.length) {
    const extra = remaining[0];
    segments.push({
      title: "Bonus idea",
      description: `If you have extra time, head to ${extra.name} — a ${formatType(extra.type).toLowerCase()} that is popular with local dog guardians.`,
    });
  }

  return NextResponse.json({ segments });
}
