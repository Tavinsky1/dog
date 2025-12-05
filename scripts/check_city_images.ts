
import axios from 'axios';

const cityImages = {
  'london': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/London_Skyline_%28125508655%29.jpeg/1280px-London_Skyline_%28125508655%29.jpeg',
  'paris': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg/1280px-La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg',
  'berlin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Museumsinsel_Berlin_Juli_2021_1_%28cropped%29_b.jpg/1280px-Museumsinsel_Berlin_Juli_2021_1_%28cropped%29_b.jpg',
  'rome': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Trevi_Fountain%2C_Rome%2C_Italy_2_-_May_2007.jpg/1280px-Trevi_Fountain%2C_Rome%2C_Italy_2_-_May_2007.jpg',
  'barcelona': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Aerial_view_of_Barcelona%2C_Spain_%2851227309370%29_edited.jpg/1280px-Aerial_view_of_Barcelona%2C_Spain_%2851227309370%29_edited.jpg',
  'madrid': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Madrid_-_Sky_Bar_360%C2%BA_%28Hotel_Riu_Plaza_Espa%C3%B1a%29%2C_vistas_19.jpg/1280px-Madrid_-_Sky_Bar_360%C2%BA_%28Hotel_Riu_Plaza_Espa%C3%B1a%29%2C_vistas_19.jpg',
  'lisbon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Lisboa_-_Portugal_%2852597836992%29.jpg/1280px-Lisboa_-_Portugal_%2852597836992%29.jpg',
  'dublin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Dublin_-_aerial_-_2025-07-07_01.jpg/1280px-Dublin_-_aerial_-_2025-07-07_01.jpg',
  'munich': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg',
  'vienna': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Schoenbrunn_philharmoniker_2012.jpg/1280px-Schoenbrunn_philharmoniker_2012.jpg',
  'prague': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Prague_%286365119737%29.jpg/1280px-Prague_%286365119737%29.jpg',
  'copenhagen': 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Christiansborg_fra_Nikolaj_Kirken.jpg',
  'amsterdam': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Imagen_de_los_canales_conc%C3%A9ntricos_en_%C3%81msterdam.png/1280px-Imagen_de_los_canales_conc%C3%A9ntricos_en_%C3%81msterdam.png',
  'milan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Milan_skyline_skyscrapers_of_Porta_Nuova_business_district_%28cropped%29.jpg/1280px-Milan_skyline_skyscrapers_of_Porta_Nuova_business_district_%28cropped%29.jpg',
  'zurich': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Altstadt_Z%C3%BCrich_2015.jpg/1280px-Altstadt_Z%C3%BCrich_2015.jpg',
  'new-york': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/1280px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg',
  'los-angeles': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Hollywood_Sign_%28Zuschnitt%29.jpg/1280px-Hollywood_Sign_%28Zuschnitt%29.jpg',
  'vancouver': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Concord_Pacific_Master_Plan_Area.jpg/1280px-Concord_Pacific_Master_Plan_Area.jpg',
  'sydney': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg/1280px-Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg',
  'melbourne': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Melburnian_Skyline_b.jpg/1280px-Melburnian_Skyline_b.jpg',
  'buenos-aires': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Puerto_Madero%2C_Buenos_Aires_%2840689219792%29_%28cropped%29.jpg/1280px-Puerto_Madero%2C_Buenos_Aires_%2840689219792%29_%28cropped%29.jpg',
  'cordoba': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/C%C3%B3rdoba_aerial_2.jpg/1280px-C%C3%B3rdoba_aerial_2.jpg',
  'tokyo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg/1280px-Skyscrapers_of_Shinjuku_2009_January.jpg',
};

async function checkUrls() {
  for (const [city, url] of Object.entries(cityImages)) {
    try {
      await axios.head(url, { timeout: 5000 });
      console.log(`✅ ${city}: OK`);
    } catch (error) {
      console.log(`❌ ${city}: FAILED - ${error.message}`);
    }
  }
}

checkUrls();
