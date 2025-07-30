let apiKey = "AIzaSyB5CWou9IhMYYKyss27pq94_2UUjE2yDJA"

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  //gemini-1.5-flash
  //gemini-2.5-flash
  //gemini-2.0-flash
  //gemini-2.0-flash-lite
  model: "gemini-2.5-flash-lite",
});
const generationConfig = {
             temperature: 1,
  topP: 0.95,
  topK: 20,
  maxOutputTokens: 40,
  responseMimeType: "text/plain"
 
};
async function run(prompt) {
  const chatSession = model.startChat({
    generationConfig,
    history: [
      
    ],
  });
  const result = await chatSession.sendMessage(prompt);
  return result.response.text()
};
export default run;