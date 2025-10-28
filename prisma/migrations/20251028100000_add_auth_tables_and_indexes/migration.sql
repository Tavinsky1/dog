/*
  Warnings:

  - You are about to drop the `PlacePhoto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `primaryPhotoId` on the `Place` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "PlacePhoto_source_idx";

-- DropIndex
DROP INDEX "PlacePhoto_status_idx";

-- DropIndex
DROP INDEX "PlacePhoto_placeId_status_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PlacePhoto";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Place_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Place" ("amenities", "cityId", "country", "createdAt", "dogFriendlyLevel", "email", "fullDescription", "gallery", "id", "imageUrl", "lat", "lng", "name", "openingHours", "phone", "priceRange", "rating", "region", "rules", "shortDescription", "slug", "source", "tags", "type", "updatedAt", "websiteUrl") SELECT "amenities", "cityId", "country", "createdAt", "dogFriendlyLevel", "email", "fullDescription", "gallery", "id", "imageUrl", "lat", "lng", "name", "openingHours", "phone", "priceRange", "rating", "region", "rules", "shortDescription", "slug", "source", "tags", "type", "updatedAt", "websiteUrl" FROM "Place";
DROP TABLE "Place";
ALTER TABLE "new_Place" RENAME TO "Place";
CREATE UNIQUE INDEX "Place_slug_key" ON "Place"("slug");
CREATE INDEX "Place_cityId_idx" ON "Place"("cityId");
CREATE INDEX "Place_type_idx" ON "Place"("type");
CREATE INDEX "Place_slug_idx" ON "Place"("slug");
CREATE INDEX "Place_rating_idx" ON "Place"("rating");
CREATE INDEX "Place_lat_lng_idx" ON "Place"("lat", "lng");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
