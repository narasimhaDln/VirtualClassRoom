import React, { createContext, useState } from 'react';
import run from '../gemini';

export const dataContext = createContext();

function UserContext({ children }) {
  const [speaking, setSpeaking] = useState(false);
  const [prompt, setPrompt] = useState("listening...");
  const [response, setResponse] = useState(false);

  function speak(text) {
    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.volume = 1;
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.lang = "hi-GB"; 
    window.speechSynthesis.speak(text_speak);
  }

  async function aiResponse(prompt) {
    let text = await run(prompt)
    let newText = text
      .split("**").join("")
      .split("*").join("")
      .replace(/google/gi, "Narasimha"); 
     console.log("hello")

    setPrompt(newText);
    speak(newText);
    setResponse(true);
    setTimeout(() => {
      setSpeaking(false);
    }, 5000);
  }

  let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = new speechRecognition();
  recognition.onresult = (e) => {
    let currentIndex = e.resultIndex;
    let transcript = e.results[currentIndex][0].transcript;
    setPrompt(transcript);
    takeCommand(transcript.toLowerCase());
  };

  function takeCommand(command) {
    if (command.includes("open") && command.includes("youtube")) {
      window.open("https://www.youtube.com/", "_blank");
      speak("opening Youtube");
      setPrompt("opening Youtube..");
    } else if (command.includes("open") && command.includes("google")) {
      window.open("https://www.google.com/", "_blank");
      speak("opening google");
      setPrompt("opening google.");
    } else if (command.includes("open") && command.includes("instagram")) {
      window.open("https://www.instagram.com/", "_blank");
      speak("opening instagram");
      setPrompt("opening instagram.");
    } else if (command.includes("time")) {
      let time = new Date().toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "numeric"
      });
      speak(time);
      setPrompt(time);
    } else if (command.includes("date")) {
      let date = new Date().toLocaleDateString(undefined, {
        day: "numeric",
        month: "numeric"
      });
      speak(date);
      setPrompt(date);
    } else {
      aiResponse(command);
    }

    setTimeout(() => {
      setSpeaking(false);
    }, 5000);
  }

  let value = {
    recognition,
    speaking,
    setSpeaking,
    prompt,
    setPrompt,
    response,
    setResponse
  };

  return (
    <div>
      <dataContext.Provider value={value}>
        {children}
      </dataContext.Provider>
    </div>
  );
}

export default UserContext;
