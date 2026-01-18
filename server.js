require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// OpenRouter API endpoint
app.post('/api/comfort', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({
        error: 'API key not configured',
        comfortMessage: 'เรารับฟังคุณอยู่ คุณไม่ได้อยู่คนเดียวนะ 💙✨'
      });
    }

    // Call OpenRouter API with Mistral Devstral 2 2512
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://relief-wine.vercel.app/',
        'X-Title': 'Student Relief Website'
      },
      body: JSON.stringify({
        model: 'mistralai/devstral-2512:free',
        messages: [
          {
            role: 'system',
            content: 'คุณคือผู้รับฟังที่เข้าใจและเห็นอกเห็นใจนักเรียนที่ต้องการปลดปล่อยความรู้สึก ตอบกลับด้วยข้อความสั้นๆ อบอุ่น และให้กำลังใจ (ไม่เกิน 2-3 ประโยค) ที่ทำให้พวกเขารู้สึกว่ามีคนรับฟังและเข้าใจ ใช้น้ำเสียงที่อ่อนโยน เข้าใจ และให้กำลังใจ ใช้อีโมจิอย่างเป็นธรรมชาติและเหมาะสม (2-3 ตัว) เพื่อให้ข้อความดูอบอุ่นและเป็นกันเองและให้คำแนะนำอย่างเหมาะสมและทำตามได้จริง'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 100,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const comfortMessage = data.choices[0].message.content.trim();

    res.json({ comfortMessage });

  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    // Log detailed error to file for debugging
    const fs = require('fs');
    fs.appendFileSync('server_error.log', `${new Date().toISOString()} - Error: ${error.message}\n`);

    res.status(500).json({
      error: 'Failed to get comfort message',
      comfortMessage: 'เรารับฟังคุณอยู่ คุณไม่ได้อยู่คนเดียว และความรู้สึกของคุณมีความหมาย 💙✨'
    });
  }
});

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✨ Student Relief Website running on http://localhost:${PORT}`);
  console.log(`📝 Ready to listen and comfort...`);
});
