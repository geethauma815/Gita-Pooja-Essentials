const { Ritual, Product } = require('../models');

// Rich default rituals for seeding
const defaultRituals = [
  {
    name: "Diwali Lakshmi Pooja",
    key: "diwali-lakshmi-pooja",
    category: "festival",
    description: "Diwali is the festival of lights, and performing Lakshmi Pooja on this auspicious night invokes prosperity, health, and wealth into the household.",
    significance: "Worshipping Goddess Lakshmi (wealth) and Lord Ganesha (auspicious beginnings) celebrates the victory of light over darkness and invokes blessings for the new financial year.",
    upcomingDate: "2026-11-08",
    timings: "Pradosh Kaal Muhurtham: 5:42 PM to 7:21 PM",
    baseBudget: 1500,
    checklist: [
      { name: "Clay Diyas (Pack of 11)", baseQuantity: "1 Pack", optional: false, estimatedPrice: 150, category: "Essential" },
      { name: "Kumkum & Haldi Set", baseQuantity: "1 Pack", optional: false, estimatedPrice: 40, category: "Essential" },
      { name: "Pooja Akshata (Sacred Rice)", baseQuantity: "100g", optional: false, estimatedPrice: 50, category: "Essential" },
      { name: "Ganga Jal (Sacred Water)", baseQuantity: "1 Bottle", optional: false, estimatedPrice: 60, category: "Essential" },
      { name: "Cotton Wicks (Round & Long)", baseQuantity: "1 Pack", optional: false, estimatedPrice: 30, category: "Essential" },
      { name: "Scented Agarbatti (Incense)", baseQuantity: "1 Box", optional: false, estimatedPrice: 80, category: "Essential" },
      { name: "Camphor (Karpur)", baseQuantity: "1 Pack", optional: false, estimatedPrice: 45, category: "Essential" },
      { name: "Fresh Marigold Garlands", baseQuantity: "2 Pcs", optional: false, estimatedPrice: 200, category: "Fresh Items" },
      { name: "Mango Leaves Toran", baseQuantity: "1 Pc", optional: true, estimatedPrice: 100, category: "Fresh Items" },
      { name: "Brass Pooja Thali (Plate)", baseQuantity: "1 Pc", optional: true, estimatedPrice: 450, category: "Utensil" },
      { name: "Kaju Katli Sweet Box", baseQuantity: "250g", optional: true, estimatedPrice: 300, category: "Prasad" }
    ],
    steps: [
      { stepNumber: 1, title: "Purification", instruction: "Clean the pooja room, sprinkle Ganga Jal to purify the surroundings and family members." },
      { stepNumber: 2, title: "Set up the Altar", instruction: "Spread a red cloth on a wooden platform. Place the idols of Lord Ganesha and Goddess Lakshmi." },
      { stepNumber: 3, title: "Kalash Installation", instruction: "Place a copper pot filled with water, mango leaves, and a coconut on top in the center." },
      { stepNumber: 4, title: "Worship Ganesha & Lakshmi", instruction: "Apply haldi-kumkum, offer flowers, durva grass, and light the oil diyas." },
      { stepNumber: 5, title: "Bhoga & Aarti", instruction: "Offer sweets, dry fruits, perform Lakshmi-Ganesha Aarti, and ring the bell." }
    ]
  },
  {
    name: "Satyanarayana Vratham",
    key: "satyanarayana-vratham",
    category: "vratham",
    description: "A highly sacred ritual dedicated to Lord Satyanarayana (an avatar of Vishnu), commonly performed on Purnima (full moon) days, housewarmings, or for general well-being.",
    significance: "Brings peace, harmony, and prosperity to the family. It reminds devotees of the importance of truth, charity, and sharing prasad with the community.",
    upcomingDate: "2026-06-29",
    timings: "Auspicious Muhurtham: 9:00 AM to 12:30 PM",
    baseBudget: 2800,
    checklist: [
      { name: "Satyanarayana Frame/Idol", baseQuantity: "1 Pc", optional: true, estimatedPrice: 500, category: "Essential" },
      { name: "Pooja Kalash (Copper)", baseQuantity: "1 Pc", optional: true, estimatedPrice: 350, category: "Utensil" },
      { name: "Raw Coconut with Husk", baseQuantity: "2 Pcs", optional: false, estimatedPrice: 80, category: "Fresh Items" },
      { name: "Fresh Betel Leaves & Nuts", baseQuantity: "11 Pairs", optional: false, estimatedPrice: 120, category: "Fresh Items" },
      { name: "Mixed Flower Garlands & Petals", baseQuantity: "1 Pack", optional: false, estimatedPrice: 250, category: "Fresh Items" },
      { name: "Pure Cow Ghee", baseQuantity: "200ml", optional: false, estimatedPrice: 190, category: "Essential" },
      { name: "Panchamrut (Milk, Curd, Honey, Ghee, Sugar Mix)", baseQuantity: "1 Bottle", optional: false, estimatedPrice: 150, category: "Essential" },
      { name: "Haldi-Kumkum-Sandala Set", baseQuantity: "1 Pack", optional: false, estimatedPrice: 60, category: "Essential" },
      { name: "Tulsi Leaves (Holy Basil)", baseQuantity: "1 Pack", optional: false, estimatedPrice: 50, category: "Fresh Items" },
      { name: "Dry Fruits Mix", baseQuantity: "200g", optional: true, estimatedPrice: 300, category: "Prasad" },
      { name: "Yellow Altar Cloth (Peetham Cloth)", baseQuantity: "1 Pc", optional: false, estimatedPrice: 100, category: "Essential" }
    ],
    steps: [
      { stepNumber: 1, title: "Sankalpam", instruction: "Take water in your hand and state your name, family details, and the purpose of performing the vratham." },
      { stepNumber: 2, title: "Ganesha Pooja", instruction: "Worship Lord Ganesha to remove all obstacles from the ritual execution." },
      { stepNumber: 3, title: "Navagraha Pooja", instruction: "Worship the nine planetary deities for peace and harmony." },
      { stepNumber: 4, title: "Prana Pratishtha & Archana", instruction: "Invoke Lord Satyanarayana into the Kalash. Recite the Vishnu Sahasranamam or Lord's names, offering Tulsi leaves and flowers." },
      { stepNumber: 5, title: "Vratha Katha Reading", instruction: "Read or listen to the five traditional stories/chapters of the Satyanarayana Vratham." },
      { stepNumber: 6, title: "Prasad Offering & Distribution", instruction: "Offer the special Rava Prasadam (prepared with equal parts wheat semolina, sugar, ghee, milk, banana) and distribute it to everyone present." }
    ]
  },
  {
    name: "Ganesh Chaturthi Pooja",
    key: "ganesh-chaturthi-pooja",
    category: "festival",
    description: "Celebrates the birth of Lord Ganesha, the lord of wisdom, prosperity, and obstacle removal.",
    significance: "Invoking Lord Ganesha at home clears all hurdles from your career, business, and personal relationships.",
    upcomingDate: "2026-09-14",
    timings: "Chaturthi Puja Muhurtham: 11:03 AM to 1:32 PM",
    baseBudget: 1800,
    checklist: [
      { name: "Clay Eco-Friendly Ganesha Idol", baseQuantity: "1 Pc", optional: false, estimatedPrice: 600, category: "Essential" },
      { name: "Durva Grass (31 Blades)", baseQuantity: "1 Bundle", optional: false, estimatedPrice: 40, category: "Fresh Items" },
      { name: "Red Hibiscus Flowers", baseQuantity: "1 Pack", optional: false, estimatedPrice: 100, category: "Fresh Items" },
      { name: "Modak Sweet Box (Steamed/Fried)", baseQuantity: "11 Pcs", optional: false, estimatedPrice: 250, category: "Prasad" },
      { name: "Sandalwood Paste (Chandan)", baseQuantity: "1 Tube", optional: false, estimatedPrice: 70, category: "Essential" },
      { name: "Janeu (Sacred Thread)", baseQuantity: "1 Pair", optional: false, estimatedPrice: 25, category: "Essential" },
      { name: "Turmeric & Vermillion", baseQuantity: "1 Pack", optional: false, estimatedPrice: 40, category: "Essential" },
      { name: "Aromatic Agarbatti & Camphor", baseQuantity: "1 Pack", optional: false, estimatedPrice: 75, category: "Essential" },
      { name: "Banana Leaves (For serving/altar)", baseQuantity: "2 Pcs", optional: true, estimatedPrice: 50, category: "Fresh Items" },
      { name: "Pooja Bell (Brass)", baseQuantity: "1 Pc", optional: true, estimatedPrice: 250, category: "Utensil" }
    ],
    steps: [
      { stepNumber: 1, title: "Prana Pratishtha", instruction: "Chant the Ganesha mantra to invite the deity's energy into the clay idol." },
      { stepNumber: 2, title: "Shodashopachara Worship", instruction: "Offer 16 types of service including washing feet, applying Chandan, offering janeu, and clothing." },
      { stepNumber: 3, title: "Offer Grass & Flowers", instruction: "Ganesha is fond of Durva grass and Red Hibiscus. Offer them with devotion." },
      { stepNumber: 4, title: "Modak Naivedyam", instruction: "Offer Modaks, laddus, and seasonal fruits to the deity." },
      { stepNumber: 5, title: "Ganesha Aarti", instruction: "Sing 'Jai Ganesh, Deva' and perform the aarti with burning camphor. Ring bells and blow the conch shell." }
    ]
  }
];

// Fetch all rituals (seeds if none exist)
exports.getAllRituals = async (req, res) => {
  try {
    let rituals = await Ritual.find().populate('featuredKitId');
    if (rituals.length === 0) {
      console.log("No rituals found. Seeding database with default festivals...");
      // Seed rituals
      await Ritual.insertMany(defaultRituals);
      rituals = await Ritual.find().populate('featuredKitId');
    }
    res.json(rituals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving rituals' });
  }
};

// Fetch a single ritual by key
exports.getRitualByKey = async (req, res) => {
  try {
    const ritual = await Ritual.findOne({ key: req.params.key }).populate('featuredKitId');
    if (!ritual) {
      return res.status(404).json({ message: 'Ritual not found' });
    }
    res.json(ritual);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving ritual details' });
  }
};

// Admin create a new ritual
exports.createRitual = async (req, res) => {
  try {
    const newRitual = new Ritual(req.body);
    await newRitual.save();
    res.status(201).json(newRitual);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error creating ritual. Verify fields and ensure key is unique.' });
  }
};
