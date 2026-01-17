const router = require('express').Router();
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const User = require('../models/user.model');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

const instructions = `Core Identity and Purpose:
You are "MindSpace," a calming mental wellness companion. Your role is to provide short (4–5 lines), soothing responses that console the user, help them feel safe, and gently guide them toward a positive mindset. You are not a therapist, but a comforting presence.

Key Behavioral Principles:
Critical Instruction : Respond in just 3-5 lines, not more than that.
1. **Consoling & Listening:** Acknowledge emotions with validating phrases like:  
   * "I hear you, and I’m really glad you shared this."  
   * "That sounds heavy, thank you for trusting me with it."  
   * "Would you mind sharing a little more about what that feels like for you?"  

2. **Minimal but Soothing:** Keep replies within 4–5 lines. Use soft, simple words that comfort without overwhelming.  

3. **Positive Shift:** After consoling, gently guide the user toward hope or calm.  
   * Examples: "It’s okay to take this one moment at a time." / "You’re showing strength just by opening up."  

4. **Sensitive to Mental Health Issues:** If the user expresses suicidal thoughts, deep distress, or mental struggles, console first with empathy, then encourage safe, positive steps.  

5. **Crisis Escalation (India-specific):** If the user expresses suicidal thoughts or extreme distress, always include this resource gently:  
   * "I hear your pain, and it’s really brave of you to share. Please remember you don’t have to face this alone. You can reach out to the Helpline at 14416 for immediate support."  

Your purpose: Start by asking how the user feels, console with empathy and listening, invite sharing, and gently shift toward a calmer, more hopeful outlook—always in 4–5 soothing lines.`

// --- FIX: Add safety settings to prevent the AI from blocking harmless responses ---
const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

router.post('/', async (req, res) => {
  try {
    const { message, history, nickname } = req.body;
    const chatOptions = {
      history: history || [],
      generationConfig: { maxOutputTokens: 1000 },
      safetySettings, // Apply the safety settings here
    };
    if (!history || history.length === 0) {
      chatOptions.systemInstruction = {
        parts: [{ text: `${instructions}\n\n[User's Name] = ${nickname}` }],
      };
    }
    const chat = model.startChat(chatOptions);
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    res.json({ message: text });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ error: "Failed to get a response from the AI model." });
  }
});

router.post('/summary', async (req, res) => {
  try {
    const { history, userId } = req.body;
    const summaryPrompt = `Based on the following chat conversation, generate a response as a single, valid JSON object with ONLY these four keys: "summary", "keyInsights", "currentMood", and "gentleSuggestion". IMPORTANT: Address the user directly using second-person pronouns like "you" and "your". Do not use third-person language like "the user".\n\nExample: "You seemed to be feeling..." instead of "The user seemed to be feeling...".\n\nConversation:\n${JSON.stringify(history)}`;

    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: summaryPrompt }] }],
        safetySettings, // Apply safety settings to the summary generation as well
    });
    
    const response = await result.response;
    const text = response.text();

    let summaryData;
    try {
      const jsonString = text.replace(/```json\n|```/g, '').trim();
      summaryData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Failed to parse summary JSON from model:", text);
      return res.status(500).json({ error: "Failed to process AI summary." });
    }

    const user = await User.findById(userId);
    if (user) {
      user.summaries.push(summaryData);
      await user.save();
    }

    res.json(summaryData);
  } catch (error) {
    console.error("Error in /api/chat/summary:", error);
    res.status(500).json({ error: "Failed to generate chat summary." });
  }
});

module.exports = router;

