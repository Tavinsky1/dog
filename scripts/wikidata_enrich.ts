#!/usr/bin/env ts-node
/**
 * Wikidata Enrichment Script
 * 
 * Resolves Wikidata IDs to Wikimedia Commons images (P18 property).
 * Works with local Wikidata dumps or pre-extracted TSV files.
 * 
 * Usage:
 *   npm run wikidata-enrich -- --matches osm_matches.csv --wikidata wikidata_p18.tsv --output wikimedia_candidates.csv
 * 
 * Input formats:
 *   osm_matches.csv: slug,osm_id,osm_type,name,image_url,wikidata
 *   wikidata_p18.tsv: qid<TAB>commons_file
 * 
 * Output format (wikimedia_candidates.csv):
 *   slug,commons_file,author,license,source_url
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

interface OSMMatch {
  slug: string;
  osm_id: string;
  osm_type: string;
  name: string;
  image_url?: string;
  wikidata?: string;
}

interface WikidataImage {
  qid: string;
  commons_file: string;
}

interface WikimediaCandidate {
  slug: string;
  commons_file: string;
  author: string;
  license: string;
  source_url: string;
}

/**
 * Build Commons file URL
 */
function buildCommonsUrl(filename: string): string {
  // Remove "File:" prefix if present
  const cleanName = filename.replace(/^File:/, '');
  
  // Encode the filename
  const encoded = encodeURIComponent(cleanName.replace(/ /g, '_'));
  
  return `https://commons.wikimedia.org/wiki/File:${encoded}`;
}

/**
 * Build Commons direct image URL
 */
function buildCommonsDirectUrl(filename: string): string {
  const cleanName = filename.replace(/^File:/, '').replace(/ /g, '_');
  const md5 = require('crypto').createHash('md5').update(cleanName).digest('hex');
  const a = md5[0];
  const b = md5.substring(0, 2);
  
  return `https://upload.wikimedia.org/wikipedia/commons/${a}/${b}/${encodeURIComponent(cleanName)}`;
}

/**
 * Load Wikidata P18 mappings from TSV
 */
function loadWikidataP18(tsvPath: string): Map<string, string> {
  console.log(`Loading Wikidata P18 mappings from ${tsvPath}...`);
  
  const content = readFileSync(tsvPath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  
  const map = new Map<string, string>();
  
  for (const line of lines) {
    const [qid, commonsFile] = line.split('\t');
    if (qid && commonsFile) {
      map.set(qid.trim(), commonsFile.trim());
    }
  }
  
  console.log(`Loaded ${map.size} Wikidata → Commons mappings`);
  return map;
}

/**
 * Enrich OSM matches with Wikidata images
 */
function enrichWithWikidata(
  matches: OSMMatch[],
  wikidataMap: Map<string, string>
): WikimediaCandidate[] {
  const candidates: WikimediaCandidate[] = [];
  
  for (const match of matches) {
    if (!match.wikidata) continue;
    
    const qid = match.wikidata.replace(/^Q/, '');
    const commonsFile = wikidataMap.get(`Q${qid}`) || wikidataMap.get(qid);
    
    if (!commonsFile) {
      console.log(`⚠ No Commons image for ${match.slug} (${match.wikidata})`);
      continue;
    }
    
    candidates.push({
      slug: match.slug,
      commons_file: commonsFile,
      author: 'Unknown', // Will be fetched from Commons API or metadata
      license: 'CC-BY-SA-4.0', // Default for Commons, should be verified
      source_url: buildCommonsUrl(commonsFile)
    });
    
    console.log(`✓ Found Commons image for ${match.slug}: ${commonsFile}`);
  }
  
  return candidates;
}

/**
 * Alternative: Query Wikidata SPARQL endpoint (requires network)
 * This is commented out as it requires online access, but provided for reference
 */
async function queryWikidataSPARQL(qids: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  
  // Batch queries to avoid timeout
  const batchSize = 50;
  
  for (let i = 0; i < qids.length; i += batchSize) {
    const batch = qids.slice(i, i + batchSize);
    const values = batch.map(qid => `wd:${qid}`).join(' ');
    
    const query = `
      SELECT ?item ?image WHERE {
        VALUES ?item { ${values} }
        ?item wdt:P18 ?image.
      }
    `;
    
    const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}&format=json`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'DogAtlas/1.0 (photo enrichment; offline pipeline)'
        }
      });
      
      if (!response.ok) {
        console.error(`SPARQL query failed: ${response.status}`);
        continue;
      }
      
      const data = await response.json() as any;
      
      for (const binding of data.results.bindings) {
        const qid = binding.item.value.replace('http://www.wikidata.org/entity/', '');
        const imageUrl = binding.image.value;
        const filename = decodeURIComponent(imageUrl.split('/').pop() || '');
        
        map.set(qid, filename);
      }
      
      // Rate limit
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`SPARQL query error:`, error);
    }
  }
  
  return map;
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const matchesPath = args[args.indexOf('--matches') + 1];
  const wikidataPath = args[args.indexOf('--wikidata') + 1];
  const outputPath = args[args.indexOf('--output') + 1] || 'wikimedia_candidates.csv';
  const useSparql = args.includes('--sparql');

  if (!matchesPath) {
    console.error('Usage: npm run wikidata-enrich -- --matches <matches-csv> [--wikidata <tsv-file>] [--sparql] [--output <output-csv>]');
    process.exit(1);
  }

  if (!existsSync(matchesPath)) {
    console.error(`Matches file not found: ${matchesPath}`);
    process.exit(1);
  }

  console.log('Reading OSM matches...');
  const matchesCSV = readFileSync(matchesPath, 'utf-8');
  const matches: OSMMatch[] = parse(matchesCSV, {
    columns: true,
    skip_empty_lines: true
  });

  console.log(`Loaded ${matches.length} matches`);
  
  const matchesWithWikidata = matches.filter(m => m.wikidata);
  console.log(`${matchesWithWikidata.length} have Wikidata IDs`);

  let candidates: WikimediaCandidate[];

  if (useSparql) {
    console.log('Querying Wikidata SPARQL endpoint...');
    const qids = matchesWithWikidata.map(m => m.wikidata!);
    const wikidataMap = await queryWikidataSPARQL(qids);
    candidates = enrichWithWikidata(matchesWithWikidata, wikidataMap);
  } else {
    if (!wikidataPath || !existsSync(wikidataPath)) {
      console.error('Wikidata TSV file required (or use --sparql for online query)');
      console.error('Download from: https://query.wikidata.org/ or prepare a TSV with format: qid<TAB>commons_file');
      process.exit(1);
    }

    const wikidataMap = loadWikidataP18(wikidataPath);
    candidates = enrichWithWikidata(matchesWithWikidata, wikidataMap);
  }

  console.log(`\nFound ${candidates.length} Wikimedia Commons candidates`);

  // Write output
  const outputCSV = stringify(candidates, {
    header: true,
    columns: ['slug', 'commons_file', 'author', 'license', 'source_url']
  });

  writeFileSync(outputPath, outputCSV);
  console.log(`Wrote candidates to: ${outputPath}`);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
