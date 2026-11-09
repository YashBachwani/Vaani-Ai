import { connectDatabase, disconnectDatabase } from './config/database';
import { KnowledgeEntry } from './models/KnowledgeEntry';

const seedKnowledge = [
  // 1. General & Technology
  {
    title: 'What is Artificial Intelligence?',
    content: 'Artificial Intelligence (AI) is the simulation of human intelligence processes by computer systems. These processes include learning, reasoning, problem-solving, perception, and language understanding.',
    language: 'en',
    category: 'technology',
    keywords: ['ai', 'artificial', 'intelligence', 'machine', 'learning', 'technology'],
    synonyms: ['kratrim', 'buddhi', 'computing', 'neural'],
    source: 'VAANI Curated Knowledge'
  },
  {
    title: 'आर्टिफिशियल इंटेलिजेंस क्या है?',
    content: 'आर्टिफिशियल इंटेलिजेंस (AI) या कृत्रिम बुद्धिमत्ता कंप्यूटर विज्ञान की एक शाखा है जो ऐसी मशीनें विकसित करती है जो मानव मस्तिष्क की तरह सोचने, सीखने, समस्या समाधान और निर्णय लेने में सक्षम होती हैं।',
    language: 'hi',
    category: 'technology',
    keywords: ['ai', 'आर्टिफिशियल', 'इंटेलिजेंस', 'कृत्रिम', 'बुद्धिमत्ता', 'कंप्यूटर'],
    synonyms: ['मशीन', 'लर्निंग', 'तकनीक'],
    source: 'वाणी ज्ञानकोश'
  },
  {
    title: 'આર્ટિફિશિયલ ઇન્ટેલિજન્સ શું છે?',
    content: 'આર્ટિફિશિયલ ઇન્ટેલિજન્સ (AI) એટલે કૃત્રિમ બુદ્ધિ. તે કમ્પ્યુટર વિજ્ઞાનની એવી શાખા છે જે માનવની જેમ વિચારવા, શીખવા અને નિર્ણયો લેવા સક્ષમ પ્રણાલીઓ વિકસાવે છે.',
    language: 'gu',
    category: 'technology',
    keywords: ['ai', 'આર્ટિફિશિયલ', 'ઇન્ટેલિજન્સ', 'કૃત્રિમ', 'બુદ્ધિ', 'કમ્પ્યુટર'],
    synonyms: ['ટેકનોલોજી', 'મશીન'],
    source: 'વાણી જ્ઞાનકોશ'
  },

  // 2. India & Culture
  {
    title: 'Capital of India',
    content: 'The capital of India is New Delhi. It is the seat of all three branches of the Government of India: Executive, Legislative, and Judiciary.',
    language: 'en',
    category: 'india',
    keywords: ['capital', 'india', 'delhi', 'new delhi', 'bharat'],
    synonyms: ['rajdhani', 'desh'],
    source: 'Official National Portal of India'
  },
  {
    title: 'भारत की राजधानी',
    content: 'भारत की राजधानी नई दिल्ली है। यहाँ भारत सरकार के तीनों अंग — कार्यपालिका, विधायिका और न्यायपालिका — स्थित हैं।',
    language: 'hi',
    category: 'india',
    keywords: ['भारत', 'राजधानी', 'नई', 'दिल्ली', 'देश'],
    synonyms: ['rajdhani', 'delhi', 'bharat'],
    source: 'भारत सरकार आधिकारिक पोर्टल'
  },
  {
    title: 'ભારતની રાજધાની',
    content: 'ભારતની રાજધાની નવી દિલ્હી છે. ત્યાં ભારત સરકારના કાર્યપાલિકા, સંસદ અને ન્યાયપાલિકાના મુખ્યાલયો આવેલા છે.',
    language: 'gu',
    category: 'india',
    keywords: ['ભારત', 'રાજધાની', 'નવી', 'દિલ્હી'],
    synonyms: ['rajdhani', 'delhi', 'bharat'],
    source: 'ભારત પોર્ટલ'
  },

  // 3. Science: Photosynthesis
  {
    title: 'What is Photosynthesis?',
    content: 'Photosynthesis is the biological process used by plants, algae, and certain bacteria to convert light energy into chemical energy, creating glucose and releasing oxygen using carbon dioxide and water.',
    language: 'en',
    category: 'science',
    keywords: ['photosynthesis', 'plants', 'sunlight', 'oxygen', 'chlorophyll'],
    synonyms: ['prakash sanshleshan', 'biology', 'green'],
    source: 'Scientific Encyclopedia'
  },
  {
    title: 'प्रकाश संश्लेषण क्या है?',
    content: 'प्रकाश संश्लेषण वह जैव-रासायनिक प्रक्रिया है जिसके द्वारा हरे पौधे सूर्य के प्रकाश, क्लोरोफिल, जल और कार्बन डाइऑक्साइड का उपयोग करके अपना भोजन (ग्लूकोज) बनाते हैं और ऑक्सीजन छोड़ते हैं।',
    language: 'hi',
    category: 'science',
    keywords: ['प्रकाश', 'संश्लेषण', 'पौधे', 'क्लोरोफिल', 'ऑक्सीजन', 'सूर्य'],
    synonyms: ['photosynthesis', 'khorak', 'science'],
    source: 'विज्ञान संदर्भ'
  },

  // 4. Grammar & Languages
  {
    title: 'How to practice English speaking?',
    content: 'To improve spoken English: 1) Speak daily aloud for 15 minutes, 2) Focus on clear sentence structures rather than complex vocabulary, 3) Practice common dialogue scenarios like ordering food or job interviews, 4) Listen and shadow native or clear Indian English speakers.',
    language: 'en',
    category: 'language',
    keywords: ['practice', 'english', 'speaking', 'fluency', 'improve', 'learn'],
    synonyms: ['talk', 'conversation', 'accent'],
    source: 'VAANI Language Learning Principles'
  },
  {
    title: 'अंग्रेजी बोलना कैसे सीखें?',
    content: 'अंग्रेजी बोलने में सुधार के लिए: १) प्रतिदिन १५ मिनट जोर से बोलें, २) व्याकरण के बुनियादी नियमों (जैसे Tenses) का अभ्यास करें, ३) दैनिक बातचीत के परिदृश्य (होटल, साक्षात्कार) का अभ्यास करें, ४) गलतियों से डरे बिना आत्मविश्वास से बोलें।',
    language: 'hi',
    category: 'language',
    keywords: ['अंग्रेजी', 'बोलना', 'सीखें', 'अभ्यास', 'व्याकरण'],
    synonyms: ['english', 'speaking', 'bolna'],
    source: 'वाणी भाषा शिक्षण'
  },

  // 5. Taj Mahal
  {
    title: 'About the Taj Mahal',
    content: 'The Taj Mahal is an ivory-white marble mausoleum on the south bank of the Yamuna river in Agra, India. It was commissioned in 1631 by Mughal Emperor Shah Jahan to house the tomb of his favorite wife, Mumtaz Mahal. It is recognized as a UNESCO World Heritage Site.',
    language: 'en',
    category: 'india',
    keywords: ['taj', 'mahal', 'agra', 'shah jahan', 'monument', 'wonder'],
    synonyms: ['tajmahal', 'mumtaz'],
    source: 'Archaeological Survey of India'
  },
  {
    title: 'ताजमहल के बारे में',
    content: 'ताजमहल भारत के आगरा शहर में यमुना नदी के तट पर स्थित एक विश्व प्रसिद्ध सफेद संगमरमर का मकबरा है। इसे मुग़ल बादशाह शाहजहाँ ने अपनी बेगम मुमताज़ महल की याद में बनवाया था। यह यूनेस्को विश्व धरोहर स्थल है।',
    language: 'hi',
    category: 'india',
    keywords: ['ताजमहल', 'आगरा', 'शाहजहाँ', 'मुमताज', 'यमुना'],
    synonyms: ['taj', 'mahal', 'agra'],
    source: 'भारतीय पुरातत्व सर्वेक्षण'
  }
];

export async function seedDatabase() {
  try {
    await connectDatabase();
    console.log('[Seed] Seeding curated knowledge entries...');

    try {
      await KnowledgeEntry.collection.dropIndexes();
    } catch {}

    for (const entry of seedKnowledge) {
      await KnowledgeEntry.findOneAndUpdate(
        { title: entry.title },
        { ...entry, updatedAt: new Date() },
        { upsert: true }
      );
    }

    console.log(`[Seed] Successfully seeded ${seedKnowledge.length} knowledge entries.`);
  } catch (err: any) {
    console.error('[Seed Error]', err.message);
  } finally {
    await disconnectDatabase();
  }
}

if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}
