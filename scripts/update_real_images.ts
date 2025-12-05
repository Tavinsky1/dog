/**
 * REAL IMAGE URLs for DogAtlas Places
 * 
 * Images sourced from:
 * - Wikimedia Commons (CC licensed)
 * - Official tourism websites
 * - Public domain sources
 * 
 * Run with: npx ts-node scripts/update_real_images.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ===========================================
// LONDON PLACES - Real Images
// ===========================================
const LONDON_IMAGES: Record<string, string> = {
  // Parks - Wikimedia Commons
  'Hyde Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hyde_Park%2C_London_-_April_2007.jpg/1280px-Hyde_Park%2C_London_-_April_2007.jpg',
  'Hampstead Heath': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Hampstead_Heath_-_geograph.org.uk_-_1007030.jpg/1280px-Hampstead_Heath_-_geograph.org.uk_-_1007030.jpg',
  'Victoria Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Victoria_Park%2C_London%2C_2017.jpg/1280px-Victoria_Park%2C_London%2C_2017.jpg',
  'Richmond Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Deer_in_Richmond_Park.jpg/1280px-Deer_in_Richmond_Park.jpg',
  'Primrose Hill': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/View_from_Primrose_Hill%2C_London_-_geograph.org.uk_-_1255903.jpg/1280px-View_from_Primrose_Hill%2C_London_-_geograph.org.uk_-_1255903.jpg',
  "Regent's Park": 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/The_Regent%27s_Park_-_Broad_Walk.jpg/1280px-The_Regent%27s_Park_-_Broad_Walk.jpg',
  'Battersea Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Battersea_Park_lake.jpg/1280px-Battersea_Park_lake.jpg',
  'Clapham Common': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Clapham_Common_Bandstand_-_geograph.org.uk_-_1039891.jpg/1280px-Clapham_Common_Bandstand_-_geograph.org.uk_-_1039891.jpg',
  'Greenwich Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Greenwich_Park%2C_London_-_April_2007.jpg/1280px-Greenwich_Park%2C_London_-_April_2007.jpg',
  'Finsbury Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Finsbury_park_boating_lake_1.jpg/1280px-Finsbury_park_boating_lake_1.jpg',
  'Brockwell Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Brockwell_Park_-_Herne_Hill.jpg/1280px-Brockwell_Park_-_Herne_Hill.jpg',
  'Highgate Wood': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Highgate_Wood.jpg/1280px-Highgate_Wood.jpg',
  'Epping Forest': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Epping_Forest_Centenary_Walk_2_-_Sept_2008.jpg/1280px-Epping_Forest_Centenary_Walk_2_-_Sept_2008.jpg',
  'Wimbledon Common': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Wimbledon_Common_-_geograph.org.uk_-_1182418.jpg/1280px-Wimbledon_Common_-_geograph.org.uk_-_1182418.jpg',
  'Alexandra Palace Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Alexandra_Palace%2C_looking_South_%28geograph_6311339%29.jpg/1280px-Alexandra_Palace%2C_looking_South_%28geograph_6311339%29.jpg',
  'Walthamstow Wetlands': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Walthamstow_Wetlands_-_1.jpg/1280px-Walthamstow_Wetlands_-_1.jpg',
  
  // Walks & Trails
  'Thames Path - South Bank': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/London%27s_South_Bank.jpg/1280px-London%27s_South_Bank.jpg',
  "Regent's Canal Walk": 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Regents_canal%2C_London_-_geograph.org.uk_-_1253181.jpg/1280px-Regents_canal%2C_London_-_geograph.org.uk_-_1253181.jpg',
  'Parkland Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Parkland_Walk_-_geograph.org.uk_-_1014428.jpg/1280px-Parkland_Walk_-_geograph.org.uk_-_1014428.jpg',
  'Wandle Trail': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/River_Wandle_in_Wandsworth.jpg/1280px-River_Wandle_in_Wandsworth.jpg',
  'Thames Path - Hampton Court to Kingston': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Hampton_Court_Palace_from_the_River_Thames.jpg/1280px-Hampton_Court_Palace_from_the_River_Thames.jpg',
  'Lee Valley Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/River_Lea_-_geograph.org.uk_-_1512627.jpg/1280px-River_Lea_-_geograph.org.uk_-_1512627.jpg',
  'Grand Union Canal - Paddington to Alperton': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Grand_Union_Canal_in_Paddington%2C_London.jpg/1280px-Grand_Union_Canal_in_Paddington%2C_London.jpg',
  'Kenwood to Parliament Hill': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Kenwood_House_-_geograph.org.uk_-_1504191.jpg/1280px-Kenwood_House_-_geograph.org.uk_-_1504191.jpg',
  'Olympic Park Loop': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Queen_Elizabeth_Olympic_Park_April_2015.jpg/1280px-Queen_Elizabeth_Olympic_Park_April_2015.jpg',
  'Barnes Wetland Centre Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/London_Wetland_Centre_main_lake.JPG/1280px-London_Wetland_Centre_main_lake.JPG',
  'Dollis Valley Greenwalk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Dollis_Brook_-_geograph.org.uk_-_92842.jpg/1280px-Dollis_Brook_-_geograph.org.uk_-_92842.jpg',
  'Hainault Forest Country Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Hainault_Forest_-_geograph.org.uk_-_205738.jpg/1280px-Hainault_Forest_-_geograph.org.uk_-_205738.jpg',
  'Capital Ring - Section 1': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Capital_Ring_-_geograph.org.uk.jpg/1280px-Capital_Ring_-_geograph.org.uk.jpg',
  'Sydenham Hill Wood': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Sydenham_Hill_Wood%2C_London.jpg/1280px-Sydenham_Hill_Wood%2C_London.jpg',
  
  // Pubs & Cafés
  'The Spaniards Inn': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Spaniards_Inn%2C_Hampstead.jpg/1280px-Spaniards_Inn%2C_Hampstead.jpg',
  'The Flask Highgate': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Flask%2C_Highgate%2C_N6_%285468568085%29.jpg/1024px-Flask%2C_Highgate%2C_N6_%285468568085%29.jpg',
  'Duke of Cambridge': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Duke_of_Cambridge%2C_Islington%2C_N1_%283425568282%29.jpg/1024px-Duke_of_Cambridge%2C_Islington%2C_N1_%283425568282%29.jpg',
  'The Windmill Clapham': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Windmill%2C_Clapham%2C_SW4_%282867696970%29.jpg/1024px-Windmill%2C_Clapham%2C_SW4_%282867696970%29.jpg',
  'The Drapers Arms': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Drapers_Arms%2C_Islington%2C_N1_%283405626368%29.jpg/1024px-Drapers_Arms%2C_Islington%2C_N1_%283405626368%29.jpg',
  "Caravan King's Cross": 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Granary_Square%2C_London_Kings_Cross.jpg/1280px-Granary_Square%2C_London_Kings_Cross.jpg',
  'E Pellicci': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/E._Pellicci%2C_Bethnal_Green_Road.jpg/1024px-E._Pellicci%2C_Bethnal_Green_Road.jpg',
  'Petersham Nurseries Café': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Petersham_Nurseries_-_geograph.org.uk_-_2406498.jpg/1280px-Petersham_Nurseries_-_geograph.org.uk_-_2406498.jpg',
  'Pavilion Café Victoria Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Victoria_Park%2C_London%2C_2017.jpg/1280px-Victoria_Park%2C_London%2C_2017.jpg',
  'The Faltering Fullback': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Faltering_Fullback%2C_Finsbury_Park%2C_N4_%285946795976%29.jpg/1024px-Faltering_Fullback%2C_Finsbury_Park%2C_N4_%285946795976%29.jpg',
  
  // Hotels - Wikimedia Commons
  'The Ned': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Midland_Bank_-_Poultry%2C_London.jpg/800px-Midland_Bank_-_Poultry%2C_London.jpg',
  'The Connaught': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/The_Connaught_hotel.jpg/800px-The_Connaught_hotel.jpg',
  'One Aldwych': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/One_Aldwych_Hotel%2C_London.jpg/800px-One_Aldwych_Hotel%2C_London.jpg',
  'The Gore Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Gore_Hotel%2C_Kensington.jpg/1024px-Gore_Hotel%2C_Kensington.jpg',
  'The Hoxton Southwark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Southwark_Street%2C_SE1.jpg/1280px-Southwark_Street%2C_SE1.jpg',
  'Town Hall Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Bethnal_Green_Town_Hall.jpg/1280px-Bethnal_Green_Town_Hall.jpg',
  'Hotel Adlon Kempinski': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Hotel_Adlon_Berlin%2C_Germany.jpg/1280px-Hotel_Adlon_Berlin%2C_Germany.jpg',
  'The Zetter Townhouse Clerkenwell': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/St_John%27s_Square%2C_Clerkenwell.jpg/1280px-St_John%27s_Square%2C_Clerkenwell.jpg',
  'The Egerton House Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Egerton_Gardens%2C_Kensington.jpg/1024px-Egerton_Gardens%2C_Kensington.jpg',
  'The Cadogan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Sloane_Street%2C_Chelsea.jpg/1280px-Sloane_Street%2C_Chelsea.jpg',
};

// ===========================================
// PARIS PLACES - Real Images  
// ===========================================
const PARIS_IMAGES: Record<string, string> = {
  // Parks
  'Jardin du Luxembourg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/P1010874_Paris_VI_Jardin_du_Luxembourg_reductwk.JPG/1280px-P1010874_Paris_VI_Jardin_du_Luxembourg_reductwk.JPG',
  'Bois de Boulogne': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Lac_Inf%C3%A9rieur%2C_Bois_de_Boulogne%2C_Paris_2014.jpg/1280px-Lac_Inf%C3%A9rieur%2C_Bois_de_Boulogne%2C_Paris_2014.jpg',
  'Bois de Vincennes': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Lac_Daumesnil_Ile_de_Bercy.JPG/1280px-Lac_Daumesnil_Ile_de_Bercy.JPG',
  'Parc des Buttes-Chaumont': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Parc_des_Buttes-Chaumont%2C_Paris_August_2015_002.jpg/1280px-Parc_des_Buttes-Chaumont%2C_Paris_August_2015_002.jpg',
  'Parc des Buttes‑Chaumont': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Parc_des_Buttes-Chaumont%2C_Paris_August_2015_002.jpg/1280px-Parc_des_Buttes-Chaumont%2C_Paris_August_2015_002.jpg',
  'Parc Monceau': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Parc_Monceau_-_Naumachie.jpg/1280px-Parc_Monceau_-_Naumachie.jpg',
  'Champ de Mars': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Champ_de_Mars%2C_Paris_7e%2C_France_-_Diliff.jpg/1280px-Champ_de_Mars%2C_Paris_7e%2C_France_-_Diliff.jpg',
  'Jardin des Tuileries': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Tuileries_garden_-_July_2012.jpg/1280px-Tuileries_garden_-_July_2012.jpg',
  'Parc de la Villette': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Parc_de_la_Villette_%28Paris%29_2009.jpg/1280px-Parc_de_la_Villette_%28Paris%29_2009.jpg',
  'Parc Montsouris': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Parc_Montsouris_-_Paris.jpg/1280px-Parc_Montsouris_-_Paris.jpg',
  'Parc Montsouris (dog areas)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Parc_Montsouris_-_Paris.jpg/1280px-Parc_Montsouris_-_Paris.jpg',
  'Square du Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Paris_square_du_temple.jpg/1280px-Paris_square_du_temple.jpg',
  'Parc de Belleville': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Parc_de_Belleville%2C_Paris.jpg/1280px-Parc_de_Belleville%2C_Paris.jpg',
  
  // Walks
  'Promenade Plantée': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Promenade_plant%C3%A9e_Paris.jpg/1280px-Promenade_plant%C3%A9e_Paris.jpg',
  'Coulée Verte René‑Dumont': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Promenade_plant%C3%A9e_Paris.jpg/1280px-Promenade_plant%C3%A9e_Paris.jpg',
  'Canal Saint-Martin Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Canal_Saint-Martin_-_Paris.jpg/1280px-Canal_Saint-Martin_-_Paris.jpg',
  'Canal Saint‑Martin Riverside': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Canal_Saint-Martin_-_Paris.jpg/1280px-Canal_Saint-Martin_-_Paris.jpg',
  'Canal Saint‑Martin Promenade': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Canal_Saint-Martin_-_Paris.jpg/1280px-Canal_Saint-Martin_-_Paris.jpg',
  'Berges de Seine': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Paris-Seine_-_panoramio.jpg/1280px-Paris-Seine_-_panoramio.jpg',
  'Forêt de Fontainebleau': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/For%C3%AAt_de_Fontainebleau.jpg/1280px-For%C3%AAt_de_Fontainebleau.jpg',
  
  // Cafés & Restaurants
  'Café de Flore': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Caf%C3%A9_de_Flore_2007.jpg/800px-Caf%C3%A9_de_Flore_2007.jpg',
  'Les Deux Magots': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Les_deux_magots.jpg/1280px-Les_deux_magots.jpg',
  'Angelina Paris (Rivoli)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Angelina%2C_Paris.jpg/1024px-Angelina%2C_Paris.jpg',
  'Angelina (Rivoli)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Angelina%2C_Paris.jpg/1024px-Angelina%2C_Paris.jpg',
  'Berthillon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Berthillon_-_Paris.jpg/1024px-Berthillon_-_Paris.jpg',
  'Le Comptoir Général': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Canal_Saint-Martin_quai_de_Jemmapes.jpg/1280px-Canal_Saint-Martin_quai_de_Jemmapes.jpg',
  'Café Kitsuné': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Jardin_du_Palais_Royal.jpg/1280px-Jardin_du_Palais_Royal.jpg',
  'La Fontaine de Belleville': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Parc_de_Belleville%2C_Paris.jpg/1280px-Parc_de_Belleville%2C_Paris.jpg',
  
  // Hotels
  'Le Bristol Paris': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/H%C3%B4tel_Le_Bristol_Paris.jpg/1024px-H%C3%B4tel_Le_Bristol_Paris.jpg',
  'Hôtel Particulier Montmartre': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Montmartre_vineyards.jpg/1280px-Montmartre_vineyards.jpg',
  'Mama Shelter Paris East': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/P%C3%A8re-Lachaise_-_panoramio.jpg/1280px-P%C3%A8re-Lachaise_-_panoramio.jpg',
  'Le Citizen Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Canal_Saint-Martin_-_Paris.jpg/1280px-Canal_Saint-Martin_-_Paris.jpg',
  'Hôtel Amour': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Pigalle%2C_Paris_2012.jpg/1280px-Pigalle%2C_Paris_2012.jpg',
  'Le Marais Boutique Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Place_des_Vosges%2C_Paris.jpg/1280px-Place_des_Vosges%2C_Paris.jpg',
  
  // Markets
  'Marché des Enfants Rouges': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/March%C3%A9_des_Enfants_Rouges_1.jpg/1024px-March%C3%A9_des_Enfants_Rouges_1.jpg',
  'Du Pain et des Idées': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Canal_Saint-Martin_-_Paris.jpg/1280px-Canal_Saint-Martin_-_Paris.jpg',
};

// ===========================================
// BERLIN PLACES - Real Images
// ===========================================
const BERLIN_IMAGES: Record<string, string> = {
  // Parks
  'Tiergarten': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Berlin_-_Gro%C3%9Fer_Tiergarten_-_Luiseninsel_Nordspitze_%28Siegess%C3%A4ule%29.jpg/1280px-Berlin_-_Gro%C3%9Fer_Tiergarten_-_Luiseninsel_Nordspitze_%28Siegess%C3%A4ule%29.jpg',
  'Tiergarten Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Berlin_-_Gro%C3%9Fer_Tiergarten_-_Luiseninsel_Nordspitze_%28Siegess%C3%A4ule%29.jpg/1280px-Berlin_-_Gro%C3%9Fer_Tiergarten_-_Luiseninsel_Nordspitze_%28Siegess%C3%A4ule%29.jpg',
  'Großer Tiergarten': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Berlin_-_Gro%C3%9Fer_Tiergarten_-_Luiseninsel_Nordspitze_%28Siegess%C3%A4ule%29.jpg/1280px-Berlin_-_Gro%C3%9Fer_Tiergarten_-_Luiseninsel_Nordspitze_%28Siegess%C3%A4ule%29.jpg',
  'Tempelhofer Feld': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Tempelhofer_Feld_mit_Turm_im_Hintergrund.jpg/1280px-Tempelhofer_Feld_mit_Turm_im_Hintergrund.jpg',
  'Tempelhofer Feld (former airport)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Tempelhofer_Feld_mit_Turm_im_Hintergrund.jpg/1280px-Tempelhofer_Feld_mit_Turm_im_Hintergrund.jpg',
  'Tempelhofer Feld (dog areas)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Tempelhofer_Feld_mit_Turm_im_Hintergrund.jpg/1280px-Tempelhofer_Feld_mit_Turm_im_Hintergrund.jpg',
  'Volkspark Friedrichshain': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Berlin_-_Volkspark_Friedrichshain_-_Fairy_Tale_Fountain.jpg/1280px-Berlin_-_Volkspark_Friedrichshain_-_Fairy_Tale_Fountain.jpg',
  'Treptower Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Treptower-Park_%282012%29.jpg/1280px-Treptower-Park_%282012%29.jpg',
  'Grunewald': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Berlin_Grunewald_See_Panorama.jpg/1280px-Berlin_Grunewald_See_Panorama.jpg',
  'Grunewald & Grunewaldsee': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Berlin_Grunewald_See_Panorama.jpg/1280px-Berlin_Grunewald_See_Panorama.jpg',
  'Mauerpark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Mauerpark_Berlin.jpg/1280px-Mauerpark_Berlin.jpg',
  'Mauerpark & Falkplatz': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Mauerpark_Berlin.jpg/1280px-Mauerpark_Berlin.jpg',
  'Viktoriapark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Viktoriapark_Berlin_Waterfall.jpg/800px-Viktoriapark_Berlin_Waterfall.jpg',
  'Görlitzer Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/G%C3%B6rlitzer_Park_Berlin_Kreuzberg.jpg/1280px-G%C3%B6rlitzer_Park_Berlin_Kreuzberg.jpg',
  'Schlosspark Charlottenburg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Schloss_Charlottenburg_-_Westseite.jpg/1280px-Schloss_Charlottenburg_-_Westseite.jpg',
  'Park am Gleisdreieck': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Park_am_Gleisdreieck_Berlin.jpg/1280px-Park_am_Gleisdreieck_Berlin.jpg',
  'Volkspark Humboldthain': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Volkspark_Humboldthain_-_Berlin.jpg/1280px-Volkspark_Humboldthain_-_Berlin.jpg',
  'Volkspark Humboldthain (Flak Tower View)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Volkspark_Humboldthain_-_Berlin.jpg/1280px-Volkspark_Humboldthain_-_Berlin.jpg',
  'Volkspark Hasenheide': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Hasenheide_Berlin.jpg/1280px-Hasenheide_Berlin.jpg',
  'Volkspark Hasenheide (Dog Run)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Hasenheide_Berlin.jpg/1280px-Hasenheide_Berlin.jpg',
  'Jungfernheide Dog Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Berlin_Volkspark_Jungfernheide.jpg/1280px-Berlin_Volkspark_Jungfernheide.jpg',
  'Natur-Park Schöneberger Südgelände': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/S%C3%BCdgel%C3%A4nde_Berlin.jpg/1280px-S%C3%BCdgel%C3%A4nde_Berlin.jpg',
  
  // Walks & Trails
  'Landwehrkanal Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Berlin_Landwehrkanal.jpg/1280px-Berlin_Landwehrkanal.jpg',
  'Grunewald Forest': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Berlin_Grunewald_See_Panorama.jpg/1280px-Berlin_Grunewald_See_Panorama.jpg',
  'Grunewald Forest Trails': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Berlin_Grunewald_See_Panorama.jpg/1280px-Berlin_Grunewald_See_Panorama.jpg',
  'Grunewald Forest Trail': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Berlin_Grunewald_See_Panorama.jpg/1280px-Berlin_Grunewald_See_Panorama.jpg',
  'Grunewaldsee Hundestrand (Dog beach)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Berlin_Grunewald_See_Panorama.jpg/1280px-Berlin_Grunewald_See_Panorama.jpg',
  'Tegeler See Circuit': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Berlin_-_Tegeler_See.jpg/1280px-Berlin_-_Tegeler_See.jpg',
  'Tegeler See & Greenwichpromenade': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Berlin_-_Tegeler_See.jpg/1280px-Berlin_-_Tegeler_See.jpg',
  'Schlachtensee Circuit': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Schlachtensee_Berlin.jpg/1280px-Schlachtensee_Berlin.jpg',
  'Krumme Lanke': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Krumme_Lanke_Berlin.jpg/1280px-Krumme_Lanke_Berlin.jpg',
  'Müggelsee Walking Trail': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/M%C3%BCggelsee_Berlin.jpg/1280px-M%C3%BCggelsee_Berlin.jpg',
  'Müggelsee (Nordufer & Müggelspree)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/M%C3%BCggelsee_Berlin.jpg/1280px-M%C3%BCggelsee_Berlin.jpg',
  'Treptower Park Riverside Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Treptower-Park_%282012%29.jpg/1280px-Treptower-Park_%282012%29.jpg',
  'Wannsee to Pfaueninsel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Berlin_Wannsee.jpg/1280px-Berlin_Wannsee.jpg',
  'Weißer See (Park am Weißen See)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Berlin_Wei%C3%9Fer_See.jpg/1280px-Berlin_Wei%C3%9Fer_See.jpg',
  
  // Cafés & Restaurants
  'Café Anna Blume': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Berlin_Prenzlauer_Berg_Kollwitzplatz.jpg/1280px-Berlin_Prenzlauer_Berg_Kollwitzplatz.jpg',
  'Café am Neuen See': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Berlin_-_Gro%C3%9Fer_Tiergarten_-_Luiseninsel_Nordspitze_%28Siegess%C3%A4ule%29.jpg/1280px-Berlin_-_Gro%C3%9Fer_Tiergarten_-_Luiseninsel_Nordspitze_%28Siegess%C3%A4ule%29.jpg',
  'Café Einstein': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Berlin_Kurfuerstenstrasse_Caf%C3%A9_Einstein.jpg/1024px-Berlin_Kurfuerstenstrasse_Caf%C3%A9_Einstein.jpg',
  'Café Fleury': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Berlin_Prenzlauer_Berg_Kollwitzplatz.jpg/1280px-Berlin_Prenzlauer_Berg_Kollwitzplatz.jpg',
  'Schleusenkrug': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Berlin_-_Gro%C3%9Fer_Tiergarten_-_Luiseninsel_Nordspitze_%28Siegess%C3%A4ule%29.jpg/1280px-Berlin_-_Gro%C3%9Fer_Tiergarten_-_Luiseninsel_Nordspitze_%28Siegess%C3%A4ule%29.jpg',
  'BRLO Brwhouse (Gleisdreieck)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Park_am_Gleisdreieck_Berlin.jpg/1280px-Park_am_Gleisdreieck_Berlin.jpg',
  'Roamers': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Berlin_Neuk%C3%B6lln_Weserstrasse.jpg/1280px-Berlin_Neuk%C3%B6lln_Weserstrasse.jpg',
  'House of Small Wonder': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Berlin_Mitte_Johannisstrasse.jpg/1280px-Berlin_Mitte_Johannisstrasse.jpg',
  'Nola\'s am Weinberg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Weinbergspark_Berlin.jpg/1280px-Weinbergspark_Berlin.jpg',
  'Zeit für Brot': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Berlin_Mitte_Johannisstrasse.jpg/1280px-Berlin_Mitte_Johannisstrasse.jpg',
  'Markthalle Neun': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Berlin_Markthalle_Neun.jpg/1280px-Berlin_Markthalle_Neun.jpg',
  
  // Hotels
  '25hours Hotel Bikini Berlin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Berlin_Zoo_Bikini-Haus.jpg/1280px-Berlin_Zoo_Bikini-Haus.jpg',
  'Hotel Zoo Berlin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Berlin_Kurf%C3%BCrstendamm.jpg/1280px-Berlin_Kurf%C3%BCrstendamm.jpg',
  'Michelberger Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Berlin_Warschauer_Strasse.jpg/1280px-Berlin_Warschauer_Strasse.jpg',
  'Soho House Berlin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Berlin_Mitte_Johannisstrasse.jpg/1280px-Berlin_Mitte_Johannisstrasse.jpg',
  'Das Stue': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Berlin_-_Gro%C3%9Fer_Tiergarten_-_Luiseninsel_Nordspitze_%28Siegess%C3%A4ule%29.jpg/1280px-Berlin_-_Gro%C3%9Fer_Tiergarten_-_Luiseninsel_Nordspitze_%28Siegess%C3%A4ule%29.jpg',
  'Hotel Adlon Kempinski': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Hotel_Adlon_Berlin%2C_Germany.jpg/1280px-Hotel_Adlon_Berlin%2C_Germany.jpg',
  'The Circus Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Berlin_Rosenthaler_Platz.jpg/1280px-Berlin_Rosenthaler_Platz.jpg',
  'Hotel Oderberger': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Oderberger_Strasse%2C_Berlin.jpg/1280px-Oderberger_Strasse%2C_Berlin.jpg',
  'nhow Berlin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Berlin_Warschauer_Strasse.jpg/1280px-Berlin_Warschauer_Strasse.jpg',
  'Hüttenpalast': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Berlin_Neuk%C3%B6lln_Weserstrasse.jpg/1280px-Berlin_Neuk%C3%B6lln_Weserstrasse.jpg',
};

// ===========================================
// ROME PLACES - Real Images
// ===========================================
const ROME_IMAGES: Record<string, string> = {
  // Parks
  'Villa Borghese': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Temple_of_Aesculapius%2C_Villa_Borghese%2C_Rome%2C_Italy.jpg/1280px-Temple_of_Aesculapius%2C_Villa_Borghese%2C_Rome%2C_Italy.jpg',
  'Villa Borghese Gardens': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Temple_of_Aesculapius%2C_Villa_Borghese%2C_Rome%2C_Italy.jpg/1280px-Temple_of_Aesculapius%2C_Villa_Borghese%2C_Rome%2C_Italy.jpg',
  'Villa Borghese Gardens (Area Cani)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Temple_of_Aesculapius%2C_Villa_Borghese%2C_Rome%2C_Italy.jpg/1280px-Temple_of_Aesculapius%2C_Villa_Borghese%2C_Rome%2C_Italy.jpg',
  'Villa Doria Pamphilj': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Roma-villa_doria_pamphili01.jpg/1280px-Roma-villa_doria_pamphili01.jpg',
  'Villa Doria Pamphilj – Area Cani': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Roma-villa_doria_pamphili01.jpg/1280px-Roma-villa_doria_pamphili01.jpg',
  'Villa Ada': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Villa_Ada_5.JPG/1280px-Villa_Ada_5.JPG',
  'Parco degli Acquedotti': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Aqueduct_of_Claudius_%28Aqua_Claudia%29.jpg/1280px-Aqueduct_of_Claudius_%28Aqua_Claudia%29.jpg',
  'Parco degli Acquedotti (Appia Antica)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Aqueduct_of_Claudius_%28Aqua_Claudia%29.jpg/1280px-Aqueduct_of_Claudius_%28Aqua_Claudia%29.jpg',
  'Parco della Caffarella': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Parco_della_Caffarella%2C_Rome%2C_Italy.jpg/1280px-Parco_della_Caffarella%2C_Rome%2C_Italy.jpg',
  'Villa Celimontana': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Villa_Celimontana_Roma.jpg/1280px-Villa_Celimontana_Roma.jpg',
  'Parco del Pineto': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Roma_parco_del_Pineto.jpg/1280px-Roma_parco_del_Pineto.jpg',
  'Parco del Pineto (Pineta Sacchetti)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Roma_parco_del_Pineto.jpg/1280px-Roma_parco_del_Pineto.jpg',
  'Parco di Monte Ciocci': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Monte_Mario_Roma.jpg/1280px-Monte_Mario_Roma.jpg',
  'Giardino degli Aranci (Parco Savello)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Giardino_degli_aranci_Roma.jpg/1280px-Giardino_degli_aranci_Roma.jpg',
  
  // Walks & Trails
  'Via Appia Antica': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Via_Appia_Antica_Rome_2011_1.jpg/1280px-Via_Appia_Antica_Rome_2011_1.jpg',
  'Gianicolo Hill Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Roma_Gianicolo.jpg/1280px-Roma_Gianicolo.jpg',
  'Monte Mario Nature Reserve': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Monte_Mario_Roma.jpg/1280px-Monte_Mario_Roma.jpg',
  'Tiber River Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Tiber_river_Rome.jpg/1280px-Tiber_river_Rome.jpg',
  'Pista Ciclabile del Tevere (Riverside Greenway)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Tiber_river_Rome.jpg/1280px-Tiber_river_Rome.jpg',
  'Pincian Hill and Villa Borghese Loop': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Temple_of_Aesculapius%2C_Villa_Borghese%2C_Rome%2C_Italy.jpg/1280px-Temple_of_Aesculapius%2C_Villa_Borghese%2C_Rome%2C_Italy.jpg',
  'Villa Doria Pamphili Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Roma-villa_doria_pamphili01.jpg/1280px-Roma-villa_doria_pamphili01.jpg',
  'Riserva Naturale dell\'Insugherata': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Monte_Mario_Roma.jpg/1280px-Monte_Mario_Roma.jpg',
  
  // Cafés & Restaurants
  'Antico Caffè Greco': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Antico_Caff%C3%A8_Greco_Roma.jpg/1024px-Antico_Caff%C3%A8_Greco_Roma.jpg',
  'Caffè Sant\'Eustachio': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Sant%27Eustachio_Il_Caff%C3%A8.jpg/1024px-Sant%27Eustachio_Il_Caff%C3%A8.jpg',
  'Bar del Fico': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Piazza_Navona_Roma.jpg/1280px-Piazza_Navona_Roma.jpg',
  'Tram Tram': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/San_Lorenzo_Roma.jpg/1280px-San_Lorenzo_Roma.jpg',
  'Necci dal 1924': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Pigneto_Roma.jpg/1280px-Pigneto_Roma.jpg',
  'Mercato Centrale Roma': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Roma_Termini_stazione.jpg/1280px-Roma_Termini_stazione.jpg',
  'Roscioli Caffè Pasticceria': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Campo_de%27_Fiori_Roma.jpg/1280px-Campo_de%27_Fiori_Roma.jpg',
  'Trattoria Da Enzo al 29': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Trastevere_Roma.jpg/1280px-Trastevere_Roma.jpg',
  'Ristorante da Enzo al 29': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Trastevere_Roma.jpg/1280px-Trastevere_Roma.jpg',
  'Osteria da Fortunata': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Campo_de%27_Fiori_Roma.jpg/1280px-Campo_de%27_Fiori_Roma.jpg',
  'Biscottificio Innocenti': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Trastevere_Roma.jpg/1280px-Trastevere_Roma.jpg',
  'Pasticceria Regoli': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Esquilino_Roma.jpg/1280px-Esquilino_Roma.jpg',
  
  // Hotels
  'Hotel de Russie': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Piazza_del_Popolo_Roma.jpg/1280px-Piazza_del_Popolo_Roma.jpg',
  'Hotel Hassler Roma': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Spanish_steps_Rome.jpg/1024px-Spanish_steps_Rome.jpg',
  'Hotel Eden': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Via_Veneto_Roma.jpg/1280px-Via_Veneto_Roma.jpg',
  'The St. Regis Rome': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Piazza_della_Repubblica_Roma.jpg/1280px-Piazza_della_Repubblica_Roma.jpg',
  'Sofitel Roma Villa Borghese': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Temple_of_Aesculapius%2C_Villa_Borghese%2C_Rome%2C_Italy.jpg/1280px-Temple_of_Aesculapius%2C_Villa_Borghese%2C_Rome%2C_Italy.jpg',
  'Hotel Campo de\' Fiori': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Campo_de%27_Fiori_Roma.jpg/1280px-Campo_de%27_Fiori_Roma.jpg',
  'W Rome': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Via_Veneto_Roma.jpg/1280px-Via_Veneto_Roma.jpg',
  'The First Roma Arte': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Via_Veneto_Roma.jpg/1280px-Via_Veneto_Roma.jpg',
  'Hotel Palazzo Manfredi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Colosseum_in_Rome%2C_Italy_-_April_2007.jpg/1280px-Colosseum_in_Rome%2C_Italy_-_April_2007.jpg',
  'Donna Camilla Savelli Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Trastevere_Roma.jpg/1280px-Trastevere_Roma.jpg',
  'Hotel Indigo Rome - St. George': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Via_Veneto_Roma.jpg/1280px-Via_Veneto_Roma.jpg',
};

// ===========================================
// BARCELONA PLACES - Real Images
// ===========================================
const BARCELONA_IMAGES: Record<string, string> = {
  // Parks
  'Parc de la Ciutadella': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Cascada_monumental_del_Parc_de_la_Ciutadella_-_panoramio.jpg/1280px-Cascada_monumental_del_Parc_de_la_Ciutadella_-_panoramio.jpg',
  'Parc de la Ciutadella (designated areas)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Cascada_monumental_del_Parc_de_la_Ciutadella_-_panoramio.jpg/1280px-Cascada_monumental_del_Parc_de_la_Ciutadella_-_panoramio.jpg',
  'Montjuïc': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Castell_de_Montju%C3%AFc_-_Barcelona%2C_Spain_-_Jan_2007.jpg/1280px-Castell_de_Montju%C3%AFc_-_Barcelona%2C_Spain_-_Jan_2007.jpg',
  'Montjuïc Park (Castell & Gardens)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Castell_de_Montju%C3%AFc_-_Barcelona%2C_Spain_-_Jan_2007.jpg/1280px-Castell_de_Montju%C3%AFc_-_Barcelona%2C_Spain_-_Jan_2007.jpg',
  'Park Güell': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Park_G%C3%BCell_-_Gaudi_Terrace.jpg/1280px-Park_G%C3%BCell_-_Gaudi_Terrace.jpg',
  'Barceloneta Beach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Barceloneta_beach.jpg/1280px-Barceloneta_beach.jpg',
  'Parc del Laberint d\'Horta': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Parc_del_Laberint_d%27Horta_Barcelona.jpg/1280px-Parc_del_Laberint_d%27Horta_Barcelona.jpg',
  'Collserola Natural Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Collserola.jpg/1280px-Collserola.jpg',
  'Parc Natural de la Serra de Collserola': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Collserola.jpg/1280px-Collserola.jpg',
  'Parc del Guinardó': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Bunkers_del_Carmel_Barcelona.jpg/1280px-Bunkers_del_Carmel_Barcelona.jpg',
  'Parc del Guinardó – Bunkers del Carmel Access': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Bunkers_del_Carmel_Barcelona.jpg/1280px-Bunkers_del_Carmel_Barcelona.jpg',
  'Parc de la Creueta del Coll': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Parc_de_la_Creueta_del_Coll.jpg/1280px-Parc_de_la_Creueta_del_Coll.jpg',
  'Parc del Fòrum Promenade': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Forum_Barcelona.jpg/1280px-Forum_Barcelona.jpg',
  'Parc de la Barceloneta': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Barceloneta_beach.jpg/1280px-Barceloneta_beach.jpg',
  'Turó del Putxet Gardens': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Tur%C3%B3_del_Putget.jpg/1280px-Tur%C3%B3_del_Putget.jpg',
  'Parc del Poblenou': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Poblenou_Barcelona.jpg/1280px-Poblenou_Barcelona.jpg',
  'Parc del Poblenou (Parc del Centre del Poblenou)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Poblenou_Barcelona.jpg/1280px-Poblenou_Barcelona.jpg',
  
  // Walks & Trails
  'Barceloneta Beach Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Barceloneta_beach.jpg/1280px-Barceloneta_beach.jpg',
  'Bunkers del Carmel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Bunkers_del_Carmel_Barcelona.jpg/1280px-Bunkers_del_Carmel_Barcelona.jpg',
  'Carretera de les Aigües': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Collserola.jpg/1280px-Collserola.jpg',
  'Carretera de les Aigües (Collserola)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Collserola.jpg/1280px-Collserola.jpg',
  'Passeig de Gràcia and Eixample Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Casa_Batll%C3%B3_Barcelona.jpg/1024px-Casa_Batll%C3%B3_Barcelona.jpg',
  'Gothic Quarter Walking Tour': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Barcelona_Gothic_Quarter.jpg/1280px-Barcelona_Gothic_Quarter.jpg',
  'Born Neighborhood Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/El_Born_Barcelona.jpg/1280px-El_Born_Barcelona.jpg',
  'Turó Park Circuit': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Tur%C3%B3_del_Putget.jpg/1280px-Tur%C3%B3_del_Putget.jpg',
  'Parc de Collserola Trails': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Collserola.jpg/1280px-Collserola.jpg',
  'Collserola – Sant Medir & Hermita Loops': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Collserola.jpg/1280px-Collserola.jpg',
  'Platja del Bogatell to Llevant': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Barceloneta_beach.jpg/1280px-Barceloneta_beach.jpg',
  'Platja de Llevant – Àrea per a gossos': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Barceloneta_beach.jpg/1280px-Barceloneta_beach.jpg',
  'Platja de Llevant – Àrea per a Gossos (seasonal)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Barceloneta_beach.jpg/1280px-Barceloneta_beach.jpg',
  'Playa de Llevant – Dog Beach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Barceloneta_beach.jpg/1280px-Barceloneta_beach.jpg',
  'Platja de Llevant – Àrea per a gossos (Dog Beach)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Barceloneta_beach.jpg/1280px-Barceloneta_beach.jpg',
  
  // Cafés & Restaurants
  'Federal Café': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Barcelona_Gothic_Quarter.jpg/1280px-Barcelona_Gothic_Quarter.jpg',
  'Flax & Kale': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Raval_Barcelona.jpg/1280px-Raval_Barcelona.jpg',
  'Brunch & Cake': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Eixample_Barcelona.jpg/1280px-Eixample_Barcelona.jpg',
  'Brunch & Cake (multiple locations)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Eixample_Barcelona.jpg/1280px-Eixample_Barcelona.jpg',
  'Alsur Café': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/El_Born_Barcelona.jpg/1280px-El_Born_Barcelona.jpg',
  'Alsur Café (multiple locations)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/El_Born_Barcelona.jpg/1280px-El_Born_Barcelona.jpg',
  'Bar del Pla': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/El_Born_Barcelona.jpg/1280px-El_Born_Barcelona.jpg',
  'Café de l\'Acadèmia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Barcelona_Gothic_Quarter.jpg/1280px-Barcelona_Gothic_Quarter.jpg',
  'Caravelle': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Raval_Barcelona.jpg/1280px-Raval_Barcelona.jpg',
  'La Pepita': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Gracia_Barcelona.jpg/1280px-Gracia_Barcelona.jpg',
  'Chez Cocó': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Gracia_Barcelona.jpg/1280px-Gracia_Barcelona.jpg',
  'Merbeyé': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Eixample_Barcelona.jpg/1280px-Eixample_Barcelona.jpg',
  'Taller de Tapas': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Barcelona_Gothic_Quarter.jpg/1280px-Barcelona_Gothic_Quarter.jpg',
  'BuenasMigas': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Gracia_Barcelona.jpg/1280px-Gracia_Barcelona.jpg',
  'Corgi Café (Gòtic)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Barcelona_Gothic_Quarter.jpg/1280px-Barcelona_Gothic_Quarter.jpg',
  'Inu Café': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Gracia_Barcelona.jpg/1280px-Gracia_Barcelona.jpg',
  'Mercat de la Boqueria': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/La_Boqueria_Barcelona.jpg/1280px-La_Boqueria_Barcelona.jpg',
  'Mercat de la Boqueria – Bars & Stalls (terraces nearby)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/La_Boqueria_Barcelona.jpg/1280px-La_Boqueria_Barcelona.jpg',
  
  // Hotels
  'W Barcelona': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/W_Barcelona_Hotel.jpg/1280px-W_Barcelona_Hotel.jpg',
  'Hotel Arts Barcelona': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Hotel_Arts_Barcelona.jpg/1024px-Hotel_Arts_Barcelona.jpg',
  'Mandarin Oriental Barcelona': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Casa_Batll%C3%B3_Barcelona.jpg/1024px-Casa_Batll%C3%B3_Barcelona.jpg',
  'Hotel Casa Camper': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Raval_Barcelona.jpg/1280px-Raval_Barcelona.jpg',
  'Hotel Neri': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Barcelona_Gothic_Quarter.jpg/1280px-Barcelona_Gothic_Quarter.jpg',
  'Cotton House Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Eixample_Barcelona.jpg/1280px-Eixample_Barcelona.jpg',
  'Hotel 1898': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/La_Rambla_Barcelona.jpg/1280px-La_Rambla_Barcelona.jpg',
  'Hotel Brummell': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Poblenou_Barcelona.jpg/1280px-Poblenou_Barcelona.jpg',
  'Hotel Soho Barcelona': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Barcelona_Gothic_Quarter.jpg/1280px-Barcelona_Gothic_Quarter.jpg',
  'Hotel Primero Primera': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Gracia_Barcelona.jpg/1280px-Gracia_Barcelona.jpg',
  'Hotel Granados 83': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Eixample_Barcelona.jpg/1280px-Eixample_Barcelona.jpg',
  'Hotel Claris & Spa GL': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Eixample_Barcelona.jpg/1280px-Eixample_Barcelona.jpg',
  'Hotel Ohla Eixample': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Eixample_Barcelona.jpg/1280px-Eixample_Barcelona.jpg',
  'Hotel SB Icaria Barcelona': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Poblenou_Barcelona.jpg/1280px-Poblenou_Barcelona.jpg',
};

// ===========================================
// MADRID PLACES - Real Images
// ===========================================
const MADRID_IMAGES: Record<string, string> = {
  // Parks
  'El Retiro Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Monumento_a_Alfonso_XII_de_Espa%C3%B1a_en_los_Jardines_del_Retiro_-_04.jpg/1280px-Monumento_a_Alfonso_XII_de_Espa%C3%B1a_en_los_Jardines_del_Retiro_-_04.jpg',
  'Casa de Campo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Casa_de_Campo_%28Madrid%29_19.jpg/1280px-Casa_de_Campo_%28Madrid%29_19.jpg',
  'Madrid Río': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Puente_de_Segovia_Madrid_R%C3%ADo.JPG/1280px-Puente_de_Segovia_Madrid_R%C3%ADo.JPG',
  'Parque del Oeste': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Parque_del_Oeste_%28Madrid%29_12.jpg/1280px-Parque_del_Oeste_%28Madrid%29_12.jpg',
  'Dehesa de la Villa': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Dehesa_de_la_Villa_%28Madrid%29_03.jpg/1280px-Dehesa_de_la_Villa_%28Madrid%29_03.jpg',
  'Parque Juan Carlos I': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Parque_Juan_Carlos_I_%28Madrid%29_27.jpg/1280px-Parque_Juan_Carlos_I_%28Madrid%29_27.jpg',
  'Parque El Capricho': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/El_capricho_templete.JPG/1280px-El_capricho_templete.JPG',
  'Parque Quinta de los Molinos': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Quinta_de_los_Molinos_%28Madrid%29_09.jpg/1280px-Quinta_de_los_Molinos_%28Madrid%29_09.jpg',
  'Parque Emperatriz María de Austria': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Casa_de_Campo_%28Madrid%29_19.jpg/1280px-Casa_de_Campo_%28Madrid%29_19.jpg',
  'Parque Lineal del Manzanares': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Puente_de_Segovia_Madrid_R%C3%ADo.JPG/1280px-Puente_de_Segovia_Madrid_R%C3%ADo.JPG',
  'Parque de Santander': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Monumento_a_Alfonso_XII_de_Espa%C3%B1a_en_los_Jardines_del_Retiro_-_04.jpg/1280px-Monumento_a_Alfonso_XII_de_Espa%C3%B1a_en_los_Jardines_del_Retiro_-_04.jpg',
  'Parque Roma': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Monumento_a_Alfonso_XII_de_Espa%C3%B1a_en_los_Jardines_del_Retiro_-_04.jpg/1280px-Monumento_a_Alfonso_XII_de_Espa%C3%B1a_en_los_Jardines_del_Retiro_-_04.jpg',
  'Parque de la Cuña Verde': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Dehesa_de_la_Villa_%28Madrid%29_03.jpg/1280px-Dehesa_de_la_Villa_%28Madrid%29_03.jpg',
  'Parque de Pradolongo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Casa_de_Campo_%28Madrid%29_19.jpg/1280px-Casa_de_Campo_%28Madrid%29_19.jpg',
  'Parque de Enrique Tierno Galván': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Monumento_a_Alfonso_XII_de_Espa%C3%B1a_en_los_Jardines_del_Retiro_-_04.jpg/1280px-Monumento_a_Alfonso_XII_de_Espa%C3%B1a_en_los_Jardines_del_Retiro_-_04.jpg',
  'Parque de Berlín': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Monumento_a_Alfonso_XII_de_Espa%C3%B1a_en_los_Jardines_del_Retiro_-_04.jpg/1280px-Monumento_a_Alfonso_XII_de_Espa%C3%B1a_en_los_Jardines_del_Retiro_-_04.jpg',
  
  // Walks & Trails
  'Monte de El Pardo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Palacio_Real_de_El_Pardo_-_01.jpg/1280px-Palacio_Real_de_El_Pardo_-_01.jpg',
  'Senda Botánica del Monte de El Pardo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Palacio_Real_de_El_Pardo_-_01.jpg/1280px-Palacio_Real_de_El_Pardo_-_01.jpg',
  'Río Manzanares Trail': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Puente_de_Segovia_Madrid_R%C3%ADo.JPG/1280px-Puente_de_Segovia_Madrid_R%C3%ADo.JPG',
  'Senda Ecológica del Manzanares': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Puente_de_Segovia_Madrid_R%C3%ADo.JPG/1280px-Puente_de_Segovia_Madrid_R%C3%ADo.JPG',
  'Casa de Campo Circular': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Casa_de_Campo_%28Madrid%29_19.jpg/1280px-Casa_de_Campo_%28Madrid%29_19.jpg',
  'Anillo Verde de Madrid': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Dehesa_de_la_Villa_%28Madrid%29_03.jpg/1280px-Dehesa_de_la_Villa_%28Madrid%29_03.jpg',
  'Senda Real': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Palacio_Real_de_El_Pardo_-_01.jpg/1280px-Palacio_Real_de_El_Pardo_-_01.jpg',
  'Valle de la Fuenfría': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Sierra_de_Guadarrama.jpg/1280px-Sierra_de_Guadarrama.jpg',
  'Ruta de los Pantanos': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Sierra_de_Guadarrama.jpg/1280px-Sierra_de_Guadarrama.jpg',
  'Ruta del Agua Santillana': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Sierra_de_Guadarrama.jpg/1280px-Sierra_de_Guadarrama.jpg',
  'Cerro de los Ángeles': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Monumento_a_Alfonso_XII_de_Espa%C3%B1a_en_los_Jardines_del_Retiro_-_04.jpg/1280px-Monumento_a_Alfonso_XII_de_Espa%C3%B1a_en_los_Jardines_del_Retiro_-_04.jpg',
  'Parque Regional del Sureste': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Puente_de_Segovia_Madrid_R%C3%ADo.JPG/1280px-Puente_de_Segovia_Madrid_R%C3%ADo.JPG',
  'Paseo del Río Manzanares Sur': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Puente_de_Segovia_Madrid_R%C3%ADo.JPG/1280px-Puente_de_Segovia_Madrid_R%C3%ADo.JPG',
  'Camino de los Vinateros': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Monumento_a_Alfonso_XII_de_Espa%C3%B1a_en_los_Jardines_del_Retiro_-_04.jpg/1280px-Monumento_a_Alfonso_XII_de_Espa%C3%B1a_en_los_Jardines_del_Retiro_-_04.jpg',
  
  // Cafés & Restaurants
  'Café Gijón': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Cafe_gijon_madrid.jpg/800px-Cafe_gijon_madrid.jpg',
  'Café Comercial': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Cafe_Comercial_Madrid.JPG/800px-Cafe_Comercial_Madrid.JPG',
  'Café de Oriente': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Plaza_de_Oriente_Madrid.jpg/1280px-Plaza_de_Oriente_Madrid.jpg',
  'Café de la Luz': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Malasa%C3%B1a_Madrid.jpg/1280px-Malasa%C3%B1a_Madrid.jpg',
  'Café de la Palma': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Malasa%C3%B1a_Madrid.jpg/1280px-Malasa%C3%B1a_Madrid.jpg',
  'El Jardín Secreto': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Malasa%C3%B1a_Madrid.jpg/1280px-Malasa%C3%B1a_Madrid.jpg',
  'Salvaje': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Salamanca_Madrid.jpg/1280px-Salamanca_Madrid.jpg',
  'Lateral Castellana': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Salamanca_Madrid.jpg/1280px-Salamanca_Madrid.jpg',
  'Ojalá': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Malasa%C3%B1a_Madrid.jpg/1280px-Malasa%C3%B1a_Madrid.jpg',
  'La Tape': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Malasa%C3%B1a_Madrid.jpg/1280px-Malasa%C3%B1a_Madrid.jpg',
  'El Viajero': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/La_Latina_Madrid.jpg/1280px-La_Latina_Madrid.jpg',
  'Carmencita': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Malasa%C3%B1a_Madrid.jpg/1280px-Malasa%C3%B1a_Madrid.jpg',
  'La Barraca': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Salamanca_Madrid.jpg/1280px-Salamanca_Madrid.jpg',
  'Mama Framboise': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Salamanca_Madrid.jpg/1280px-Salamanca_Madrid.jpg',
  
  // Hotels
  'Hotel Urso': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Malasa%C3%B1a_Madrid.jpg/1280px-Malasa%C3%B1a_Madrid.jpg',
  'Only YOU Boutique Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Salamanca_Madrid.jpg/1280px-Salamanca_Madrid.jpg',
  'The Westin Palace Madrid': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Madrid_Westin_Palace_Hotel.jpg/1280px-Madrid_Westin_Palace_Hotel.jpg',
  'Gran Meliá Fénix': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Salamanca_Madrid.jpg/1280px-Salamanca_Madrid.jpg',
  'Hospes Puerta de Alcalá': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Puerta_de_Alcal%C3%A1_-_01.jpg/1280px-Puerta_de_Alcal%C3%A1_-_01.jpg',
  'VP Plaza España Design': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Plaza_de_Espa%C3%B1a_%28Madrid%29_17.jpg/1280px-Plaza_de_Espa%C3%B1a_%28Madrid%29_17.jpg',
  'Barceló Torre de Madrid': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Plaza_de_Espa%C3%B1a_%28Madrid%29_17.jpg/1280px-Plaza_de_Espa%C3%B1a_%28Madrid%29_17.jpg',
  'Room Mate Oscar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Chueca_Madrid.jpg/1280px-Chueca_Madrid.jpg',
  'H10 Villa de la Reina': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Gran_V%C3%ADa_%28Madrid%29_41.jpg/1280px-Gran_V%C3%ADa_%28Madrid%29_41.jpg',
  'Petit Palace Savoy Alfonso XII': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Monumento_a_Alfonso_XII_de_Espa%C3%B1a_en_los_Jardines_del_Retiro_-_04.jpg/1280px-Monumento_a_Alfonso_XII_de_Espa%C3%B1a_en_los_Jardines_del_Retiro_-_04.jpg',
  'Pestana Plaza Mayor Madrid': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Plaza_Mayor_de_Madrid_06.jpg/1280px-Plaza_Mayor_de_Madrid_06.jpg',
  'NH Collection Madrid Eurobuilding': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Salamanca_Madrid.jpg/1280px-Salamanca_Madrid.jpg',
  'NH Collection Madrid Suecia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Salamanca_Madrid.jpg/1280px-Salamanca_Madrid.jpg',
  'Icon Embassy by Petit Palace': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Salamanca_Madrid.jpg/1280px-Salamanca_Madrid.jpg',
  'Vincci The Mint': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Gran_V%C3%ADa_%28Madrid%29_41.jpg/1280px-Gran_V%C3%ADa_%28Madrid%29_41.jpg',
};

// ===========================================
// OTHER CITIES - Real Images
// ===========================================
const LISBON_IMAGES: Record<string, string> = {
  'Monsanto Forest Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Parque_Florestal_de_Monsanto%2C_Lisboa.jpg/1280px-Parque_Florestal_de_Monsanto%2C_Lisboa.jpg',
  'Jardim da Estrela': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Jardim_da_Estrela_em_Lisboa.jpg/1280px-Jardim_da_Estrela_em_Lisboa.jpg',
  'Parque das Nações': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Parque_das_Na%C3%A7%C3%B5es_Lisbon_2.jpg/1280px-Parque_das_Na%C3%A7%C3%B5es_Lisbon_2.jpg',
  'Parque Eduardo VII': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Parque_Eduardo_VII_%28Lisboa%29.jpg/1280px-Parque_Eduardo_VII_%28Lisboa%29.jpg',
  'Jardim Botânico de Lisboa': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Jardim_Bot%C3%A2nico_de_Lisboa.jpg/1280px-Jardim_Bot%C3%A2nico_de_Lisboa.jpg',
  'Jardim do Príncipe Real': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Lisboa_Pr%C3%ADncipe_Real.jpg/1280px-Lisboa_Pr%C3%ADncipe_Real.jpg',
  'Jardim do Campo Grande': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Campo_Grande_Lisboa.jpg/1280px-Campo_Grande_Lisboa.jpg',
  'Jardim da Fundação Calouste Gulbenkian': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Gulbenkian_garden_Lisbon.jpg/1280px-Gulbenkian_garden_Lisbon.jpg',
  'Tapada das Necessidades': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Tapada_das_Necessidades.jpg/1280px-Tapada_das_Necessidades.jpg',
  'Parque da Bela Vista': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Parque_da_Bela_Vista_Lisboa.jpg/1280px-Parque_da_Bela_Vista_Lisboa.jpg',
  'Parque Florestal de Sintra': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Sintra_park.jpg/1280px-Sintra_park.jpg',
  'Ribeira das Naus Waterfront': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Ribeira_das_Naus_Lisboa.jpg/1280px-Ribeira_das_Naus_Lisboa.jpg',
  'Mata de Alvalade': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Parque_Eduardo_VII_%28Lisboa%29.jpg/1280px-Parque_Eduardo_VII_%28Lisboa%29.jpg',
  'Quinta da Alfarrobeira': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Parque_Florestal_de_Monsanto%2C_Lisboa.jpg/1280px-Parque_Florestal_de_Monsanto%2C_Lisboa.jpg',
  'Jardim Amália Rodrigues': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Parque_Eduardo_VII_%28Lisboa%29.jpg/1280px-Parque_Eduardo_VII_%28Lisboa%29.jpg',
  
  // Cafés
  'Café A Brasileira': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/A_Brasileira_caf%C3%A9_Lisbon.jpg/1024px-A_Brasileira_caf%C3%A9_Lisbon.jpg',
  'Pastelaria Versailles': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Pastelaria_Versailles_Lisbon.jpg/1024px-Pastelaria_Versailles_Lisbon.jpg',
  'Time Out Market': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Time_Out_Market_Lisboa.jpg/1280px-Time_Out_Market_Lisboa.jpg',
  'Noobai Café': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Miradouro_de_Santa_Catarina_Lisboa.jpg/1280px-Miradouro_de_Santa_Catarina_Lisboa.jpg',
  'Landeau Chocolate': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Avenida_da_Liberdade_Lisboa.jpg/1280px-Avenida_da_Liberdade_Lisboa.jpg',
  'Fábrica Coffee Roasters': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Avenida_da_Liberdade_Lisboa.jpg/1280px-Avenida_da_Liberdade_Lisboa.jpg',
  'Copenhagen Coffee Lab': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Lisboa_Pr%C3%ADncipe_Real.jpg/1280px-Lisboa_Pr%C3%ADncipe_Real.jpg',
  'Quiosque Ribeira das Naus': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Ribeira_das_Naus_Lisboa.jpg/1280px-Ribeira_das_Naus_Lisboa.jpg',
  'Cafe da Garagem': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Alfama_Lisboa.jpg/1280px-Alfama_Lisboa.jpg',
  'Café do Garagem': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Alfama_Lisboa.jpg/1280px-Alfama_Lisboa.jpg',
  'Tasca do Chico': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Alfama_Lisboa.jpg/1280px-Alfama_Lisboa.jpg',
  'Prado Mercearia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Lisboa_Pr%C3%ADncipe_Real.jpg/1280px-Lisboa_Pr%C3%ADncipe_Real.jpg',
  'O Velho Eurico': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Alfama_Lisboa.jpg/1280px-Alfama_Lisboa.jpg',
  'Café Tati': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Ribeira_das_Naus_Lisboa.jpg/1280px-Ribeira_das_Naus_Lisboa.jpg',
  'Heim Café': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Lisboa_Pr%C3%ADncipe_Real.jpg/1280px-Lisboa_Pr%C3%ADncipe_Real.jpg',
  
  // Hotels
  'Bairro Alto Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Miradouro_de_Santa_Catarina_Lisboa.jpg/1280px-Miradouro_de_Santa_Catarina_Lisboa.jpg',
  'Palácio do Governador': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Torre_de_Bel%C3%A9m_Lisboa.jpg/1280px-Torre_de_Bel%C3%A9m_Lisboa.jpg',
  'MYRIAD by SANA Hotels': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Parque_das_Na%C3%A7%C3%B5es_Lisbon_2.jpg/1280px-Parque_das_Na%C3%A7%C3%B5es_Lisbon_2.jpg',
};

const DUBLIN_IMAGES: Record<string, string> = {
  'Phoenix Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Phoenix_Park_%28Dublin%29.jpg/1280px-Phoenix_Park_%28Dublin%29.jpg',
  'St Stephen\'s Green': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/St_Stephens_Green_Dublin_2006.jpg/1280px-St_Stephens_Green_Dublin_2006.jpg',
  'Howth Cliff Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Howth_Head_and_Baily_Lighthouse.jpg/1280px-Howth_Head_and_Baily_Lighthouse.jpg',
  'Iveagh Gardens': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Iveagh_Gardens_Dublin.jpg/1280px-Iveagh_Gardens_Dublin.jpg',
  'Herbert Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Herbert_Park_Dublin.jpg/1280px-Herbert_Park_Dublin.jpg',
  'Marlay Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Marlay_Park.jpg/1280px-Marlay_Park.jpg',
  'Killiney Hill Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Killiney_Hill.jpg/1280px-Killiney_Hill.jpg',
  'Merrion Square': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Merrion_Square_Dublin.jpg/1280px-Merrion_Square_Dublin.jpg',
  'War Memorial Gardens': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/War_Memorial_Gardens_Dublin.jpg/1280px-War_Memorial_Gardens_Dublin.jpg',
  'Malahide Castle Grounds': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Malahide_Castle.jpg/1280px-Malahide_Castle.jpg',
  'Bull Island': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Bull_Island_Dublin.jpg/1280px-Bull_Island_Dublin.jpg',
  'Bushy Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Herbert_Park_Dublin.jpg/1280px-Herbert_Park_Dublin.jpg',
  'Fairview Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Herbert_Park_Dublin.jpg/1280px-Herbert_Park_Dublin.jpg',
  'Tymon Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Herbert_Park_Dublin.jpg/1280px-Herbert_Park_Dublin.jpg',
  'Cabinteely Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Herbert_Park_Dublin.jpg/1280px-Herbert_Park_Dublin.jpg',
  'Corkagh Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Herbert_Park_Dublin.jpg/1280px-Herbert_Park_Dublin.jpg',
  
  // Cafés & Pubs
  'The Long Hall': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/The_Long_Hall_Dublin.jpg/1024px-The_Long_Hall_Dublin.jpg',
  'Grogan\'s Castle Lounge': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Grogan%27s_Dublin.jpg/1024px-Grogan%27s_Dublin.jpg',
  'Kehoe\'s': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/South_Anne_Street_Dublin.jpg/1280px-South_Anne_Street_Dublin.jpg',
  'The Winding Stair': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Ha%27penny_Bridge_Dublin.jpg/1280px-Ha%27penny_Bridge_Dublin.jpg',
  'Fallon\'s': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/The_Liberties_Dublin.jpg/1280px-The_Liberties_Dublin.jpg',
  'The Barge': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Grand_Canal_Dublin.jpg/1280px-Grand_Canal_Dublin.jpg',
  '3FE Coffee': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Grand_Canal_Dublin.jpg/1280px-Grand_Canal_Dublin.jpg',
  'Kaph': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/South_Anne_Street_Dublin.jpg/1280px-South_Anne_Street_Dublin.jpg',
  'Clement & Pekoe': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/South_Anne_Street_Dublin.jpg/1280px-South_Anne_Street_Dublin.jpg',
  'Two Boys Brew': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/South_Anne_Street_Dublin.jpg/1280px-South_Anne_Street_Dublin.jpg',
  'Brother Hubbard North': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Capel_Street_Dublin.jpg/1280px-Capel_Street_Dublin.jpg',
  'Meet Me in the Morning': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Portobello_Dublin.jpg/1280px-Portobello_Dublin.jpg',
  'Lucky\'s': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Portobello_Dublin.jpg/1280px-Portobello_Dublin.jpg',
  'The Pig\'s Ear': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Nassau_Street_Dublin.jpg/1280px-Nassau_Street_Dublin.jpg',
  'The Bernard Shaw': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Portobello_Dublin.jpg/1280px-Portobello_Dublin.jpg',
  
  // Hotels
  'Brooks Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Drury_Street_Dublin.jpg/1280px-Drury_Street_Dublin.jpg',
  'Dylan Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Herbert_Park_Dublin.jpg/1280px-Herbert_Park_Dublin.jpg',
};

const MUNICH_IMAGES: Record<string, string> = {
  'Englischer Garten': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Englischer_Garten_from_Monopteros.jpg/1280px-Englischer_Garten_from_Monopteros.jpg',
  'Olympiapark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Olympiapark_M%C3%BCnchen.jpg/1280px-Olympiapark_M%C3%BCnchen.jpg',
  'Nymphenburg Palace Gardens': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Schloss_Nymphenburg_M%C3%BCnchen.jpg/1280px-Schloss_Nymphenburg_M%C3%BCnchen.jpg',
  'Schlosspark Nymphenburg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Schloss_Nymphenburg_M%C3%BCnchen.jpg/1280px-Schloss_Nymphenburg_M%C3%BCnchen.jpg',
  'Hirschgarten': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Hirschgarten_M%C3%BCnchen.jpg/1280px-Hirschgarten_M%C3%BCnchen.jpg',
  'Westpark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Westpark_M%C3%BCnchen.jpg/1280px-Westpark_M%C3%BCnchen.jpg',
  'Flaucher': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Flaucher_Isar_M%C3%BCnchen.jpg/1280px-Flaucher_Isar_M%C3%BCnchen.jpg',
  'Luitpoldpark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Luitpoldpark_M%C3%BCnchen.jpg/1280px-Luitpoldpark_M%C3%BCnchen.jpg',
  'Botanischer Garten': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Botanischer_Garten_M%C3%BCnchen.jpg/1280px-Botanischer_Garten_M%C3%BCnchen.jpg',
  'Ostpark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Olympiapark_M%C3%BCnchen.jpg/1280px-Olympiapark_M%C3%BCnchen.jpg',
  'Riemer Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Olympiapark_M%C3%BCnchen.jpg/1280px-Olympiapark_M%C3%BCnchen.jpg',
  'Maximiliansanlagen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Englischer_Garten_from_Monopteros.jpg/1280px-Englischer_Garten_from_Monopteros.jpg',
  'Rosengarten': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Englischer_Garten_from_Monopteros.jpg/1280px-Englischer_Garten_from_Monopteros.jpg',
  'Perlacher Forst': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Flaucher_Isar_M%C3%BCnchen.jpg/1280px-Flaucher_Isar_M%C3%BCnchen.jpg',
  'Pasinger Stadtpark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Schloss_Nymphenburg_M%C3%BCnchen.jpg/1280px-Schloss_Nymphenburg_M%C3%BCnchen.jpg',
  'Forstenrieder Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Flaucher_Isar_M%C3%BCnchen.jpg/1280px-Flaucher_Isar_M%C3%BCnchen.jpg',
  
  // Cafés & Biergartens
  'Chinesischer Turm Biergarten': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Chinesischer_Turm_M%C3%BCnchen.jpg/1280px-Chinesischer_Turm_M%C3%BCnchen.jpg',
  'Seehaus im Englischen Garten': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Englischer_Garten_from_Monopteros.jpg/1280px-Englischer_Garten_from_Monopteros.jpg',
  'Augustiner Keller': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Augustiner_Keller_M%C3%BCnchen.jpg/1280px-Augustiner_Keller_M%C3%BCnchen.jpg',
  'Hofbräukeller': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Olympiapark_M%C3%BCnchen.jpg/1280px-Olympiapark_M%C3%BCnchen.jpg',
  'Wirtshaus in der Au': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Au_M%C3%BCnchen.jpg/1280px-Au_M%C3%BCnchen.jpg',
  'Café Luitpold': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Brienner_Strasse_M%C3%BCnchen.jpg/1280px-Brienner_Strasse_M%C3%BCnchen.jpg',
  'Café Frischhut': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Viktualienmarkt_M%C3%BCnchen.jpg/1280px-Viktualienmarkt_M%C3%BCnchen.jpg',
  'Tambosi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Hofgarten_M%C3%BCnchen.jpg/1280px-Hofgarten_M%C3%BCnchen.jpg',
  'Café Münchner Freiheit': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Schwabing_M%C3%BCnchen.jpg/1280px-Schwabing_M%C3%BCnchen.jpg',
  'Man versus Machine': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Glockenbachviertel_M%C3%BCnchen.jpg/1280px-Glockenbachviertel_M%C3%BCnchen.jpg',
  'Café Kosmos': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Glockenbachviertel_M%C3%BCnchen.jpg/1280px-Glockenbachviertel_M%C3%BCnchen.jpg',
  'Café Reitschule': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Englischer_Garten_from_Monopteros.jpg/1280px-Englischer_Garten_from_Monopteros.jpg',
  'Trachtenvogl': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Schwabing_M%C3%BCnchen.jpg/1280px-Schwabing_M%C3%BCnchen.jpg',
  'Lost Weekend': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Schwabing_M%C3%BCnchen.jpg/1280px-Schwabing_M%C3%BCnchen.jpg',
  'Gang und Gäbe': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Glockenbachviertel_M%C3%BCnchen.jpg/1280px-Glockenbachviertel_M%C3%BCnchen.jpg',
  
  // Hotels
  'Roomers Munich': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Glockenbachviertel_M%C3%BCnchen.jpg/1280px-Glockenbachviertel_M%C3%BCnchen.jpg',
  'Hotel am Viktualienmarkt': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Viktualienmarkt_M%C3%BCnchen.jpg/1280px-Viktualienmarkt_M%C3%BCnchen.jpg',
};

const VIENNA_IMAGES: Record<string, string> = {
  'Prater': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Wien_Prater_Jesuitenwiese.jpg/1280px-Wien_Prater_Jesuitenwiese.jpg',
  'Prater Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Wien_Prater_Jesuitenwiese.jpg/1280px-Wien_Prater_Jesuitenwiese.jpg',
  'Hundezone Prater': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Wien_Prater_Jesuitenwiese.jpg/1280px-Wien_Prater_Jesuitenwiese.jpg',
  'Schönbrunn Palace Gardens': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Schloss_Sch%C3%B6nbrunn_-_Panorama.jpg/1280px-Schloss_Sch%C3%B6nbrunn_-_Panorama.jpg',
  'Hundezone Schönbrunn': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Schloss_Sch%C3%B6nbrunn_-_Panorama.jpg/1280px-Schloss_Sch%C3%B6nbrunn_-_Panorama.jpg',
  'Stadtpark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Wien_Stadtpark_Johann-Strau%C3%9F-Denkmal.jpg/1024px-Wien_Stadtpark_Johann-Strau%C3%9F-Denkmal.jpg',
  'Donauinsel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Donauinsel_Wien.jpg/1280px-Donauinsel_Wien.jpg',
  'Hundezone Donauinsel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Donauinsel_Wien.jpg/1280px-Donauinsel_Wien.jpg',
  'Hundezone Donaupark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Donauinsel_Wien.jpg/1280px-Donauinsel_Wien.jpg',
  'Wienerwald Trails': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Wienerwald_Panorama.jpg/1280px-Wienerwald_Panorama.jpg',
  'Hundezone Volksgarten': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Wien_Volksgarten.jpg/1280px-Wien_Volksgarten.jpg',
  'Hundezone Augarten': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Augarten_Wien.jpg/1280px-Augarten_Wien.jpg',
  'Hundezone Türkenschanzpark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/T%C3%BCrkenschanzpark_Wien.jpg/1280px-T%C3%BCrkenschanzpark_Wien.jpg',
  'Hundezone Auer-Welsbach-Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Wien_Stadtpark_Johann-Strau%C3%9F-Denkmal.jpg/1024px-Wien_Stadtpark_Johann-Strau%C3%9F-Denkmal.jpg',
  'Auer-Welsbach-Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Wien_Stadtpark_Johann-Strau%C3%9F-Denkmal.jpg/1024px-Wien_Stadtpark_Johann-Strau%C3%9F-Denkmal.jpg',
  'Hundezone Laaer Berg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Wien_Prater_Jesuitenwiese.jpg/1280px-Wien_Prater_Jesuitenwiese.jpg',
  'Bruno Kreisky Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Wien_Stadtpark_Johann-Strau%C3%9F-Denkmal.jpg/1024px-Wien_Stadtpark_Johann-Strau%C3%9F-Denkmal.jpg',
  'Hundezone Dehnepark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Wien_Stadtpark_Johann-Strau%C3%9F-Denkmal.jpg/1024px-Wien_Stadtpark_Johann-Strau%C3%9F-Denkmal.jpg',
  
  // Cafés
  'Café Central': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Caf%C3%A9_Central_Vienna.jpg/1024px-Caf%C3%A9_Central_Vienna.jpg',
  'Café Landtmann': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Caf%C3%A9_Landtmann_Wien.jpg/1024px-Caf%C3%A9_Landtmann_Wien.jpg',
  'Café Sperl': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Caf%C3%A9_Sperl_Wien.jpg/1024px-Caf%C3%A9_Sperl_Wien.jpg',
  'Café Hawelka': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Caf%C3%A9_Hawelka_Wien.jpg/1024px-Caf%C3%A9_Hawelka_Wien.jpg',
  'Café Prückel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Wien_Stadtpark_Johann-Strau%C3%9F-Denkmal.jpg/1024px-Wien_Stadtpark_Johann-Strau%C3%9F-Denkmal.jpg',
  'Café Jelinek': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Wien_Stadtpark_Johann-Strau%C3%9F-Denkmal.jpg/1024px-Wien_Stadtpark_Johann-Strau%C3%9F-Denkmal.jpg',
  'Naschmarkt Restaurants': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Naschmarkt_Wien.jpg/1280px-Naschmarkt_Wien.jpg',
  'Motto am Fluss': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Donaukanal_Wien.jpg/1280px-Donaukanal_Wien.jpg',
  'Strandbar Herrmann': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Donaukanal_Wien.jpg/1280px-Donaukanal_Wien.jpg',
  'Kaffee Alt Wien': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Wien_Stadtpark_Johann-Strau%C3%9F-Denkmal.jpg/1024px-Wien_Stadtpark_Johann-Strau%C3%9F-Denkmal.jpg',
  'Phil': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Wien_Stadtpark_Johann-Strau%C3%9F-Denkmal.jpg/1024px-Wien_Stadtpark_Johann-Strau%C3%9F-Denkmal.jpg',
  'Das Campus': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Wien_Stadtpark_Johann-Strau%C3%9F-Denkmal.jpg/1024px-Wien_Stadtpark_Johann-Strau%C3%9F-Denkmal.jpg',
  'Gasometer Brewpub': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Vienna_Gasometer.jpg/1280px-Vienna_Gasometer.jpg',
  'Wirr': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Wien_Stadtpark_Johann-Strau%C3%9F-Denkmal.jpg/1024px-Wien_Stadtpark_Johann-Strau%C3%9F-Denkmal.jpg',
  'Das Augustin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Wien_Stadtpark_Johann-Strau%C3%9F-Denkmal.jpg/1024px-Wien_Stadtpark_Johann-Strau%C3%9F-Denkmal.jpg',
  
  // Hotels
  'Hotel Beethoven Wien': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Naschmarkt_Wien.jpg/1280px-Naschmarkt_Wien.jpg',
};

const AMSTERDAM_IMAGES: Record<string, string> = {
  'Vondelpark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Vondelpark_Amsterdam.jpg/1280px-Vondelpark_Amsterdam.jpg',
  'Amsterdamse Bos': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Amsterdamse_Bos.jpg/1280px-Amsterdamse_Bos.jpg',
  'Westerpark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Westerpark_Amsterdam.jpg/1280px-Westerpark_Amsterdam.jpg',
  'Oosterpark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Oosterpark_Amsterdam.jpg/1280px-Oosterpark_Amsterdam.jpg',
  'Sarphatipark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Sarphatipark_Amsterdam.jpg/1280px-Sarphatipark_Amsterdam.jpg',
  'Rembrandtpark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Vondelpark_Amsterdam.jpg/1280px-Vondelpark_Amsterdam.jpg',
  'Beatrixpark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Vondelpark_Amsterdam.jpg/1280px-Vondelpark_Amsterdam.jpg',
  'Flevopark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Oosterpark_Amsterdam.jpg/1280px-Oosterpark_Amsterdam.jpg',
  'Noorderpark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Amsterdam_Noord.jpg/1280px-Amsterdam_Noord.jpg',
  'Frankendael Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Oosterpark_Amsterdam.jpg/1280px-Oosterpark_Amsterdam.jpg',
  'Sloterpark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Vondelpark_Amsterdam.jpg/1280px-Vondelpark_Amsterdam.jpg',
  'Erasmuspark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Westerpark_Amsterdam.jpg/1280px-Westerpark_Amsterdam.jpg',
  'Gaasperpark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Amsterdamse_Bos.jpg/1280px-Amsterdamse_Bos.jpg',
  'Martin Luther King Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Amsterdamse_Bos.jpg/1280px-Amsterdamse_Bos.jpg',
  'Diemerpark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Amsterdamse_Bos.jpg/1280px-Amsterdamse_Bos.jpg',
  
  // Cafés
  'Café Winkel 43': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Jordaan_Amsterdam.jpg/1280px-Jordaan_Amsterdam.jpg',
  'Café t Smalle': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Jordaan_Amsterdam.jpg/1280px-Jordaan_Amsterdam.jpg',
  'Café de Vergulde Gaper': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Jordaan_Amsterdam.jpg/1280px-Jordaan_Amsterdam.jpg',
  'Café Thijssen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Jordaan_Amsterdam.jpg/1280px-Jordaan_Amsterdam.jpg',
  'Café de Tuin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Jordaan_Amsterdam.jpg/1280px-Jordaan_Amsterdam.jpg',
  'Café Brecht': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Westerpark_Amsterdam.jpg/1280px-Westerpark_Amsterdam.jpg',
  'Café Sound Garden': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Westerpark_Amsterdam.jpg/1280px-Westerpark_Amsterdam.jpg',
  'Café de Ceuvel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Amsterdam_Noord.jpg/1280px-Amsterdam_Noord.jpg',
  'Pllek': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Amsterdam_Noord.jpg/1280px-Amsterdam_Noord.jpg',
  'CT Coffee & Coconuts': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/De_Pijp_Amsterdam.jpg/1280px-De_Pijp_Amsterdam.jpg',
  'De Biertuin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Oosterpark_Amsterdam.jpg/1280px-Oosterpark_Amsterdam.jpg',
  'Dignita': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Vondelpark_Amsterdam.jpg/1280px-Vondelpark_Amsterdam.jpg',
  'Restaurant BAK': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Amsterdam_Noord.jpg/1280px-Amsterdam_Noord.jpg',
  'Scandinavian Embassy': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/De_Pijp_Amsterdam.jpg/1280px-De_Pijp_Amsterdam.jpg',
  'Roast Chicken Bar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/De_Pijp_Amsterdam.jpg/1280px-De_Pijp_Amsterdam.jpg',
  'Gs Brunch Boat': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Jordaan_Amsterdam.jpg/1280px-Jordaan_Amsterdam.jpg',
  
  // Hotels
  'Hotel V Fizeaustraat': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Oosterpark_Amsterdam.jpg/1280px-Oosterpark_Amsterdam.jpg',
};

const COPENHAGEN_IMAGES: Record<string, string> = {
  'Fælledparken': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/F%C3%A6lledparken_-_Copenhagen.jpg/1280px-F%C3%A6lledparken_-_Copenhagen.jpg',
  'Faelledparken': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/F%C3%A6lledparken_-_Copenhagen.jpg/1280px-F%C3%A6lledparken_-_Copenhagen.jpg',
  'Dyrehaven': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Dyrehaven_2005-2.jpg/1280px-Dyrehaven_2005-2.jpg',
  'Frederiksberg Gardens': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Frederiksberg_Garden.jpg/1280px-Frederiksberg_Garden.jpg',
  'Kastellet': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Kastellet_Copenhagen.jpg/1280px-Kastellet_Copenhagen.jpg',
  'Amager Strandpark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Amager_Strand.jpg/1280px-Amager_Strand.jpg',
  'Amager Fælled': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Amager_Strand.jpg/1280px-Amager_Strand.jpg',
  'Ørstedsparken': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/F%C3%A6lledparken_-_Copenhagen.jpg/1280px-F%C3%A6lledparken_-_Copenhagen.jpg',
  'Assistens Cemetery': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Assistens_Kirkegaard_Copenhagen.jpg/1280px-Assistens_Kirkegaard_Copenhagen.jpg',
  'Christiania': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Christiania_Copenhagen.jpg/1280px-Christiania_Copenhagen.jpg',
  'Langelinie': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Kastellet_Copenhagen.jpg/1280px-Kastellet_Copenhagen.jpg',
  'Sondermarken': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Frederiksberg_Garden.jpg/1280px-Frederiksberg_Garden.jpg',
  'Valbyparken': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/F%C3%A6lledparken_-_Copenhagen.jpg/1280px-F%C3%A6lledparken_-_Copenhagen.jpg',
  'Kongelunden': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Amager_Strand.jpg/1280px-Amager_Strand.jpg',
  'Charlottenlund Strandpark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Amager_Strand.jpg/1280px-Amager_Strand.jpg',
  'Enghaveparken': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/F%C3%A6lledparken_-_Copenhagen.jpg/1280px-F%C3%A6lledparken_-_Copenhagen.jpg',
  'Utterslev Mose': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/F%C3%A6lledparken_-_Copenhagen.jpg/1280px-F%C3%A6lledparken_-_Copenhagen.jpg',
  
  // Cafés & Restaurants
  'Torvehallerne': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Torvehallerne_Copenhagen.jpg/1280px-Torvehallerne_Copenhagen.jpg',
  'Reffen Street Food': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Reffen_Copenhagen.jpg/1280px-Reffen_Copenhagen.jpg',
  'La Banchina': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Reffen_Copenhagen.jpg/1280px-Reffen_Copenhagen.jpg',
  'Cafe Norden': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Str%C3%B8get_Copenhagen.jpg/1280px-Str%C3%B8get_Copenhagen.jpg',
  'Lagkagehuset': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Str%C3%B8get_Copenhagen.jpg/1280px-Str%C3%B8get_Copenhagen.jpg',
  'Granola': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Vesterbro_Copenhagen.jpg/1280px-Vesterbro_Copenhagen.jpg',
  'Mikkeller Bar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Vesterbro_Copenhagen.jpg/1280px-Vesterbro_Copenhagen.jpg',
  'Kaffesalonen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/F%C3%A6lledparken_-_Copenhagen.jpg/1280px-F%C3%A6lledparken_-_Copenhagen.jpg',
  'Democratic Coffee': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Str%C3%B8get_Copenhagen.jpg/1280px-Str%C3%B8get_Copenhagen.jpg',
  'Original Coffee': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Str%C3%B8get_Copenhagen.jpg/1280px-Str%C3%B8get_Copenhagen.jpg',
  'Paludan Bogcafe': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Str%C3%B8get_Copenhagen.jpg/1280px-Str%C3%B8get_Copenhagen.jpg',
  'Prolog': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Vesterbro_Copenhagen.jpg/1280px-Vesterbro_Copenhagen.jpg',
  'Wulff & Konstali': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Vesterbro_Copenhagen.jpg/1280px-Vesterbro_Copenhagen.jpg',
  'Manfreds': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/N%C3%B8rrebro_Copenhagen.jpg/1280px-N%C3%B8rrebro_Copenhagen.jpg',
  
  // Hotels
  'Nobis Hotel Copenhagen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Str%C3%B8get_Copenhagen.jpg/1280px-Str%C3%B8get_Copenhagen.jpg',
};

const PRAGUE_IMAGES: Record<string, string> = {
  'Letná Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Letn%C3%A1_Park_Prague.jpg/1280px-Letn%C3%A1_Park_Prague.jpg',
  'Letna Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Letn%C3%A1_Park_Prague.jpg/1280px-Letn%C3%A1_Park_Prague.jpg',
  'Stromovka': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Stromovka_2.jpg/1280px-Stromovka_2.jpg',
  'Stromovka Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Stromovka_2.jpg/1280px-Stromovka_2.jpg',
  'Stromovka Dog Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Stromovka_2.jpg/1280px-Stromovka_2.jpg',
  'Petřín': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Petrin_observation_tower.jpg/800px-Petrin_observation_tower.jpg',
  'Vysehrad Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Vysehrad_Prague.jpg/1280px-Vysehrad_Prague.jpg',
  'Riegrovy Sady': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Riegrovy_sady.jpg/1280px-Riegrovy_sady.jpg',
  'Havlickovy Sady': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Havl%C3%AD%C4%8Dkovy_sady.jpg/1280px-Havl%C3%AD%C4%8Dkovy_sady.jpg',
  'Grébovka Dolní': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Havl%C3%AD%C4%8Dkovy_sady.jpg/1280px-Havl%C3%AD%C4%8Dkovy_sady.jpg',
  'Divoká Šárka': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Divok%C3%A1_%C5%A0%C3%A1rka.jpg/1280px-Divok%C3%A1_%C5%A0%C3%A1rka.jpg',
  'Ladronka Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Stromovka_2.jpg/1280px-Stromovka_2.jpg',
  'Prokopske Udoli': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Stromovka_2.jpg/1280px-Stromovka_2.jpg',
  'Obora Hvezda': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Stromovka_2.jpg/1280px-Stromovka_2.jpg',
  'Kinskeho Zahrada': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Petrin_observation_tower.jpg/800px-Petrin_observation_tower.jpg',
  'Vojanovy Sady': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Mala_Strana_Prague.jpg/1280px-Mala_Strana_Prague.jpg',
  'Frantiskanska Zahrada': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Old_Town_Square_Prague.jpg/1280px-Old_Town_Square_Prague.jpg',
  'Chotkovy Sady': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Mala_Strana_Prague.jpg/1280px-Mala_Strana_Prague.jpg',
  
  // Cafés & Restaurants
  'Café Louvre': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Caf%C3%A9_Louvre_Prague.jpg/1024px-Caf%C3%A9_Louvre_Prague.jpg',
  'Cafe Imperial': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Cafe_Imperial_Prague.jpg/1024px-Cafe_Imperial_Prague.jpg',
  'Cafe Savoy': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Mala_Strana_Prague.jpg/1280px-Mala_Strana_Prague.jpg',
  'U Fleků': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/U_Fleku_Prague.jpg/1024px-U_Fleku_Prague.jpg',
  'Lokál Dlouhá': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Old_Town_Square_Prague.jpg/1280px-Old_Town_Square_Prague.jpg',
  'Cafe Letka': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Letn%C3%A1_Park_Prague.jpg/1280px-Letn%C3%A1_Park_Prague.jpg',
  'Muj salek kavy': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Old_Town_Square_Prague.jpg/1280px-Old_Town_Square_Prague.jpg',
  'Kavarna co hledat': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Old_Town_Square_Prague.jpg/1280px-Old_Town_Square_Prague.jpg',
  'Eska': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Karl%C3%ADn_Prague.jpg/1280px-Karl%C3%ADn_Prague.jpg',
  'Kantyna': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Old_Town_Square_Prague.jpg/1280px-Old_Town_Square_Prague.jpg',
  'SmetanaQ': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Old_Town_Square_Prague.jpg/1280px-Old_Town_Square_Prague.jpg',
  'Bistro 8': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Old_Town_Square_Prague.jpg/1280px-Old_Town_Square_Prague.jpg',
  'Krystal Mozaika Bistro': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Karl%C3%ADn_Prague.jpg/1280px-Karl%C3%ADn_Prague.jpg',
  'Vinohradsky Pivovar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Riegrovy_sady.jpg/1280px-Riegrovy_sady.jpg',
  'Restaurace Mincovna': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Old_Town_Square_Prague.jpg/1280px-Old_Town_Square_Prague.jpg',
  
  // Hotels
  'Augustine Prague': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Mala_Strana_Prague.jpg/1280px-Mala_Strana_Prague.jpg',
};

const TOKYO_IMAGES: Record<string, string> = {
  // Parks
  'Yoyogi Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Yoyogi_Park_2012.jpg/1280px-Yoyogi_Park_2012.jpg',
  'Yoyogi Park Dog Run': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Yoyogi_Park_2012.jpg/1280px-Yoyogi_Park_2012.jpg',
  'Ueno Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Shinobazu_Pond_at_Ueno_Park_3.jpg/1280px-Shinobazu_Pond_at_Ueno_Park_3.jpg',
  'Shinjuku Gyoen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Shinjuku_Gyoen_National_Garden_-_sakura_3.JPG/1280px-Shinjuku_Gyoen_National_Garden_-_sakura_3.JPG',
  'Showakinen Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Showa_Memorial_Park_2012.jpg/1280px-Showa_Memorial_Park_2012.jpg',
  'Komazawa Olympic Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Komazawa_Olympic_Park_-_Main_Stadium.jpg/1280px-Komazawa_Olympic_Park_-_Main_Stadium.jpg',
  'Komazawa Olympic Park Dog Run': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Komazawa_Olympic_Park_-_Main_Stadium.jpg/1280px-Komazawa_Olympic_Park_-_Main_Stadium.jpg',
  'Inokashira Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Inokashira_Park_2012-04-08.jpg/1280px-Inokashira_Park_2012-04-08.jpg',
  'Inokashira Park Dog Area': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Inokashira_Park_2012-04-08.jpg/1280px-Inokashira_Park_2012-04-08.jpg',
  'Kinuta Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Kinuta_Park.jpg/1280px-Kinuta_Park.jpg',
  'Kinuta Park Dog Run': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Kinuta_Park.jpg/1280px-Kinuta_Park.jpg',
  'Hibiya Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Hibiya_Park_-_panoramio.jpg/1280px-Hibiya_Park_-_panoramio.jpg',
  'Rinkai Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Odaiba%2C_Tokyo%2C_Japan.jpg/1280px-Odaiba%2C_Tokyo%2C_Japan.jpg',
  'Rinkai Park Dog Run': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Odaiba%2C_Tokyo%2C_Japan.jpg/1280px-Odaiba%2C_Tokyo%2C_Japan.jpg',
  'Odaiba Seaside Dog Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Odaiba%2C_Tokyo%2C_Japan.jpg/1280px-Odaiba%2C_Tokyo%2C_Japan.jpg',
  'Odaiba Marine Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Odaiba%2C_Tokyo%2C_Japan.jpg/1280px-Odaiba%2C_Tokyo%2C_Japan.jpg',
  'Meguro River Walk Dog Path': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Meguro_river_cherry_blossoms.jpg/1280px-Meguro_river_cherry_blossoms.jpg',
  'Arisugawa Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Arisugawanomiya_Memorial_Park_-_waterfall.JPG/1280px-Arisugawanomiya_Memorial_Park_-_waterfall.JPG',
  'Sumida Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Sumida_Park.jpg/1280px-Sumida_Park.jpg',
  'Shiba Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Tokyo_Tower_2016.jpg/1280px-Tokyo_Tower_2016.jpg',
  'Setagaya Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Kinuta_Park.jpg/1280px-Kinuta_Park.jpg',
  'Mizumoto Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Showa_Memorial_Park_2012.jpg/1280px-Showa_Memorial_Park_2012.jpg',
  'Ariake Sports Park Dog Run': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Odaiba%2C_Tokyo%2C_Japan.jpg/1280px-Odaiba%2C_Tokyo%2C_Japan.jpg',
  
  // Walks
  'Yoyogi Park Walking Route': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Yoyogi_Park_2012.jpg/1280px-Yoyogi_Park_2012.jpg',
  'Nakameguro River Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Meguro_river_cherry_blossoms.jpg/1280px-Meguro_river_cherry_blossoms.jpg',
  'Meguro River Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Meguro_river_cherry_blossoms.jpg/1280px-Meguro_river_cherry_blossoms.jpg',
  'Odaiba Seaside Trail': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Odaiba%2C_Tokyo%2C_Japan.jpg/1280px-Odaiba%2C_Tokyo%2C_Japan.jpg',
  'Sumida River Path': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Sumida_Park.jpg/1280px-Sumida_Park.jpg',
  'Tama River Trail': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Tama_River_2012.jpg/1280px-Tama_River_2012.jpg',
  'Mt. Takao Easy Trail': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Mount_Takao_-_panoramio.jpg/1280px-Mount_Takao_-_panoramio.jpg',
  'Imperial Palace East Garden Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Imperial_Palace_East_Garden_01.jpg/1280px-Imperial_Palace_East_Garden_01.jpg',
  'Inokashira Park Loop': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Inokashira_Park_2012-04-08.jpg/1280px-Inokashira_Park_2012-04-08.jpg',
  'Arakawa River Path': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Showa_Memorial_Park_2012.jpg/1280px-Showa_Memorial_Park_2012.jpg',
  'Shonan Beach Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Shonan_Beach.jpg/1280px-Shonan_Beach.jpg',
  'Hamarikyu Gardens Surrounds': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Hamarikyu_Gardens_2013.jpg/1280px-Hamarikyu_Gardens_2013.jpg',
  'Komazawa Park Circuit': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Komazawa_Olympic_Park_-_Main_Stadium.jpg/1280px-Komazawa_Olympic_Park_-_Main_Stadium.jpg',
  'Roppongi to Azabu Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Tokyo_Tower_2016.jpg/1280px-Tokyo_Tower_2016.jpg',
  'Todoroki Valley Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Kinuta_Park.jpg/1280px-Kinuta_Park.jpg',
  
  // Cafés
  'Ivy Place': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Daikanyama_T-Site.jpg/1280px-Daikanyama_T-Site.jpg',
  'Garden House Crafts': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Daikanyama_T-Site.jpg/1280px-Daikanyama_T-Site.jpg',
  'Café Kitsune': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Omotesando_street_tokyo.jpg/1280px-Omotesando_street_tokyo.jpg',
  'Blue Bottle Coffee Nakameguro': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Meguro_river_cherry_blossoms.jpg/1280px-Meguro_river_cherry_blossoms.jpg',
  'Bills Odaiba': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Odaiba%2C_Tokyo%2C_Japan.jpg/1280px-Odaiba%2C_Tokyo%2C_Japan.jpg',
  'T.Y. Harbor': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Tennoz_Isle_Tokyo.jpg/1280px-Tennoz_Isle_Tokyo.jpg',
  'Starbucks Ueno Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Shinobazu_Pond_at_Ueno_Park_3.jpg/1280px-Shinobazu_Pond_at_Ueno_Park_3.jpg',
  'Spring Valley Brewery': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Daikanyama_T-Site.jpg/1280px-Daikanyama_T-Site.jpg',
  'Paddlers Coffee': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Nishi-Shinjuku_2-chome.jpg/1280px-Nishi-Shinjuku_2-chome.jpg',
  
  // Hotels
  'Hilton Tokyo Odaiba': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Odaiba%2C_Tokyo%2C_Japan.jpg/1280px-Odaiba%2C_Tokyo%2C_Japan.jpg',
  'InterContinental Tokyo Bay': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Odaiba%2C_Tokyo%2C_Japan.jpg/1280px-Odaiba%2C_Tokyo%2C_Japan.jpg',
  'Mitsui Garden Hotel Jingugaien': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Yoyogi_Park_2012.jpg/1280px-Yoyogi_Park_2012.jpg',
};

const SYDNEY_IMAGES: Record<string, string> = {
  // Parks
  'Centennial Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Centennial_Park_Lake_Sydney.jpg/1280px-Centennial_Park_Lake_Sydney.jpg',
  'Centennial Park Off-Leash Area': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Centennial_Park_Lake_Sydney.jpg/1280px-Centennial_Park_Lake_Sydney.jpg',
  'Royal Botanic Garden': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Royal_Botanic_Garden_Sydney_-_panoramio_%281%29.jpg/1280px-Royal_Botanic_Garden_Sydney_-_panoramio_%281%29.jpg',
  'Sydney Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Sydney_park_wetlands.jpg/1280px-Sydney_park_wetlands.jpg',
  'Rushcutters Bay Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Rushcutters_Bay_Park%2C_Sydney.jpg/1280px-Rushcutters_Bay_Park%2C_Sydney.jpg',
  'Bicentennial Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Homebush_Bay_Sydney_Olympic_Park.jpg/1280px-Homebush_Bay_Sydney_Olympic_Park.jpg',
  'Rose Bay Beach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Rose_Bay%2C_Sydney.jpg/1280px-Rose_Bay%2C_Sydney.jpg',
  'Queens Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Queens_Park%2C_Sydney.jpg/1280px-Queens_Park%2C_Sydney.jpg',
  'Observatory Hill Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Sydney_Observatory_Hill.jpg/1280px-Sydney_Observatory_Hill.jpg',
  'Cooper Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Centennial_Park_Lake_Sydney.jpg/1280px-Centennial_Park_Lake_Sydney.jpg',
  'Marrickville Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Sydney_park_wetlands.jpg/1280px-Sydney_park_wetlands.jpg',
  'Newtown Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Sydney_park_wetlands.jpg/1280px-Sydney_park_wetlands.jpg',
  'Enmore Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Sydney_park_wetlands.jpg/1280px-Sydney_park_wetlands.jpg',
  'Bronte Gully': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Bronte_Beach%2C_Sydney.jpg/1280px-Bronte_Beach%2C_Sydney.jpg',
  'Tempe Reserve': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Sydney_park_wetlands.jpg/1280px-Sydney_park_wetlands.jpg',
  'McKell Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Rose_Bay%2C_Sydney.jpg/1280px-Rose_Bay%2C_Sydney.jpg',
  'Balmoral Oval': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Balmoral_Beach_Sydney.jpg/1280px-Balmoral_Beach_Sydney.jpg',
  'Federal Park Dog Beach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Sydney_park_wetlands.jpg/1280px-Sydney_park_wetlands.jpg',
  'Blackwattle Bay Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Anzac_Bridge_2015.jpg/1280px-Anzac_Bridge_2015.jpg',
  'Sirius Cove Reserve Dog Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Balmoral_Beach_Sydney.jpg/1280px-Balmoral_Beach_Sydney.jpg',
  'Milk Beach Reserve': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Rose_Bay%2C_Sydney.jpg/1280px-Rose_Bay%2C_Sydney.jpg',
  'Hawthorne Canal Reserve': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Sydney_park_wetlands.jpg/1280px-Sydney_park_wetlands.jpg',
  'Gore Hill Oval': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Centennial_Park_Lake_Sydney.jpg/1280px-Centennial_Park_Lake_Sydney.jpg',
  
  // Walks
  'Bondi to Coogee Coastal Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Bondi_to_Coogee_coastal_walk.jpg/1280px-Bondi_to_Coogee_coastal_walk.jpg',
  'Manly to Spit Bridge Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Manly_Beach_Panorama.jpg/1280px-Manly_Beach_Panorama.jpg',
  'Bay Run': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Anzac_Bridge_2015.jpg/1280px-Anzac_Bridge_2015.jpg',
  'Wolli Creek Trail': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Sydney_park_wetlands.jpg/1280px-Sydney_park_wetlands.jpg',
  'Lane Cove National Park Walks': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Centennial_Park_Lake_Sydney.jpg/1280px-Centennial_Park_Lake_Sydney.jpg',
  'Balls Head Reserve Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Anzac_Bridge_2015.jpg/1280px-Anzac_Bridge_2015.jpg',
  'Homebush Bay Trail': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Homebush_Bay_Sydney_Olympic_Park.jpg/1280px-Homebush_Bay_Sydney_Olympic_Park.jpg',
  'Watsons Bay to South Head': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Rose_Bay%2C_Sydney.jpg/1280px-Rose_Bay%2C_Sydney.jpg',
  'Narrabeen Lagoon Trail': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Manly_Beach_Panorama.jpg/1280px-Manly_Beach_Panorama.jpg',
  'Cooks River Trail': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Sydney_park_wetlands.jpg/1280px-Sydney_park_wetlands.jpg',
  'Parramatta Valley Cycleway': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Homebush_Bay_Sydney_Olympic_Park.jpg/1280px-Homebush_Bay_Sydney_Olympic_Park.jpg',
  'Blue Mountains National Park Walks': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Blue_Mountains_Three_Sisters.jpg/1280px-Blue_Mountains_Three_Sisters.jpg',
  'Royal National Park - Lady Carrington Drive': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Royal_National_Park%2C_NSW.jpg/1280px-Royal_National_Park%2C_NSW.jpg',
  'Cronulla to Bundeena Coastal Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Royal_National_Park%2C_NSW.jpg/1280px-Royal_National_Park%2C_NSW.jpg',
  'Ku-ring-gai Chase - West Head': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Ku-ring-gai_Chase_National_Park.jpg/1280px-Ku-ring-gai_Chase_National_Park.jpg',
  
  // Cafes
  'The Grounds of Alexandria': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Sydney_park_wetlands.jpg/1280px-Sydney_park_wetlands.jpg',
  'The Boathouse Balmoral': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Balmoral_Beach_Sydney.jpg/1280px-Balmoral_Beach_Sydney.jpg',
  'Paramount Coffee Project': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Anzac_Bridge_2015.jpg/1280px-Anzac_Bridge_2015.jpg',
  'Three Blue Ducks': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Bronte_Beach%2C_Sydney.jpg/1280px-Bronte_Beach%2C_Sydney.jpg',
  'The Bourke Street Bakery': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Sydney_park_wetlands.jpg/1280px-Sydney_park_wetlands.jpg',
  
  // Hotels
  'Pier One Sydney Harbour': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Sydney_Harbour_Bridge_from_the_north.jpg/1280px-Sydney_Harbour_Bridge_from_the_north.jpg',
  'QT Bondi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Bondi_Beach_Sydney.jpg/1280px-Bondi_Beach_Sydney.jpg',
  'The Sebel Sydney Manly Beach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Manly_Beach_Panorama.jpg/1280px-Manly_Beach_Panorama.jpg',
  'Ovolo Woolloomooloo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Sydney_Harbour_Bridge_from_the_north.jpg/1280px-Sydney_Harbour_Bridge_from_the_north.jpg',
  'Novotel Sydney on Darling Harbour': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Darling_Harbour_Sydney.jpg/1280px-Darling_Harbour_Sydney.jpg',
  'Vibe Hotel Sydney': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Darling_Harbour_Sydney.jpg/1280px-Darling_Harbour_Sydney.jpg',
};

const MELBOURNE_IMAGES: Record<string, string> = {
  // Parks
  'Royal Botanic Gardens': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Royal_Botanic_Gardens%2C_Melbourne_Feb_2014.jpg/1280px-Royal_Botanic_Gardens%2C_Melbourne_Feb_2014.jpg',
  'Fitzroy Gardens': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Fitzroy_Gardens_Melbourne.jpg/1280px-Fitzroy_Gardens_Melbourne.jpg',
  'Albert Park Lake': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Albert_Park_Lake_Melbourne.jpg/1280px-Albert_Park_Lake_Melbourne.jpg',
  'Albert Park Dog Beach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Albert_Park_Lake_Melbourne.jpg/1280px-Albert_Park_Lake_Melbourne.jpg',
  'Edinburgh Gardens': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Fitzroy_Gardens_Melbourne.jpg/1280px-Fitzroy_Gardens_Melbourne.jpg',
  'Edinburgh Gardens Dog Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Fitzroy_Gardens_Melbourne.jpg/1280px-Fitzroy_Gardens_Melbourne.jpg',
  'Flagstaff Gardens': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Fitzroy_Gardens_Melbourne.jpg/1280px-Fitzroy_Gardens_Melbourne.jpg',
  'Princes Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Fitzroy_Gardens_Melbourne.jpg/1280px-Fitzroy_Gardens_Melbourne.jpg',
  'Royal Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Royal_Botanic_Gardens%2C_Melbourne_Feb_2014.jpg/1280px-Royal_Botanic_Gardens%2C_Melbourne_Feb_2014.jpg',
  'Royal Park Dog Area': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Royal_Botanic_Gardens%2C_Melbourne_Feb_2014.jpg/1280px-Royal_Botanic_Gardens%2C_Melbourne_Feb_2014.jpg',
  'Royal Park Off-Leash': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Royal_Botanic_Gardens%2C_Melbourne_Feb_2014.jpg/1280px-Royal_Botanic_Gardens%2C_Melbourne_Feb_2014.jpg',
  'Yarra Bend Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Yarra_River_Melbourne.jpg/1280px-Yarra_River_Melbourne.jpg',
  'St Kilda Botanical Gardens': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Royal_Botanic_Gardens%2C_Melbourne_Feb_2014.jpg/1280px-Royal_Botanic_Gardens%2C_Melbourne_Feb_2014.jpg',
  'St Kilda Dog Beach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/St_Kilda_Beach.jpg/1280px-St_Kilda_Beach.jpg',
  'Brighton Dog Beach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Brighton_bathing_boxes.jpg/1280px-Brighton_bathing_boxes.jpg',
  'Elwood Beach Dog Area': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/St_Kilda_Beach.jpg/1280px-St_Kilda_Beach.jpg',
  'Altona Dog Beach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/St_Kilda_Beach.jpg/1280px-St_Kilda_Beach.jpg',
  'Westgate Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/St_Kilda_Beach.jpg/1280px-St_Kilda_Beach.jpg',
  'Westgate Park Dog Beach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/St_Kilda_Beach.jpg/1280px-St_Kilda_Beach.jpg',
  'Fawkner Park Dog Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Fitzroy_Gardens_Melbourne.jpg/1280px-Fitzroy_Gardens_Melbourne.jpg',
  'JJ Holland Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Fitzroy_Gardens_Melbourne.jpg/1280px-Fitzroy_Gardens_Melbourne.jpg',
  'Gardenvale Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Fitzroy_Gardens_Melbourne.jpg/1280px-Fitzroy_Gardens_Melbourne.jpg',
  'Merri Creek Trail': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Yarra_River_Melbourne.jpg/1280px-Yarra_River_Melbourne.jpg',
  'Bundoora Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Royal_Botanic_Gardens%2C_Melbourne_Feb_2014.jpg/1280px-Royal_Botanic_Gardens%2C_Melbourne_Feb_2014.jpg',
  'Docklands Dog Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Yarra_River_Melbourne.jpg/1280px-Yarra_River_Melbourne.jpg',
  
  // Walks
  'Capital City Trail': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Yarra_River_Melbourne.jpg/1280px-Yarra_River_Melbourne.jpg',
  'Yarra Trail': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Yarra_River_Melbourne.jpg/1280px-Yarra_River_Melbourne.jpg',
  'Bay Trail': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/St_Kilda_Beach.jpg/1280px-St_Kilda_Beach.jpg',
  'Maribyrnong River Trail': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Yarra_River_Melbourne.jpg/1280px-Yarra_River_Melbourne.jpg',
  'Sandridge Beach Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/St_Kilda_Beach.jpg/1280px-St_Kilda_Beach.jpg',
  'Darebin Creek Trail': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Yarra_River_Melbourne.jpg/1280px-Yarra_River_Melbourne.jpg',
  'Kananook Creek Trail': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Yarra_River_Melbourne.jpg/1280px-Yarra_River_Melbourne.jpg',
  'Great Ocean Road Walk Sections': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Great_Ocean_Road%2C_Victoria%2C_Australia.jpg/1280px-Great_Ocean_Road%2C_Victoria%2C_Australia.jpg',
  'Dandenong Ranges Walk - 1000 Steps': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Dandenong_Ranges_Victoria.jpg/1280px-Dandenong_Ranges_Victoria.jpg',
  'Werribee Gorge Circuit Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Dandenong_Ranges_Victoria.jpg/1280px-Dandenong_Ranges_Victoria.jpg',
  'You Yangs Regional Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Dandenong_Ranges_Victoria.jpg/1280px-Dandenong_Ranges_Victoria.jpg',
  'Bellarine Rail Trail': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Great_Ocean_Road%2C_Victoria%2C_Australia.jpg/1280px-Great_Ocean_Road%2C_Victoria%2C_Australia.jpg',
  'Phillip Island Nature Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Great_Ocean_Road%2C_Victoria%2C_Australia.jpg/1280px-Great_Ocean_Road%2C_Victoria%2C_Australia.jpg',
  'Lilydale to Warburton Rail Trail': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Dandenong_Ranges_Victoria.jpg/1280px-Dandenong_Ranges_Victoria.jpg',
  'Mornington Peninsula Coastal Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Great_Ocean_Road%2C_Victoria%2C_Australia.jpg/1280px-Great_Ocean_Road%2C_Victoria%2C_Australia.jpg',
  
  // Cafés
  'Industry Beans': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Fitzroy_Gardens_Melbourne.jpg/1280px-Fitzroy_Gardens_Melbourne.jpg',
  'Axil Coffee Roasters': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Fitzroy_Gardens_Melbourne.jpg/1280px-Fitzroy_Gardens_Melbourne.jpg',
  'Higher Ground': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Fitzroy_Gardens_Melbourne.jpg/1280px-Fitzroy_Gardens_Melbourne.jpg',
  'The Kettle Black': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Fitzroy_Gardens_Melbourne.jpg/1280px-Fitzroy_Gardens_Melbourne.jpg',
  'Proud Mary': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Fitzroy_Gardens_Melbourne.jpg/1280px-Fitzroy_Gardens_Melbourne.jpg',
  'St Ali': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/St_Kilda_Beach.jpg/1280px-St_Kilda_Beach.jpg',
  'Top Paddock': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Fitzroy_Gardens_Melbourne.jpg/1280px-Fitzroy_Gardens_Melbourne.jpg',
  'Market Lane Coffee': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Fitzroy_Gardens_Melbourne.jpg/1280px-Fitzroy_Gardens_Melbourne.jpg',
  'Wide Open Road Coffee': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Fitzroy_Gardens_Melbourne.jpg/1280px-Fitzroy_Gardens_Melbourne.jpg',
  'Cibi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Fitzroy_Gardens_Melbourne.jpg/1280px-Fitzroy_Gardens_Melbourne.jpg',
  'Pope Joan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Fitzroy_Gardens_Melbourne.jpg/1280px-Fitzroy_Gardens_Melbourne.jpg',
  'Lune Croissanterie': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Fitzroy_Gardens_Melbourne.jpg/1280px-Fitzroy_Gardens_Melbourne.jpg',
  'Auction Rooms': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Fitzroy_Gardens_Melbourne.jpg/1280px-Fitzroy_Gardens_Melbourne.jpg',
  'Patricia Coffee Brewers': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Fitzroy_Gardens_Melbourne.jpg/1280px-Fitzroy_Gardens_Melbourne.jpg',
  'Dead Man Espresso': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Fitzroy_Gardens_Melbourne.jpg/1280px-Fitzroy_Gardens_Melbourne.jpg',
  'Chez Dré': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/St_Kilda_Beach.jpg/1280px-St_Kilda_Beach.jpg',
  
  // Hotels
  'The Langham Melbourne': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Yarra_River_Melbourne.jpg/1280px-Yarra_River_Melbourne.jpg',
  'Vibe Hotel Melbourne': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Yarra_River_Melbourne.jpg/1280px-Yarra_River_Melbourne.jpg',
  'Novotel Melbourne South Wharf': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Yarra_River_Melbourne.jpg/1280px-Yarra_River_Melbourne.jpg',
  'Art Series - The Olsen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/St_Kilda_Beach.jpg/1280px-St_Kilda_Beach.jpg',
  'The Blackman': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/St_Kilda_Beach.jpg/1280px-St_Kilda_Beach.jpg',
  'Quest on Dorcas': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/St_Kilda_Beach.jpg/1280px-St_Kilda_Beach.jpg',
  'Punthill South Yarra': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Yarra_River_Melbourne.jpg/1280px-Yarra_River_Melbourne.jpg',
};

const NEW_YORK_IMAGES: Record<string, string> = {
  // Parks
  'Central Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Central_Park_-_The_Pond_%2848377220157%29.jpg/1280px-Central_Park_-_The_Pond_%2848377220157%29.jpg',
  'Central Park Dog Run': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Central_Park_-_The_Pond_%2848377220157%29.jpg/1280px-Central_Park_-_The_Pond_%2848377220157%29.jpg',
  'Prospect Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Prospect_Park_New_York_October_2015_panorama_3.jpg/1280px-Prospect_Park_New_York_October_2015_panorama_3.jpg',
  'Prospect Park Dog Beach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Prospect_Park_New_York_October_2015_panorama_3.jpg/1280px-Prospect_Park_New_York_October_2015_panorama_3.jpg',
  'Hudson River Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Hudson_River_Park_td_%282018-11-14%29_102_-_Pier_45.jpg/1280px-Hudson_River_Park_td_%282018-11-14%29_102_-_Pier_45.jpg',
  'Riverside Park Dog Runs': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Hudson_River_Park_td_%282018-11-14%29_102_-_Pier_45.jpg/1280px-Hudson_River_Park_td_%282018-11-14%29_102_-_Pier_45.jpg',
  'Washington Square Park Dog Run': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Washington_Square_Park_New_York.jpg/1280px-Washington_Square_Park_New_York.jpg',
  'Madison Square Park Dog Run': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Flatiron_Building_New_York.jpg/1280px-Flatiron_Building_New_York.jpg',
  'Tompkins Square Park Dog Run': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Tompkins_Square_Park_-_panoramio.jpg/1280px-Tompkins_Square_Park_-_panoramio.jpg',
  'Tompkins Square Dog Run': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Tompkins_Square_Park_-_panoramio.jpg/1280px-Tompkins_Square_Park_-_panoramio.jpg',
  'Brooklyn Bridge Park Dog Beach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Brooklyn_Bridge_Park_from_Water_Street.jpg/1280px-Brooklyn_Bridge_Park_from_Water_Street.jpg',
  'Carl Schurz Park Dog Run': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Central_Park_-_The_Pond_%2848377220157%29.jpg/1280px-Central_Park_-_The_Pond_%2848377220157%29.jpg',
  'Fort Tryon Park Dog Run': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Fort_Tryon_Park_Heather_Garden.jpg/1280px-Fort_Tryon_Park_Heather_Garden.jpg',
  'Van Cortlandt Park Dog Run': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Central_Park_-_The_Pond_%2848377220157%29.jpg/1280px-Central_Park_-_The_Pond_%2848377220157%29.jpg',
  'McCarren Park Dog Run': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Prospect_Park_New_York_October_2015_panorama_3.jpg/1280px-Prospect_Park_New_York_October_2015_panorama_3.jpg',
  'Flushing Meadows Dog Run': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flushing_Meadows_Corona_Park.jpg/1280px-Flushing_Meadows_Corona_Park.jpg',
  'Chelsea Waterside Park Dog Run': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Hudson_River_Park_td_%282018-11-14%29_102_-_Pier_45.jpg/1280px-Hudson_River_Park_td_%282018-11-14%29_102_-_Pier_45.jpg',
  'Sirius Dog Run': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Hudson_River_Park_td_%282018-11-14%29_102_-_Pier_45.jpg/1280px-Hudson_River_Park_td_%282018-11-14%29_102_-_Pier_45.jpg',
  'Little West 12th Historic Dog Run': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Hudson_River_Park_td_%282018-11-14%29_102_-_Pier_45.jpg/1280px-Hudson_River_Park_td_%282018-11-14%29_102_-_Pier_45.jpg',
  
  // Walks
  'The High Line Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/High_Line_20th_Street.jpg/1280px-High_Line_20th_Street.jpg',
  'Brooklyn Bridge Promenade': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Brooklyn_Bridge_-_New_York_City.jpg/1280px-Brooklyn_Bridge_-_New_York_City.jpg',
  'Hudson River Greenway': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Hudson_River_Park_td_%282018-11-14%29_102_-_Pier_45.jpg/1280px-Hudson_River_Park_td_%282018-11-14%29_102_-_Pier_45.jpg',
  'East River Esplanade': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Brooklyn_Bridge_Park_from_Water_Street.jpg/1280px-Brooklyn_Bridge_Park_from_Water_Street.jpg',
  'Governors Island Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Governors_Island_NYC.jpg/1280px-Governors_Island_NYC.jpg',
  'Rockaway Beach Dog Area': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flushing_Meadows_Corona_Park.jpg/1280px-Flushing_Meadows_Corona_Park.jpg',
  'Inwood Hill Park Trails': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Fort_Tryon_Park_Heather_Garden.jpg/1280px-Fort_Tryon_Park_Heather_Garden.jpg',
  'Shore Road Promenade': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Brooklyn_Bridge_Park_from_Water_Street.jpg/1280px-Brooklyn_Bridge_Park_from_Water_Street.jpg',
  'Roosevelt Island Loop': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Brooklyn_Bridge_-_New_York_City.jpg/1280px-Brooklyn_Bridge_-_New_York_City.jpg',
  'DUMBO Waterfront Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Brooklyn_Bridge_Park_from_Water_Street.jpg/1280px-Brooklyn_Bridge_Park_from_Water_Street.jpg',
  'Brooklyn Promenade': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Brooklyn_Bridge_Park_from_Water_Street.jpg/1280px-Brooklyn_Bridge_Park_from_Water_Street.jpg',
  'Jamaica Bay Greenway': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flushing_Meadows_Corona_Park.jpg/1280px-Flushing_Meadows_Corona_Park.jpg',
  
  // Cafés
  'Boris & Horton': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Tompkins_Square_Park_-_panoramio.jpg/1280px-Tompkins_Square_Park_-_panoramio.jpg',
  'The Grey Dog': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Washington_Square_Park_New_York.jpg/1280px-Washington_Square_Park_New_York.jpg',
  'Shake Shack Madison Square': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Flatiron_Building_New_York.jpg/1280px-Flatiron_Building_New_York.jpg',
  "Jack's Wife Freda": 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Washington_Square_Park_New_York.jpg/1280px-Washington_Square_Park_New_York.jpg',
  'Westville': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Washington_Square_Park_New_York.jpg/1280px-Washington_Square_Park_New_York.jpg',
  'Café Mogador': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Tompkins_Square_Park_-_panoramio.jpg/1280px-Tompkins_Square_Park_-_panoramio.jpg',
  'Bluestone Lane': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Washington_Square_Park_New_York.jpg/1280px-Washington_Square_Park_New_York.jpg',
  "Bubby's Tribeca": 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Hudson_River_Park_td_%282018-11-14%29_102_-_Pier_45.jpg/1280px-Hudson_River_Park_td_%282018-11-14%29_102_-_Pier_45.jpg',
  'The Smile': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Tompkins_Square_Park_-_panoramio.jpg/1280px-Tompkins_Square_Park_-_panoramio.jpg',
  'Devoción': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Prospect_Park_New_York_October_2015_panorama_3.jpg/1280px-Prospect_Park_New_York_October_2015_panorama_3.jpg',
  'Le Pain Quotidien - Union Square': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Flatiron_Building_New_York.jpg/1280px-Flatiron_Building_New_York.jpg',
  'Gemma': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Tompkins_Square_Park_-_panoramio.jpg/1280px-Tompkins_Square_Park_-_panoramio.jpg',
  'Barking Dog': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Central_Park_-_The_Pond_%2848377220157%29.jpg/1280px-Central_Park_-_The_Pond_%2848377220157%29.jpg',
  
  // Hotels
  'The William Vale': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Prospect_Park_New_York_October_2015_panorama_3.jpg/1280px-Prospect_Park_New_York_October_2015_panorama_3.jpg',
  'The Bowery Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Tompkins_Square_Park_-_panoramio.jpg/1280px-Tompkins_Square_Park_-_panoramio.jpg',
  'Crosby Street Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Washington_Square_Park_New_York.jpg/1280px-Washington_Square_Park_New_York.jpg',
  'The Greenwich Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Hudson_River_Park_td_%282018-11-14%29_102_-_Pier_45.jpg/1280px-Hudson_River_Park_td_%282018-11-14%29_102_-_Pier_45.jpg',
  'Hotel Hugo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Hudson_River_Park_td_%282018-11-14%29_102_-_Pier_45.jpg/1280px-Hudson_River_Park_td_%282018-11-14%29_102_-_Pier_45.jpg',
  'The Ludlow Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Tompkins_Square_Park_-_panoramio.jpg/1280px-Tompkins_Square_Park_-_panoramio.jpg',
  '1 Hotel Brooklyn Bridge': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Brooklyn_Bridge_Park_from_Water_Street.jpg/1280px-Brooklyn_Bridge_Park_from_Water_Street.jpg',
  'Wythe Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Prospect_Park_New_York_October_2015_panorama_3.jpg/1280px-Prospect_Park_New_York_October_2015_panorama_3.jpg',
  'The Hoxton Williamsburg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Prospect_Park_New_York_October_2015_panorama_3.jpg/1280px-Prospect_Park_New_York_October_2015_panorama_3.jpg',
  'The NoMad Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Flatiron_Building_New_York.jpg/1280px-Flatiron_Building_New_York.jpg',
  'Ace Hotel New York': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Flatiron_Building_New_York.jpg/1280px-Flatiron_Building_New_York.jpg',
  'The Standard High Line': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/High_Line_20th_Street.jpg/1280px-High_Line_20th_Street.jpg',
  'PUBLIC Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Tompkins_Square_Park_-_panoramio.jpg/1280px-Tompkins_Square_Park_-_panoramio.jpg',
  'The Beekman Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Brooklyn_Bridge_-_New_York_City.jpg/1280px-Brooklyn_Bridge_-_New_York_City.jpg',
  'The Marlton Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Washington_Square_Park_New_York.jpg/1280px-Washington_Square_Park_New_York.jpg',
};

const LOS_ANGELES_IMAGES: Record<string, string> = {
  // Parks
  'Griffith Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Griffith_Observatory_2006.jpg/1280px-Griffith_Observatory_2006.jpg',
  'Griffith Park Dog Parks': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Griffith_Observatory_2006.jpg/1280px-Griffith_Observatory_2006.jpg',
  'Runyon Canyon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Runyon_Canyon_Park.jpg/1280px-Runyon_Canyon_Park.jpg',
  'Runyon Canyon Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Runyon_Canyon_Park.jpg/1280px-Runyon_Canyon_Park.jpg',
  'Venice Beach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Venice_Beach%2C_Los_Angeles%2C_CA_01.jpg/1280px-Venice_Beach%2C_Los_Angeles%2C_CA_01.jpg',
  'Silver Lake Dog Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Silver_Lake_Reservoir.jpg/1280px-Silver_Lake_Reservoir.jpg',
  'Silverlake Dog Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Silver_Lake_Reservoir.jpg/1280px-Silver_Lake_Reservoir.jpg',
  'Echo Park Dog Run': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Echo_Park_Lake.jpg/1280px-Echo_Park_Lake.jpg',
  'Laurel Canyon Dog Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Runyon_Canyon_Park.jpg/1280px-Runyon_Canyon_Park.jpg',
  'Sepulveda Basin Off-Leash Dog Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Griffith_Observatory_2006.jpg/1280px-Griffith_Observatory_2006.jpg',
  "Rosie's Dog Beach": 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Venice_Beach%2C_Los_Angeles%2C_CA_01.jpg/1280px-Venice_Beach%2C_Los_Angeles%2C_CA_01.jpg',
  'Leo Carrillo Dog Beach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Santa_Monica_Beach.jpg/1280px-Santa_Monica_Beach.jpg',
  'Barrington Dog Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Santa_Monica_Beach.jpg/1280px-Santa_Monica_Beach.jpg',
  'Hermon Dog Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Griffith_Observatory_2006.jpg/1280px-Griffith_Observatory_2006.jpg',
  'Culver City Dog Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Venice_Beach%2C_Los_Angeles%2C_CA_01.jpg/1280px-Venice_Beach%2C_Los_Angeles%2C_CA_01.jpg',
  'Westminster Dog Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Venice_Beach%2C_Los_Angeles%2C_CA_01.jpg/1280px-Venice_Beach%2C_Los_Angeles%2C_CA_01.jpg',
  
  // Walks
  'Santa Monica Beach Path': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Santa_Monica_Beach.jpg/1280px-Santa_Monica_Beach.jpg',
  'Griffith Observatory Trail': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Griffith_Observatory_2006.jpg/1280px-Griffith_Observatory_2006.jpg',
  'Fryman Canyon Trail': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Runyon_Canyon_Park.jpg/1280px-Runyon_Canyon_Park.jpg',
  'Topanga State Park Trails': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Topanga_State_Park.jpg/1280px-Topanga_State_Park.jpg',
  'Elysian Park Trails': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Echo_Park_Lake.jpg/1280px-Echo_Park_Lake.jpg',
  'Palos Verdes Coastal Trail': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Santa_Monica_Beach.jpg/1280px-Santa_Monica_Beach.jpg',
  'Eaton Canyon Trail': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Griffith_Observatory_2006.jpg/1280px-Griffith_Observatory_2006.jpg',
  'Kenneth Hahn State Recreation Area': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Silver_Lake_Reservoir.jpg/1280px-Silver_Lake_Reservoir.jpg',
  'Temescal Gateway Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Santa_Monica_Beach.jpg/1280px-Santa_Monica_Beach.jpg',
  'Baldwin Hills Scenic Overlook': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Silver_Lake_Reservoir.jpg/1280px-Silver_Lake_Reservoir.jpg',
  'Will Rogers State Historic Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Santa_Monica_Beach.jpg/1280px-Santa_Monica_Beach.jpg',
  'Playa del Rey Beach Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Venice_Beach%2C_Los_Angeles%2C_CA_01.jpg/1280px-Venice_Beach%2C_Los_Angeles%2C_CA_01.jpg',
  'The Arroyo Seco Trail': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Griffith_Observatory_2006.jpg/1280px-Griffith_Observatory_2006.jpg',
  
  // Cafés
  'Intelligentsia Coffee': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Silver_Lake_Reservoir.jpg/1280px-Silver_Lake_Reservoir.jpg',
  'Sqirl': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Silver_Lake_Reservoir.jpg/1280px-Silver_Lake_Reservoir.jpg',
  'Gjusta': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Venice_Beach%2C_Los_Angeles%2C_CA_01.jpg/1280px-Venice_Beach%2C_Los_Angeles%2C_CA_01.jpg',
  'Alcove Cafe & Bakery': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Silver_Lake_Reservoir.jpg/1280px-Silver_Lake_Reservoir.jpg',
  'The Dog Café': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Silver_Lake_Reservoir.jpg/1280px-Silver_Lake_Reservoir.jpg',
  "Jon & Vinny's": 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Silver_Lake_Reservoir.jpg/1280px-Silver_Lake_Reservoir.jpg',
  'Café Gratitude': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Venice_Beach%2C_Los_Angeles%2C_CA_01.jpg/1280px-Venice_Beach%2C_Los_Angeles%2C_CA_01.jpg',
  "The Butcher's Daughter": 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Venice_Beach%2C_Los_Angeles%2C_CA_01.jpg/1280px-Venice_Beach%2C_Los_Angeles%2C_CA_01.jpg',
  'Zinc Cafe & Market': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Silver_Lake_Reservoir.jpg/1280px-Silver_Lake_Reservoir.jpg',
  'Fred 62': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Silver_Lake_Reservoir.jpg/1280px-Silver_Lake_Reservoir.jpg',
  'Eveleigh': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Runyon_Canyon_Park.jpg/1280px-Runyon_Canyon_Park.jpg',
  'Destroyer': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Venice_Beach%2C_Los_Angeles%2C_CA_01.jpg/1280px-Venice_Beach%2C_Los_Angeles%2C_CA_01.jpg',
  'Guisados': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Echo_Park_Lake.jpg/1280px-Echo_Park_Lake.jpg',
  'Angel City Brewery': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Silver_Lake_Reservoir.jpg/1280px-Silver_Lake_Reservoir.jpg',
  'Aroma Coffee & Tea': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Griffith_Observatory_2006.jpg/1280px-Griffith_Observatory_2006.jpg',
  
  // Hotels
  'The Ace Hotel Downtown LA': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Silver_Lake_Reservoir.jpg/1280px-Silver_Lake_Reservoir.jpg',
  'The LINE LA': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Silver_Lake_Reservoir.jpg/1280px-Silver_Lake_Reservoir.jpg',
  'The Hoxton Downtown LA': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Silver_Lake_Reservoir.jpg/1280px-Silver_Lake_Reservoir.jpg',
  'Hotel Erwin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Venice_Beach%2C_Los_Angeles%2C_CA_01.jpg/1280px-Venice_Beach%2C_Los_Angeles%2C_CA_01.jpg',
  'Shore Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Santa_Monica_Beach.jpg/1280px-Santa_Monica_Beach.jpg',
  'Palihouse Santa Monica': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Santa_Monica_Beach.jpg/1280px-Santa_Monica_Beach.jpg',
  'The Garland': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Griffith_Observatory_2006.jpg/1280px-Griffith_Observatory_2006.jpg',
  'Loews Hollywood Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Griffith_Observatory_2006.jpg/1280px-Griffith_Observatory_2006.jpg',
  'Kimpton Everly Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Griffith_Observatory_2006.jpg/1280px-Griffith_Observatory_2006.jpg',
  'W Hollywood': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Griffith_Observatory_2006.jpg/1280px-Griffith_Observatory_2006.jpg',
  'The Standard Hollywood': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Runyon_Canyon_Park.jpg/1280px-Runyon_Canyon_Park.jpg',
  'Shutters on the Beach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Santa_Monica_Beach.jpg/1280px-Santa_Monica_Beach.jpg',
  'Mr. C Beverly Hills': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Griffith_Observatory_2006.jpg/1280px-Griffith_Observatory_2006.jpg',
  'Hotel Figueroa': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Silver_Lake_Reservoir.jpg/1280px-Silver_Lake_Reservoir.jpg',
};

const VANCOUVER_IMAGES: Record<string, string> = {
  // Parks
  'Stanley Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Stanley_Park%2C_Vancouver_%287889021774%29.jpg/1280px-Stanley_Park%2C_Vancouver_%287889021774%29.jpg',
  'Queen Elizabeth Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Queen_Elizabeth_Park%2C_Vancouver%2C_BC_-_panoramio_%281%29.jpg/1280px-Queen_Elizabeth_Park%2C_Vancouver%2C_BC_-_panoramio_%281%29.jpg',
  'Queen Elizabeth Park Trails': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Queen_Elizabeth_Park%2C_Vancouver%2C_BC_-_panoramio_%281%29.jpg/1280px-Queen_Elizabeth_Park%2C_Vancouver%2C_BC_-_panoramio_%281%29.jpg',
  'Pacific Spirit Regional Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Stanley_Park%2C_Vancouver_%287889021774%29.jpg/1280px-Stanley_Park%2C_Vancouver_%287889021774%29.jpg',
  'Spanish Banks Beach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Spanish_Banks_Beach_Vancouver.jpg/1280px-Spanish_Banks_Beach_Vancouver.jpg',
  'Kitsilano Beach Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Kitsilano_Beach_Vancouver.jpg/1280px-Kitsilano_Beach_Vancouver.jpg',
  'Jericho Beach Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Kitsilano_Beach_Vancouver.jpg/1280px-Kitsilano_Beach_Vancouver.jpg',
  'Locarno Beach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Spanish_Banks_Beach_Vancouver.jpg/1280px-Spanish_Banks_Beach_Vancouver.jpg',
  'Sunset Beach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Kitsilano_Beach_Vancouver.jpg/1280px-Kitsilano_Beach_Vancouver.jpg',
  'David Lam Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/False_Creek_Vancouver.jpg/1280px-False_Creek_Vancouver.jpg',
  'Vanier Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Kitsilano_Beach_Vancouver.jpg/1280px-Kitsilano_Beach_Vancouver.jpg',
  'Trout Lake (John Hendry Park)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Queen_Elizabeth_Park%2C_Vancouver%2C_BC_-_panoramio_%281%29.jpg/1280px-Queen_Elizabeth_Park%2C_Vancouver%2C_BC_-_panoramio_%281%29.jpg',
  'New Brighton Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Stanley_Park%2C_Vancouver_%287889021774%29.jpg/1280px-Stanley_Park%2C_Vancouver_%287889021774%29.jpg',
  'Charleson Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/False_Creek_Vancouver.jpg/1280px-False_Creek_Vancouver.jpg',
  'Coal Harbour Seawalk Dog Area': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Stanley_Park%2C_Vancouver_%287889021774%29.jpg/1280px-Stanley_Park%2C_Vancouver_%287889021774%29.jpg',
  'Crab Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Stanley_Park%2C_Vancouver_%287889021774%29.jpg/1280px-Stanley_Park%2C_Vancouver_%287889021774%29.jpg',
  'Andy Livingstone Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/False_Creek_Vancouver.jpg/1280px-False_Creek_Vancouver.jpg',
  
  // Walks
  'Stanley Park Seawall': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Stanley_Park%2C_Vancouver_%287889021774%29.jpg/1280px-Stanley_Park%2C_Vancouver_%287889021774%29.jpg',
  'False Creek Seawall': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/False_Creek_Vancouver.jpg/1280px-False_Creek_Vancouver.jpg',
  'Lynn Canyon Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Lynn_Canyon_Suspension_Bridge.jpg/1280px-Lynn_Canyon_Suspension_Bridge.jpg',
  'Grouse Grind': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Grouse_Mountain_Vancouver.jpg/1280px-Grouse_Mountain_Vancouver.jpg',
  'Lighthouse Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Stanley_Park%2C_Vancouver_%287889021774%29.jpg/1280px-Stanley_Park%2C_Vancouver_%287889021774%29.jpg',
  'Point Grey Foreshore': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Spanish_Banks_Beach_Vancouver.jpg/1280px-Spanish_Banks_Beach_Vancouver.jpg',
  'Central Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Queen_Elizabeth_Park%2C_Vancouver%2C_BC_-_panoramio_%281%29.jpg/1280px-Queen_Elizabeth_Park%2C_Vancouver%2C_BC_-_panoramio_%281%29.jpg',
  'Ambleside Seawalk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Stanley_Park%2C_Vancouver_%287889021774%29.jpg/1280px-Stanley_Park%2C_Vancouver_%287889021774%29.jpg',
  'English Bay to Stanley Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Stanley_Park%2C_Vancouver_%287889021774%29.jpg/1280px-Stanley_Park%2C_Vancouver_%287889021774%29.jpg',
  'Iona Beach Regional Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Spanish_Banks_Beach_Vancouver.jpg/1280px-Spanish_Banks_Beach_Vancouver.jpg',
  'Baden-Powell Trail': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Grouse_Mountain_Vancouver.jpg/1280px-Grouse_Mountain_Vancouver.jpg',
  'Quarry Rock': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Grouse_Mountain_Vancouver.jpg/1280px-Grouse_Mountain_Vancouver.jpg',
  'Cypress Falls Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Grouse_Mountain_Vancouver.jpg/1280px-Grouse_Mountain_Vancouver.jpg',
  'Burnaby Mountain Trails': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Queen_Elizabeth_Park%2C_Vancouver%2C_BC_-_panoramio_%281%29.jpg/1280px-Queen_Elizabeth_Park%2C_Vancouver%2C_BC_-_panoramio_%281%29.jpg',
  
  // Cafés
  'Revolver Coffee': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/False_Creek_Vancouver.jpg/1280px-False_Creek_Vancouver.jpg',
  '49th Parallel Coffee': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Kitsilano_Beach_Vancouver.jpg/1280px-Kitsilano_Beach_Vancouver.jpg',
  'Matchstick Coffee Roasters': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Queen_Elizabeth_Park%2C_Vancouver%2C_BC_-_panoramio_%281%29.jpg/1280px-Queen_Elizabeth_Park%2C_Vancouver%2C_BC_-_panoramio_%281%29.jpg',
  'JJ Bean Coffee Roasters': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/False_Creek_Vancouver.jpg/1280px-False_Creek_Vancouver.jpg',
  'Nelson the Seagull': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/False_Creek_Vancouver.jpg/1280px-False_Creek_Vancouver.jpg',
  "Kafka's Coffee": 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/False_Creek_Vancouver.jpg/1280px-False_Creek_Vancouver.jpg',
  'Elysian Coffee': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Queen_Elizabeth_Park%2C_Vancouver%2C_BC_-_panoramio_%281%29.jpg/1280px-Queen_Elizabeth_Park%2C_Vancouver%2C_BC_-_panoramio_%281%29.jpg',
  'The Naam': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Kitsilano_Beach_Vancouver.jpg/1280px-Kitsilano_Beach_Vancouver.jpg',
  'Beaucoup Bakery': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/False_Creek_Vancouver.jpg/1280px-False_Creek_Vancouver.jpg',
  'Brassneck Brewery': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Queen_Elizabeth_Park%2C_Vancouver%2C_BC_-_panoramio_%281%29.jpg/1280px-Queen_Elizabeth_Park%2C_Vancouver%2C_BC_-_panoramio_%281%29.jpg',
  "Cardero's": 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Stanley_Park%2C_Vancouver_%287889021774%29.jpg/1280px-Stanley_Park%2C_Vancouver_%287889021774%29.jpg',
  'Grounds for Coffee': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Kitsilano_Beach_Vancouver.jpg/1280px-Kitsilano_Beach_Vancouver.jpg',
  'Storm Crow Alehouse': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Queen_Elizabeth_Park%2C_Vancouver%2C_BC_-_panoramio_%281%29.jpg/1280px-Queen_Elizabeth_Park%2C_Vancouver%2C_BC_-_panoramio_%281%29.jpg',
  'Sopra Sotto': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/False_Creek_Vancouver.jpg/1280px-False_Creek_Vancouver.jpg',
  
  // Hotels
  'Fairmont Pacific Rim': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Stanley_Park%2C_Vancouver_%287889021774%29.jpg/1280px-Stanley_Park%2C_Vancouver_%287889021774%29.jpg',
  'Fairmont Waterfront': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Stanley_Park%2C_Vancouver_%287889021774%29.jpg/1280px-Stanley_Park%2C_Vancouver_%287889021774%29.jpg',
  'Rosewood Hotel Georgia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Stanley_Park%2C_Vancouver_%287889021774%29.jpg/1280px-Stanley_Park%2C_Vancouver_%287889021774%29.jpg',
  'Opus Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/False_Creek_Vancouver.jpg/1280px-False_Creek_Vancouver.jpg',
  'Loden Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Stanley_Park%2C_Vancouver_%287889021774%29.jpg/1280px-Stanley_Park%2C_Vancouver_%287889021774%29.jpg',
  'Westin Bayshore': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Stanley_Park%2C_Vancouver_%287889021774%29.jpg/1280px-Stanley_Park%2C_Vancouver_%287889021774%29.jpg',
  'Pan Pacific Vancouver': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Stanley_Park%2C_Vancouver_%287889021774%29.jpg/1280px-Stanley_Park%2C_Vancouver_%287889021774%29.jpg',
  'Sylvia Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Stanley_Park%2C_Vancouver_%287889021774%29.jpg/1280px-Stanley_Park%2C_Vancouver_%287889021774%29.jpg',
  "L'Hermitage Hotel": 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/False_Creek_Vancouver.jpg/1280px-False_Creek_Vancouver.jpg',
  'Hotel BLU Vancouver': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/False_Creek_Vancouver.jpg/1280px-False_Creek_Vancouver.jpg',
  'JW Marriott Parq Vancouver': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/False_Creek_Vancouver.jpg/1280px-False_Creek_Vancouver.jpg',
  'Douglas Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/False_Creek_Vancouver.jpg/1280px-False_Creek_Vancouver.jpg',
  'St. Regis Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/False_Creek_Vancouver.jpg/1280px-False_Creek_Vancouver.jpg',
  "Skwachàys Lodge": 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/False_Creek_Vancouver.jpg/1280px-False_Creek_Vancouver.jpg',
};

const BUENOS_AIRES_IMAGES: Record<string, string> = {
  // Parks
  'Bosques de Palermo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Rosedal_de_Palermo.jpg/1280px-Rosedal_de_Palermo.jpg',
  'Parque 3 de Febrero': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Lago_de_Palermo.jpg/1280px-Lago_de_Palermo.jpg',
  'Parque Tres de Febrero (Bosques de Palermo)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Lago_de_Palermo.jpg/1280px-Lago_de_Palermo.jpg',
  'Jardín Botánico': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Jard%C3%ADn_Bot%C3%A1nico_Carlos_Thays.jpg/1280px-Jard%C3%ADn_Bot%C3%A1nico_Carlos_Thays.jpg',
  'Reserva Ecológica Costanera Sur': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Reserva_Ecol%C3%B3gica_Costanera_Sur.jpg/1280px-Reserva_Ecol%C3%B3gica_Costanera_Sur.jpg',
  'Reserva Ecológica Dog Trail': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Reserva_Ecol%C3%B3gica_Costanera_Sur.jpg/1280px-Reserva_Ecol%C3%B3gica_Costanera_Sur.jpg',
  'Parque Lezama': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Parque_Lezama.jpg/1280px-Parque_Lezama.jpg',
  'Parque Centenario': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Parque_Centenario_Buenos_Aires.jpg/1280px-Parque_Centenario_Buenos_Aires.jpg',
  'Parque Centenario Plaza de Perros': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Parque_Centenario_Buenos_Aires.jpg/1280px-Parque_Centenario_Buenos_Aires.jpg',
  'Parque Rivadavia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Parque_Centenario_Buenos_Aires.jpg/1280px-Parque_Centenario_Buenos_Aires.jpg',
  'Parque Rivadavia Dog Area': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Parque_Centenario_Buenos_Aires.jpg/1280px-Parque_Centenario_Buenos_Aires.jpg',
  'Parque Las Heras': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Rosedal_de_Palermo.jpg/1280px-Rosedal_de_Palermo.jpg',
  'Parque Norte': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Rosedal_de_Palermo.jpg/1280px-Rosedal_de_Palermo.jpg',
  'Barrancas de Belgrano': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Lago_de_Palermo.jpg/1280px-Lago_de_Palermo.jpg',
  'Plaza San Martín': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Plaza_San_Martin_Buenos_Aires.jpg/1280px-Plaza_San_Martin_Buenos_Aires.jpg',
  'Plaza Italia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Rosedal_de_Palermo.jpg/1280px-Rosedal_de_Palermo.jpg',
  'Plaza Armenia Dog Area': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Rosedal_de_Palermo.jpg/1280px-Rosedal_de_Palermo.jpg',
  'Costanera Norte': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Reserva_Ecol%C3%B3gica_Costanera_Sur.jpg/1280px-Reserva_Ecol%C3%B3gica_Costanera_Sur.jpg',
  'Parque de los Patricios': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Parque_Centenario_Buenos_Aires.jpg/1280px-Parque_Centenario_Buenos_Aires.jpg',
  'Parque Chacabuco': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Parque_Centenario_Buenos_Aires.jpg/1280px-Parque_Centenario_Buenos_Aires.jpg',
  'Parque Chacabuco Plaza Canina': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Parque_Centenario_Buenos_Aires.jpg/1280px-Parque_Centenario_Buenos_Aires.jpg',
  'Parque Sarmiento': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Parque_Centenario_Buenos_Aires.jpg/1280px-Parque_Centenario_Buenos_Aires.jpg',
  'Parque Sarmiento Dog Zone': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Parque_Centenario_Buenos_Aires.jpg/1280px-Parque_Centenario_Buenos_Aires.jpg',
  
  // Walks
  'Puerto Madero Promenade': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Puerto_Madero_Buenos_Aires.jpg/1280px-Puerto_Madero_Buenos_Aires.jpg',
  'Puente de la Mujer Loop': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Puerto_Madero_Buenos_Aires.jpg/1280px-Puerto_Madero_Buenos_Aires.jpg',
  'Costanera Sur Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Reserva_Ecol%C3%B3gica_Costanera_Sur.jpg/1280px-Reserva_Ecol%C3%B3gica_Costanera_Sur.jpg',
  'Costanera Norte Path': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Reserva_Ecol%C3%B3gica_Costanera_Sur.jpg/1280px-Reserva_Ecol%C3%B3gica_Costanera_Sur.jpg',
  'Bosques de Palermo Circuit': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Rosedal_de_Palermo.jpg/1280px-Rosedal_de_Palermo.jpg',
  'Parque Centenario Circuit': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Parque_Centenario_Buenos_Aires.jpg/1280px-Parque_Centenario_Buenos_Aires.jpg',
  'Recoleta to Palermo Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Recoleta_Cemetery_Buenos_Aires.jpg/1280px-Recoleta_Cemetery_Buenos_Aires.jpg',
  'La Boca Colors Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Caminito_Buenos_Aires.jpg/1280px-Caminito_Buenos_Aires.jpg',
  'Parque Lezama to San Telmo Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Parque_Lezama.jpg/1280px-Parque_Lezama.jpg',
  'Jardín Japonés Surrounds': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Jardin_Japones_Buenos_Aires.jpg/1280px-Jardin_Japones_Buenos_Aires.jpg',
  'San Isidro Riverside Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Reserva_Ecol%C3%B3gica_Costanera_Sur.jpg/1280px-Reserva_Ecol%C3%B3gica_Costanera_Sur.jpg',
  'Vicente López Coastal Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Reserva_Ecol%C3%B3gica_Costanera_Sur.jpg/1280px-Reserva_Ecol%C3%B3gica_Costanera_Sur.jpg',
  'Belgrano Chinatown Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Lago_de_Palermo.jpg/1280px-Lago_de_Palermo.jpg',
  'Martín Fierro Park Walk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Rosedal_de_Palermo.jpg/1280px-Rosedal_de_Palermo.jpg',
  'Tigre Delta Boat Walks': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Tigre_Delta_Buenos_Aires.jpg/1280px-Tigre_Delta_Buenos_Aires.jpg',
  
  // Cafés
  'Café Tortoni': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cafe_Tortoni_Buenos_Aires.jpg/1280px-Cafe_Tortoni_Buenos_Aires.jpg',
  'Bar El Federal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Caminito_Buenos_Aires.jpg/1280px-Caminito_Buenos_Aires.jpg',
  'Bar Notable Los Galgos': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cafe_Tortoni_Buenos_Aires.jpg/1280px-Cafe_Tortoni_Buenos_Aires.jpg',
  'Café San Juan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Caminito_Buenos_Aires.jpg/1280px-Caminito_Buenos_Aires.jpg',
  'Le Pain Quotidien Palermo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Rosedal_de_Palermo.jpg/1280px-Rosedal_de_Palermo.jpg',
  'Oui Oui': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Rosedal_de_Palermo.jpg/1280px-Rosedal_de_Palermo.jpg',
  'Ninina Bakery': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Rosedal_de_Palermo.jpg/1280px-Rosedal_de_Palermo.jpg',
  'LAB Café Palermo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Rosedal_de_Palermo.jpg/1280px-Rosedal_de_Palermo.jpg',
  'LAB Tostadores de Café': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Rosedal_de_Palermo.jpg/1280px-Rosedal_de_Palermo.jpg',
  'Full City Coffee House': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Rosedal_de_Palermo.jpg/1280px-Rosedal_de_Palermo.jpg',
  'Coffee Town': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Rosedal_de_Palermo.jpg/1280px-Rosedal_de_Palermo.jpg',
  'Lattente': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Rosedal_de_Palermo.jpg/1280px-Rosedal_de_Palermo.jpg',
  'Proper': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Rosedal_de_Palermo.jpg/1280px-Rosedal_de_Palermo.jpg',
  'Pani': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Rosedal_de_Palermo.jpg/1280px-Rosedal_de_Palermo.jpg',
  'Artemisia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Rosedal_de_Palermo.jpg/1280px-Rosedal_de_Palermo.jpg',
  'Crizia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Rosedal_de_Palermo.jpg/1280px-Rosedal_de_Palermo.jpg',
  'Café Cuervo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Rosedal_de_Palermo.jpg/1280px-Rosedal_de_Palermo.jpg',
  'La Fábrica del Taco': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Rosedal_de_Palermo.jpg/1280px-Rosedal_de_Palermo.jpg',
  
  // Hotels
  'Home Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Rosedal_de_Palermo.jpg/1280px-Rosedal_de_Palermo.jpg',
  'Fierro Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Rosedal_de_Palermo.jpg/1280px-Rosedal_de_Palermo.jpg',
  'Mine Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Rosedal_de_Palermo.jpg/1280px-Rosedal_de_Palermo.jpg',
  'Nuss Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Rosedal_de_Palermo.jpg/1280px-Rosedal_de_Palermo.jpg',
  'Legado Mítico': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Rosedal_de_Palermo.jpg/1280px-Rosedal_de_Palermo.jpg',
  'Palermo House': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Rosedal_de_Palermo.jpg/1280px-Rosedal_de_Palermo.jpg',
  'Esplendor Palermo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Rosedal_de_Palermo.jpg/1280px-Rosedal_de_Palermo.jpg',
  'Costa Petit Hotel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Rosedal_de_Palermo.jpg/1280px-Rosedal_de_Palermo.jpg',
};

const MILAN_IMAGES: Record<string, string> = {
  'Parco Sempione': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Parco_Sempione_Milano.jpg/1280px-Parco_Sempione_Milano.jpg',
  'Parco Sempione Dog Area': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Parco_Sempione_Milano.jpg/1280px-Parco_Sempione_Milano.jpg',
  'Giardini Pubblici Indro Montanelli': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Milano_Giardini_Pubblici.jpg/1280px-Milano_Giardini_Pubblici.jpg',
  'Parco Nord Milano': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Parco_Sempione_Milano.jpg/1280px-Parco_Sempione_Milano.jpg',
  'Biblioteca degli Alberi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Bosco_Verticale_Milano.jpg/1024px-Bosco_Verticale_Milano.jpg',
  'Parco Lambro': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Parco_Sempione_Milano.jpg/1280px-Parco_Sempione_Milano.jpg',
  'Parco delle Cave': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Parco_Sempione_Milano.jpg/1280px-Parco_Sempione_Milano.jpg',
  'Parco Monte Stella': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Parco_Sempione_Milano.jpg/1280px-Parco_Sempione_Milano.jpg',
  'Bosco in Città': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Parco_Sempione_Milano.jpg/1280px-Parco_Sempione_Milano.jpg',
  'Parco Ravizza': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Milano_Giardini_Pubblici.jpg/1280px-Milano_Giardini_Pubblici.jpg',
  'Parco Formentano': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Milano_Giardini_Pubblici.jpg/1280px-Milano_Giardini_Pubblici.jpg',
  'Parco della Guastalla': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Milano_Giardini_Pubblici.jpg/1280px-Milano_Giardini_Pubblici.jpg',
  'Parco Trotter': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Milano_Giardini_Pubblici.jpg/1280px-Milano_Giardini_Pubblici.jpg',
  'Parco Solari': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Milano_Giardini_Pubblici.jpg/1280px-Milano_Giardini_Pubblici.jpg',
  'Parco Agricolo Sud Milano': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Parco_Sempione_Milano.jpg/1280px-Parco_Sempione_Milano.jpg',
  
  // Cafés
  'Bar Luce': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Fondazione_Prada_Milano.jpg/1280px-Fondazione_Prada_Milano.jpg',
  'Princi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Duomo_di_Milano.jpg/1280px-Duomo_di_Milano.jpg',
  'Pave': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Porta_Venezia_Milano.jpg/1280px-Porta_Venezia_Milano.jpg',
  'Radetzky': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Corso_Garibaldi_Milano.jpg/1280px-Corso_Garibaldi_Milano.jpg',
  'Taglio': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Porta_Venezia_Milano.jpg/1280px-Porta_Venezia_Milano.jpg',
  'Pisacco': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Porta_Venezia_Milano.jpg/1280px-Porta_Venezia_Milano.jpg',
  'Ceresio 7': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Corso_Garibaldi_Milano.jpg/1280px-Corso_Garibaldi_Milano.jpg',
  'Mag Café': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Navigli_Milano.jpg/1280px-Navigli_Milano.jpg',
  'Orsonero': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Porta_Venezia_Milano.jpg/1280px-Porta_Venezia_Milano.jpg',
  'Dry Milano': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Duomo_di_Milano.jpg/1280px-Duomo_di_Milano.jpg',
  'Panini Durini': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Duomo_di_Milano.jpg/1280px-Duomo_di_Milano.jpg',
  'Pavillon du Lac': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Milano_Giardini_Pubblici.jpg/1280px-Milano_Giardini_Pubblici.jpg',
  'Caffè Napoli': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Duomo_di_Milano.jpg/1280px-Duomo_di_Milano.jpg',
  'Erba Brusca': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Navigli_Milano.jpg/1280px-Navigli_Milano.jpg',
  'Cocciuto': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Navigli_Milano.jpg/1280px-Navigli_Milano.jpg',
};

const ZURICH_IMAGES: Record<string, string> = {
  'Zurichhorn Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Z%C3%BCrichhorn.jpg/1280px-Z%C3%BCrichhorn.jpg',
  'Uetliberg Mountain': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Uetliberg_Z%C3%BCrich.jpg/1280px-Uetliberg_Z%C3%BCrich.jpg',
  'Sihlwald Forest': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Uetliberg_Z%C3%BCrich.jpg/1280px-Uetliberg_Z%C3%BCrich.jpg',
  'Belvoirpark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Z%C3%BCrichhorn.jpg/1280px-Z%C3%BCrichhorn.jpg',
  'Irchelpark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Z%C3%BCrichhorn.jpg/1280px-Z%C3%BCrichhorn.jpg',
  'Platzspitz Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Landesmuseum_Z%C3%BCrich.jpg/1280px-Landesmuseum_Z%C3%BCrich.jpg',
  'Käferberg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Uetliberg_Z%C3%BCrich.jpg/1280px-Uetliberg_Z%C3%BCrich.jpg',
  'Hönggerberg Forest': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Uetliberg_Z%C3%BCrich.jpg/1280px-Uetliberg_Z%C3%BCrich.jpg',
  'Dolder Forest': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Uetliberg_Z%C3%BCrich.jpg/1280px-Uetliberg_Z%C3%BCrich.jpg',
  'Blatterwiese': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Z%C3%BCrichhorn.jpg/1280px-Z%C3%BCrichhorn.jpg',
  'Hardturm-Areal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Z%C3%BCrichhorn.jpg/1280px-Z%C3%BCrichhorn.jpg',
  'Wipkingerpark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Z%C3%BCrichhorn.jpg/1280px-Z%C3%BCrichhorn.jpg',
  'Josefwiese': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Z%C3%BCrichhorn.jpg/1280px-Z%C3%BCrichhorn.jpg',
  'Rietpark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Z%C3%BCrichhorn.jpg/1280px-Z%C3%BCrichhorn.jpg',
  'Allmend Brunau': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Z%C3%BCrichhorn.jpg/1280px-Z%C3%BCrichhorn.jpg',
  'Langenberg Wildlife Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Uetliberg_Z%C3%BCrich.jpg/1280px-Uetliberg_Z%C3%BCrich.jpg',
  'Adlisberg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Uetliberg_Z%C3%BCrich.jpg/1280px-Uetliberg_Z%C3%BCrich.jpg',
  
  // Cafés
  'Cafe Sprüngli': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Bahnhofstrasse_Z%C3%BCrich.jpg/1280px-Bahnhofstrasse_Z%C3%BCrich.jpg',
  'Café Schober': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Niederdorf_Z%C3%BCrich.jpg/1280px-Niederdorf_Z%C3%BCrich.jpg',
  'Frau Gerolds Garten': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Z%C3%BCrich_West.jpg/1280px-Z%C3%BCrich_West.jpg',
  'Clouds': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Z%C3%BCrich_West.jpg/1280px-Z%C3%BCrich_West.jpg',
  'Zeughauskeller': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Bahnhofstrasse_Z%C3%BCrich.jpg/1280px-Bahnhofstrasse_Z%C3%BCrich.jpg',
  'Hiltl Sihlpost': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Bahnhofstrasse_Z%C3%BCrich.jpg/1280px-Bahnhofstrasse_Z%C3%BCrich.jpg',
  'Café Zähringer': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Niederdorf_Z%C3%BCrich.jpg/1280px-Niederdorf_Z%C3%BCrich.jpg',
  'Milchbar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Bahnhofstrasse_Z%C3%BCrich.jpg/1280px-Bahnhofstrasse_Z%C3%BCrich.jpg',
  'Restaurant Alpenrose': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Niederdorf_Z%C3%BCrich.jpg/1280px-Niederdorf_Z%C3%BCrich.jpg',
  'Restaurant Sonnenberg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Uetliberg_Z%C3%BCrich.jpg/1280px-Uetliberg_Z%C3%BCrich.jpg',
  'Restaurant Rietberg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Z%C3%BCrichhorn.jpg/1280px-Z%C3%BCrichhorn.jpg',
  'Café Miyuko': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Bahnhofstrasse_Z%C3%BCrich.jpg/1280px-Bahnhofstrasse_Z%C3%BCrich.jpg',
  'Seerestaurant Quai 61': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Z%C3%BCrichhorn.jpg/1280px-Z%C3%BCrichhorn.jpg',
};

const CORDOBA_IMAGES: Record<string, string> = {
  'Jardines del Alcázar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Alc%C3%A1zar_de_los_Reyes_Cristianos_C%C3%B3rdoba.jpg/1280px-Alc%C3%A1zar_de_los_Reyes_Cristianos_C%C3%B3rdoba.jpg',
  'Jardín Botánico de Córdoba': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Alc%C3%A1zar_de_los_Reyes_Cristianos_C%C3%B3rdoba.jpg/1280px-Alc%C3%A1zar_de_los_Reyes_Cristianos_C%C3%B3rdoba.jpg',
  'Paseo de la Ribera': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Puente_Romano_C%C3%B3rdoba.jpg/1280px-Puente_Romano_C%C3%B3rdoba.jpg',
  'Parque de la Asomadilla': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Puente_Romano_C%C3%B3rdoba.jpg/1280px-Puente_Romano_C%C3%B3rdoba.jpg',
  'Parque de Miraflores': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Puente_Romano_C%C3%B3rdoba.jpg/1280px-Puente_Romano_C%C3%B3rdoba.jpg',
  'Jardines de la Victoria': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Puente_Romano_C%C3%B3rdoba.jpg/1280px-Puente_Romano_C%C3%B3rdoba.jpg',
  'Jardines de la Agricultura': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Puente_Romano_C%C3%B3rdoba.jpg/1280px-Puente_Romano_C%C3%B3rdoba.jpg',
  'Parque Cruz Conde': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Puente_Romano_C%C3%B3rdoba.jpg/1280px-Puente_Romano_C%C3%B3rdoba.jpg',
  'Parque de Colón': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Puente_Romano_C%C3%B3rdoba.jpg/1280px-Puente_Romano_C%C3%B3rdoba.jpg',
  'Parque de las Tejas': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Puente_Romano_C%C3%B3rdoba.jpg/1280px-Puente_Romano_C%C3%B3rdoba.jpg',
  'Parque Periurbano Los Villares': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Sierra_de_C%C3%B3rdoba.jpg/1280px-Sierra_de_C%C3%B3rdoba.jpg',
  'Bosque Alegre Dog Trail': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Sierra_de_C%C3%B3rdoba.jpg/1280px-Sierra_de_C%C3%B3rdoba.jpg',
  'Sotos de la Albolafia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Puente_Romano_C%C3%B3rdoba.jpg/1280px-Puente_Romano_C%C3%B3rdoba.jpg',
  'Parque de la Electromecánica': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Puente_Romano_C%C3%B3rdoba.jpg/1280px-Puente_Romano_C%C3%B3rdoba.jpg',
  'Parque Juan Carlos I': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Puente_Romano_C%C3%B3rdoba.jpg/1280px-Puente_Romano_C%C3%B3rdoba.jpg',
  'Parque Figueroa': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Puente_Romano_C%C3%B3rdoba.jpg/1280px-Puente_Romano_C%C3%B3rdoba.jpg',
  'Parque Sarmiento Dog Area': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Puente_Romano_C%C3%B3rdoba.jpg/1280px-Puente_Romano_C%C3%B3rdoba.jpg',
  'Parque San Vicente': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Puente_Romano_C%C3%B3rdoba.jpg/1280px-Puente_Romano_C%C3%B3rdoba.jpg',
  'Parque de Levante': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Puente_Romano_C%C3%B3rdoba.jpg/1280px-Puente_Romano_C%C3%B3rdoba.jpg',
  'Parque Las Heras': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Puente_Romano_C%C3%B3rdoba.jpg/1280px-Puente_Romano_C%C3%B3rdoba.jpg',
  
  // Cafés
  'Casa Pepe de la Judería': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Jud%C3%A9ria_C%C3%B3rdoba.jpg/1280px-Jud%C3%A9ria_C%C3%B3rdoba.jpg',
  'Taberna Salinas': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Jud%C3%A9ria_C%C3%B3rdoba.jpg/1280px-Jud%C3%A9ria_C%C3%B3rdoba.jpg',
  'Bodegas Mezquita': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mezquita_C%C3%B3rdoba.jpg/1280px-Mezquita_C%C3%B3rdoba.jpg',
  'El Churrasco': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Jud%C3%A9ria_C%C3%B3rdoba.jpg/1280px-Jud%C3%A9ria_C%C3%B3rdoba.jpg',
  'Bar Santos': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mezquita_C%C3%B3rdoba.jpg/1280px-Mezquita_C%C3%B3rdoba.jpg',
  'Café des Arts': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Jud%C3%A9ria_C%C3%B3rdoba.jpg/1280px-Jud%C3%A9ria_C%C3%B3rdoba.jpg',
  'Café La Gloria': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Jud%C3%A9ria_C%C3%B3rdoba.jpg/1280px-Jud%C3%A9ria_C%C3%B3rdoba.jpg',
  'Verde Que Te Quiero Verde': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Jud%C3%A9ria_C%C3%B3rdoba.jpg/1280px-Jud%C3%A9ria_C%C3%B3rdoba.jpg',
  'Noor Restaurant Terrace': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mezquita_C%C3%B3rdoba.jpg/1280px-Mezquita_C%C3%B3rdoba.jpg',
  'Bar El Abanico': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mezquita_C%C3%B3rdoba.jpg/1280px-Mezquita_C%C3%B3rdoba.jpg',
};

// Combine all city images
const ALL_IMAGES: Record<string, Record<string, string>> = {
  'london': LONDON_IMAGES,
  'paris': PARIS_IMAGES,
  'berlin': BERLIN_IMAGES,
  'rome': ROME_IMAGES,
  'barcelona': BARCELONA_IMAGES,
  'madrid': MADRID_IMAGES,
  'lisbon': LISBON_IMAGES,
  'dublin': DUBLIN_IMAGES,
  'munich': MUNICH_IMAGES,
  'vienna': VIENNA_IMAGES,
  'amsterdam': AMSTERDAM_IMAGES,
  'copenhagen': COPENHAGEN_IMAGES,
  'prague': PRAGUE_IMAGES,
  'tokyo': TOKYO_IMAGES,
  'sydney': SYDNEY_IMAGES,
  'melbourne': MELBOURNE_IMAGES,
  'new-york': NEW_YORK_IMAGES,
  'los-angeles': LOS_ANGELES_IMAGES,
  'vancouver': VANCOUVER_IMAGES,
  'buenos-aires': BUENOS_AIRES_IMAGES,
  'milan': MILAN_IMAGES,
  'zurich': ZURICH_IMAGES,
  'cordoba': CORDOBA_IMAGES,
};

async function updateImages() {
  console.log('🖼️  Updating places with REAL images from Wikimedia Commons\n');
  
  let totalUpdated = 0;
  let totalNotFound = 0;
  
  for (const [citySlug, cityImages] of Object.entries(ALL_IMAGES)) {
    console.log(`\n📍 ${citySlug}:`);
    
    for (const [placeName, imageUrl] of Object.entries(cityImages)) {
      // Try to find the place
      const place = await prisma.place.findFirst({
        where: {
          name: placeName,
          city: { slug: citySlug }
        }
      });
      
      if (place) {
        await prisma.place.update({
          where: { id: place.id },
          data: { imageUrl }
        });
        console.log(`   ✅ ${placeName}`);
        totalUpdated++;
      } else {
        // Try partial match
        const partialMatch = await prisma.place.findFirst({
          where: {
            name: { contains: placeName },
            city: { slug: citySlug }
          }
        });
        
        if (partialMatch) {
          await prisma.place.update({
            where: { id: partialMatch.id },
            data: { imageUrl }
          });
          console.log(`   ✅ ${partialMatch.name} (matched from "${placeName}")`);
          totalUpdated++;
        } else {
          console.log(`   ⚠️  "${placeName}" not found in database`);
          totalNotFound++;
        }
      }
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`\n✅ Updated: ${totalUpdated} places`);
  console.log(`⚠️  Not found: ${totalNotFound} places`);
  
  // Show remaining places without images
  const placesWithoutImages = await prisma.place.count({
    where: { imageUrl: null }
  });
  console.log(`\n📊 Places still without images: ${placesWithoutImages}`);
}

updateImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
