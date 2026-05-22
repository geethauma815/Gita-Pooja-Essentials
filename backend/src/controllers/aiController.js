const { Ritual } = require('../models');
const { OpenAI } = require('openai');

let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

// AI chat query endpoint
exports.chatQuery = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const queryLower = message.toLowerCase();
    
    // Find if a specific ritual is mentioned in the query
    const allRituals = await Ritual.find();
    let matchedRitual = null;
    
    for (const ritual of allRituals) {
      const nameParts = ritual.name.toLowerCase().split(' ');
      const keyParts = ritual.key.split('-');
      const wordsToMatch = [...nameParts, ...keyParts];
      
      const containsKeywords = wordsToMatch.some(word => 
        word.length > 3 && queryLower.includes(word)
      );

      if (containsKeywords || queryLower.includes(ritual.key)) {
        matchedRitual = ritual;
        break;
      }
    }

    // 1. If OpenAI API Key is available, use GPT for a dynamic conversational response
    if (openai) {
      try {
        let systemPrompt = "You are a knowledgeable, respectful Hindu priest and cultural assistant. " +
          "Help the user prepare for their pooja, festival, or vratam. Provide timing suggestions, steps, and preparation tips.";
        
        if (matchedRitual) {
          systemPrompt += ` The user is asking about '${matchedRitual.name}'. Here are details from our database:\n` +
            `Description: ${matchedRitual.description}\n` +
            `Significance: ${matchedRitual.significance}\n` +
            `Timings: ${matchedRitual.timings}\n` +
            `Estimated Budget: ₹${matchedRitual.baseBudget}\n` +
            `Checklist: ${matchedRitual.checklist.map(i => `${i.name} (${i.baseQuantity})`).join(', ')}\n` +
            `Steps:\n${matchedRitual.steps.map(s => `${s.stepNumber}. ${s.title}: ${s.instruction}`).join('\n')}\n` +
            `Incorporate this authentic database data into your warm, structural response. Highlight pricing and checklists. Make your response extremely polished.`;
        }

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ],
          temperature: 0.7
        });

        return res.json({
          reply: completion.choices[0].message.content,
          ritualKey: matchedRitual ? matchedRitual.key : null
        });
      } catch (openAiError) {
        console.error("OpenAI call failed, falling back to local database rule matching:", openAiError.message);
      }
    }

    // 2. Fallback to Local RAG/Rule-based compilation from Mongoose DB
    if (matchedRitual) {
      const checklistStr = matchedRitual.checklist
        .map(item => `- **${item.name}** (${item.baseQuantity}) - Approx. ₹${item.estimatedPrice} ${item.optional ? '[Optional]' : ''}`)
        .join('\n');

      const stepsStr = matchedRitual.steps
        .map(step => `${step.stepNumber}. **${step.title}**: ${step.instruction}`)
        .join('\n');

      const localReply = `Namaste! I see you are planning to perform **${matchedRitual.name}**. Here is a detailed ritual guide prepared based on our traditional database records:

### 🌟 Significance
${matchedRitual.significance || matchedRitual.description}

### 📅 Timing & Muhurtham
- **Auspicious Timings**: ${matchedRitual.timings || "Perform in the early morning (Brahma Muhurtha) or during Pradosh Kaal."}
- **Upcoming Date**: ${matchedRitual.upcomingDate}

### 🛍️ Required Pooja Items Checklist
We have a ready-made custom kit covering these items. Here is the breakdown:
${checklistStr}

### 💰 Budget Estimation
- **Estimated Items Cost**: ~₹${matchedRitual.baseBudget} (You can customize this in our *Smart Pooja Kit Builder* to add/remove items you already have).

### 🛠️ Step-by-Step Procedure
${stepsStr}

### 💡 Preparation Tips
1. **Pooja Altar**: Set up the altar facing East or North.
2. **Fresh Elements**: Procure items like coconuts, mango leaves, and flowers fresh on the morning of the pooja.
3. **Prasadam**: Clean the kitchen thoroughly before preparing prasadam. Avoid onion/garlic in any offering.
4. **Attire**: Traditional Indian wear (Dhoti/Kurta for men, Saree/Salwar for women) is recommended.

Would you like me to add the **${matchedRitual.name} Ready-made Combo Kit** directly to your shopping cart?`;

      return res.json({
        reply: localReply,
        ritualKey: matchedRitual.key
      });
    }

    // Default conversational response if no ritual keywords match
    const defaultReply = `Namaste! I am your AI Pooja & Festival assistant. 

I can help you prepare for major Indian rituals and festivals such as:
- **Satyanarayana Vratham**
- **Diwali Lakshmi Pooja**
- **Ganesh Chaturthi Pooja**

Ask me questions like:
- *"I am performing Satyanarayana Vratham for the first time. What do I do?"*
- *"What is the budget and items needed for Diwali Pooja?"*
- *"Can you give me the step-by-step checklist for Ganesh Chaturthi?"*

What ritual are you preparing for today?`;

    return res.json({
      reply: defaultReply,
      ritualKey: null
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error processing chatbot response' });
  }
};
