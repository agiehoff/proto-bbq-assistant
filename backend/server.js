
import OpenAI from 'openai';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/get-recipe', async (req, res) => {
  const { prompt } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: "user", content: prompt }]
    });
    res.json({ recipe: completion.choices[0].message.content.trim() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fehler bei der Rezeptgenerierung" });
  }
});

app.post('/api/get-recipe-image', async (req, res) => {
  const { prompt } = req.body;
  try {
    const image = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024"
    });
    res.json({ imageUrl: image.data[0].url });
  } catch (error) {
    console.error("Fehler beim Bildgenerieren:", error);
    res.status(500).json({ error: "Fehler bei der Bildgenerierung" });
  }
});

app.listen(5000, () => console.log("Server läuft auf Port 5000"));
