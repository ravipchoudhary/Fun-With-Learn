import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Lazily initialize Gemini SDK clients
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === 'MY_GEMINI_API_KEY') {
      console.warn('GEMINI_API_KEY environment variable is not configured or uses placeholder.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // API 1: Live Health Checks
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Fun With Learn Dev Server',
      database: 'In-Memory State Engine (Durable client backup)',
      aiEnabled: !!process.env.GEMINI_API_KEY,
    });
  });

  // API 2: AI Student Chatbot Assistant
  app.post('/api/ai/chatbot', async (req, res) => {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message field is required' });
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        // High-quality simulated responses when no key is present for a smooth playground experience
        return res.json({
          text: `[Offline Demo Mode] Thanks for asking about: "${message}". Connect your GEMINI_API_KEY in the Settings secrets panel to unlock live, real-time AI doubt solving! Here is a tip: For student excellence, master the basic trigonometry values (sin 30° = 0.5, cos 60° = 0.5) first.`,
          simulated: true,
        });
      }

      const ai = getAiClient();
      
      // Let's create a formatted context incorporating the past 3 messages
      const prevMessageContext = (history || [])
        .slice(-6)
        .map((h: any) => `${h.senderName || h.role}: ${h.text}`)
        .join('\n');

      const fullPrompt = `${prevMessageContext}\nStudent: ${message}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: fullPrompt,
        config: {
          systemInstruction: 'You are "Fun Chatbot", an elite educational tutor on the "Fun With Learn" platform. Your goal is to guide students on math, sciences, social studies and high school queries. Be supportive, concise, and structured. Encourage micro-assessments, use Markdown layout snippets or bullet points to explain formulas where relevant.',
        },
      });

      res.json({ text: response.text || 'I understand your query, but could not produce an output. Please rephrase.' });
    } catch (err: any) {
      console.error('Gemini Chatbot Error:', err);
      res.status(500).json({ error: 'Failed to generate AI response: ' + err.message });
    }
  });

  // API 3: AI Dynamic Course Recommendation
  app.post('/api/ai/recommend-courses', async (req, res) => {
    const { grade, interest, currentScore } = req.body;
    
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        const demoRecs = [
          {
            title: `Mastery Course for ${grade || 'Class 10'} ${interest || 'Science/Math'}`,
            scoreTarget: 'Target: 95%+',
            topic: 'Algebra, Chemical Formulas, and Practical mock tests',
            reason: 'Tailored for scoring peak performance on weekly tests.'
          },
          {
            title: `Competitive Bridge: High-yield questions`,
            scoreTarget: 'Target: Olympiad Excellence',
            topic: 'Advanced concepts & mental physics questions',
            reason: 'Broadens analytical skills beyond standard textbooks.'
          }
        ];
        return res.json({ recommendations: demoRecs, simulated: true });
      }

      const ai = getAiClient();
      const prompt = `Recommend exactly 2 specific study topics/focus areas for a student in "${grade || 'Class 10'}" with deep interests in "${interest || 'Science and Math'}" whose current weekly score ranking is "${currentScore || '80%'}". Output JSON matching this schema:
      Array of: { "title": "...", "scoreTarget": "...", "topic": "...", "reason": "..." }`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'You are an elite academic counselor specializing in standard CBSE, ICSE and pre-university guidance. Return only JSON data.',
        },
      });

      const text = response.text || '[]';
      res.json({ recommendations: JSON.parse(text) });
    } catch (err: any) {
      console.error('Gemini Recommendation Error:', err);
      res.status(500).json({ error: 'Failed to fetch recommendations: ' + err.message });
    }
  });

  // API 4: AI Personalized Learning Path / Revision Planner
  app.post('/api/ai/learning-path', async (req, res) => {
    const { grade, subject, currentScore } = req.body;

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        const demoPath = {
          title: `Premium Path: ${subject || 'Physics'} for ${grade || 'Class 12'}`,
          estimatedDuration: '14 Days Revision',
          steps: [
            { day: 'Day 1-4', focus: 'Quick Recap of Fundamentals & Concept mapping', task: 'Complete Unit 1 question bank' },
            { day: 'Day 5-8', focus: 'Interactive mock test challenges on difficult sections', task: 'Review formulae worksheets' },
            { day: 'Day 9-12', focus: 'Solve 3 previous-year board questions & benchmark with grading', task: 'Attend live QA review session' },
            { day: 'Day 13-14', focus: 'Relaxed diagnostic recap & mindset coaching', task: 'Review quick-cards' },
          ]
        };
        return res.json({ path: demoPath, simulated: true });
      }

      const ai = getAiClient();
      const prompt = `Formulate a 4-step revision learning path for a "${grade || 'Class 12'}" student struggling in "${subject || 'Physics'}" current average score is "${currentScore || '65%'}". Output JSON matching this schema:
      { "title": "...", "estimatedDuration": "...", "steps": [ { "day": "...", "focus": "...", "task": "..." } ] }`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'You are an educational master strategist who designs adaptive personalized score-boosting plans. Return only clean JSON.',
        },
      });

      const text = response.text || '{}';
      res.json({ path: JSON.parse(text) });
    } catch (err: any) {
      console.error('Gemini Path Error:', err);
      res.status(500).json({ error: 'Failed to customize revision path: ' + err.message });
    }
  });

  // Serve static files / Vite Dev server middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server successfully started. Listening at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to launch application server:', err);
});
