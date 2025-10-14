-- CreateEnum
CREATE TYPE "PhotoStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Place" ADD COLUMN "primaryPhotoId" TEXT;

-- CreateTable
CREATE TABLE "PlacePhoto" (
    "id" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "cdnUrl" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "format" TEXT NOT NULL,
    "author" TEXT,
    "license" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "status" "PhotoStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "osmId" TEXT,
    "wikidataId" TEXT,
    "source" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlacePhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Place_primaryPhotoId_key" ON "Place"("primaryPhotoId");

-- CreateIndex
CREATE INDEX "Place_primaryPhotoId_idx" ON "Place"("primaryPhotoId");

-- CreateIndex
CREATE INDEX "PlacePhoto_placeId_status_idx" ON "PlacePhoto"("placeId", "status");

-- CreateIndex
CREATE INDEX "PlacePhoto_status_idx" ON "PlacePhoto"("status");

-- CreateIndex
CREATE INDEX "PlacePhoto_source_idx" ON "PlacePhoto"("source");

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_primaryPhotoId_fkey" FOREIGN KEY ("primaryPhotoId") REFERENCES "PlacePhoto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlacePhoto" ADD CONSTRAINT "PlacePhoto_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;
