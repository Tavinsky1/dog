-- CreateTable
CREATE TABLE "PlacePhoto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "placeId" TEXT NOT NULL,
    "cdnUrl" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "format" TEXT NOT NULL,
    "author" TEXT,
    "license" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "osmId" TEXT,
    "wikidataId" TEXT,
    "source" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PlacePhoto_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Place" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "region" TEXT,
    "country" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "fullDescription" TEXT,
    "imageUrl" TEXT,
    "gallery" JSONB,
    "dogFriendlyLevel" INTEGER,
    "amenities" JSONB,
    "rules" TEXT,
    "websiteUrl" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "priceRange" TEXT,
    "openingHours" TEXT,
    "rating" REAL,
    "tags" JSONB,
    "source" TEXT,
    "primaryPhotoId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Place_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Place_primaryPhotoId_fkey" FOREIGN KEY ("primaryPhotoId") REFERENCES "PlacePhoto" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Place" ("amenities", "cityId", "country", "createdAt", "dogFriendlyLevel", "email", "fullDescription", "gallery", "id", "imageUrl", "lat", "lng", "name", "openingHours", "phone", "priceRange", "rating", "region", "rules", "shortDescription", "slug", "source", "tags", "type", "updatedAt", "websiteUrl") SELECT "amenities", "cityId", "country", "createdAt", "dogFriendlyLevel", "email", "fullDescription", "gallery", "id", "imageUrl", "lat", "lng", "name", "openingHours", "phone", "priceRange", "rating", "region", "rules", "shortDescription", "slug", "source", "tags", "type", "updatedAt", "websiteUrl" FROM "Place";
DROP TABLE "Place";
ALTER TABLE "new_Place" RENAME TO "Place";
CREATE UNIQUE INDEX "Place_slug_key" ON "Place"("slug");
CREATE UNIQUE INDEX "Place_primaryPhotoId_key" ON "Place"("primaryPhotoId");
CREATE INDEX "Place_cityId_idx" ON "Place"("cityId");
CREATE INDEX "Place_type_idx" ON "Place"("type");
CREATE INDEX "Place_slug_idx" ON "Place"("slug");
CREATE INDEX "Place_primaryPhotoId_idx" ON "Place"("primaryPhotoId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "PlacePhoto_placeId_status_idx" ON "PlacePhoto"("placeId", "status");

-- CreateIndex
CREATE INDEX "PlacePhoto_status_idx" ON "PlacePhoto"("status");

-- CreateIndex
CREATE INDEX "PlacePhoto_source_idx" ON "PlacePhoto"("source");
