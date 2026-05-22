const { Page } = require('../models');

// Default pages to seed if database is empty
const defaultPages = [
  {
    title: "About Gita Divine",
    slug: "about-us",
    content: `<h2>About Gita Divine Essentials</h2><p>Welcome to Gita Divine, your trusted bridge to authentic Vedic traditions. We are committed to sourcing pure, organic, and scripturally approved pooja items and kits for devotees across India.</p><h3>Our Mission</h3><p>We work closely with local Vedic scholars and rural artisans to curate ritual checklists, traditional brassware, organic kumkum, and clay idols. By choosing Gita Divine, you support local potters and weavers while ensuring absolute purity in your prayers.</p>`,
    images: ["/pooja.png", "/pooja2.png"]
  },
  {
    title: "Vedic Temples & Devotion Guide",
    slug: "temple-guide",
    content: `<h2>Guide to Temple Worship & Devotion</h2><p>In Hinduism, temple worship is a powerful means of communion with the divine. This guide offers insights on simple protocols for visiting and offering prayers at sacred shrines.</p><h3>Key Offerings</h3><ul><li><strong>Archana Kit:</strong> Coconut, flowers, betel leaves, camphor, and incense.</li><li><strong>Prasadam:</strong> Hand-made sweets offered to the deity and distributed to all.</li></ul>`,
    images: ["/pooja3.png", "/ganesh.png"]
  }
];

// Fetch all pages
exports.getAllPages = async (req, res) => {
  try {
    let pages = await Page.find({});
    if (pages.length === 0) {
      console.log("No custom pages found. Seeding defaults...");
      await Page.insertMany(defaultPages);
      pages = await Page.find({});
    }
    res.json(pages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving dynamic pages' });
  }
};

// Fetch single page by slug
exports.getPageBySlug = async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    if (!page) {
      // Return a temporary page object if not found in DB but seeded default is queried
      const seeded = defaultPages.find(p => p.slug === req.params.slug);
      if (seeded) return res.json(seeded);
      return res.status(404).json({ message: 'Page not found' });
    }
    res.json(page);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching page details' });
  }
};

// Create a new custom page (Admin only)
exports.createPage = async (req, res) => {
  try {
    const { title, slug, content, images } = req.body;
    
    // Check if slug already exists
    const existing = await Page.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: 'A page with this URL slug already exists.' });
    }

    const newPage = new Page({ title, slug, content, images: images || [] });
    await newPage.save();
    res.status(201).json(newPage);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error creating dynamic page' });
  }
};

// Delete a custom page (Admin only)
exports.deletePage = async (req, res) => {
  try {
    const page = await Page.findOneAndDelete({ slug: req.params.slug });
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    res.json({ message: 'Page deleted successfully', success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting dynamic page' });
  }
};
