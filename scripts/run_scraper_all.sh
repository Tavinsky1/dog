#!/bin/bash

# List of cities to process
cities=(
  "new-york"
  "los-angeles"
  "buenos-aires"
  "copenhagen"
)

for city in "${cities[@]}"; do
  echo "----------------------------------------------------------------"
  echo "Starting scraper for: $city"
  echo "----------------------------------------------------------------"
  npx tsx scripts/imageScraperV2.ts "$city"
  
  if [ $? -ne 0 ]; then
    echo "❌ Error scraping $city. Continuing to next city..."
  else
    echo "✅ Finished $city"
  fi
  
  echo "Waiting 10 seconds before next city..."
  sleep 10
done

echo "🎉 All cities processed!"
