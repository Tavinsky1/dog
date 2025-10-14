# Image Gallery Feature - Multiple Photos Per Place

## 🎯 Enhancement Overview

**Previous:** Scraper downloaded only 1 image per place
**Now:** Scraper collects up to 5 images per place for a rich gallery experience!

## ✨ How It Works

### 1. Website Scraping (Strategy 1)
When scraping from a place's official website, the scraper now:
- Collects **up to 5 high-quality images** from the page
- Prioritizes by size (largest images first)
- Filters out logos, icons, and avatars
- Validates each image before downloading

### 2. Search Engine Fallback (Strategies 2-5)
If the website doesn't have images, search engines provide 1 primary image:
- DuckDuckGo, Bing, Google, or existing Google Places image
- Single image only (search engines don't provide multiple results easily)

### 3. Database Storage
Images are stored in two fields:
- **`imageUrl`**: Primary/hero image (always present)
- **`gallery`**: Array of additional images (JSON field)

Example:
```json
{
  "imageUrl": "/images/places/abc123-cafe-name.jpg",
  "gallery": [
    "/images/places/abc123-cafe-name-2.jpg",
    "/images/places/abc123-cafe-name-3.jpg",
    "/images/places/abc123-cafe-name-4.jpg",
    "/images/places/abc123-cafe-name-5.jpg"
  ]
}
```

## 📊 Expected Results

### Places with Good Websites (~40%)
- **Primary image** + **2-5 gallery images**
- Total: 3-5 photos per place
- Examples: Hotels, restaurants, parks with official sites

### Places Without Websites (~60%)
- **1 primary image** from search engines
- No gallery (search engines only provide 1 result)
- Examples: Public parks, trails, small shops

## 🖼️ File Naming Convention

Images are saved with unique filenames:
- Primary: `{placeId}-{sanitized-name}.jpg`
- Gallery: `{placeId}-{sanitized-name}-2.jpg`, `-3.jpg`, etc.

Example for "Café am Neuen See":
```
/images/places/abc123-caf-am-neuen-see.jpg      (primary)
/images/places/abc123-caf-am-neuen-see-2.jpg    (gallery)
/images/places/abc123-caf-am-neuen-see-3.jpg    (gallery)
/images/places/abc123-caf-am-neuen-see-4.jpg    (gallery)
```

## 💻 Displaying the Gallery in Your App

### On Place Detail Page

```tsx
// app/[city]/[placeSlug]/page.tsx
import Image from 'next/image';

export default function PlacePage({ place }) {
  const galleryImages = place.gallery || [];
  
  return (
    <div>
      {/* Hero/Primary Image */}
      <Image 
        src={place.imageUrl} 
        alt={place.name}
        width={1200}
        height={600}
        className="w-full h-96 object-cover"
      />
      
      {/* Gallery Grid */}
      {galleryImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {galleryImages.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt={`${place.name} - Photo ${index + 2}`}
              width={300}
              height={300}
              className="rounded-lg object-cover cursor-pointer hover:opacity-80"
              onClick={() => openLightbox(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

### On City Map/List (Show Primary Only)

```tsx
// components/PlaceCard.tsx
<Image 
  src={place.imageUrl} 
  alt={place.name}
  width={400}
  height={300}
  className="w-full h-48 object-cover"
/>
<span className="text-xs text-gray-500">
  {place.gallery?.length > 0 && `+${place.gallery.length} more photos`}
</span>
```

## 🎨 Gallery UI Suggestions

### Option 1: Simple Grid
Show all images in a responsive grid on the place page.

### Option 2: Carousel/Slider
Use a library like `swiper` or `react-slick`:
```bash
npm install swiper
```

### Option 3: Lightbox
Click to expand images in a modal:
```bash
npm install yet-another-react-lightbox
```

## 📈 Performance Considerations

### Image Optimization
- All images are converted to progressive JPEG (quality 85)
- Resized to max 1200x1200 (maintains aspect ratio)
- Next.js Image component automatically optimizes further

### Loading Strategy
```tsx
// Lazy load gallery images
<Image 
  src={img}
  loading="lazy"
  placeholder="blur"
/>
```

## 🔧 Configuration

Current settings in `imageScraperV2.ts`:
```typescript
maxGalleryImages: 5  // Collect up to 5 images per place
```

To change the number of gallery images:
1. Edit `CONFIG.maxGalleryImages` in the script
2. Re-run the scraper

## 📊 Statistics to Expect

After scraping completes:
- **~40 places**: 3-5 photos each (from websites)
- **~100 places**: 1 photo each (from search engines)
- **~26 places**: 1 photo (existing Google Places)

**Total images collected**: ~300-400 images for 166 places
**Average**: 2-2.5 photos per place

## 🚀 Benefits

1. **Richer Experience**: Users see multiple angles/views of each place
2. **Better Discovery**: Gallery helps users decide if they want to visit
3. **Professional Look**: Matches expectations from travel/review sites
4. **SEO Boost**: More images = better image search visibility
5. **User Trust**: Multiple real photos build credibility

## 🎯 Next Steps

1. **Let scraper complete** - It's now collecting galleries
2. **Check database** - Verify `gallery` field has arrays
3. **Update UI** - Add gallery display to place pages
4. **Add lightbox** - Make images clickable for full view
5. **Monitor storage** - 300-400 images will use ~50-100MB

---

**Status**: ✅ Gallery feature implemented and running
**Images per place**: Up to 5 (average 2-2.5)
**Storage format**: Primary in `imageUrl`, additional in `gallery` JSON array
