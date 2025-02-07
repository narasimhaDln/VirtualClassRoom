import React, { useState, useEffect } from 'react';
import { Mic, X, Settings } from 'lucide-react';

export function LiveCaptions({ onClose }) {
  const [captions, setCaptions] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' }
  ];

  useEffect(() => {
    let recognition = null;

    if ('webkitSpeechRecognition' in window) {
      recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');

        setCaptions(prev => [...prev, {
          id: Date.now(),
          text: transcript,
          timestamp: new Date().toLocaleTimeString(),
          speaker: 'Current Speaker'
        }].slice(-5)); // Keep only last 5 captions
      };

      if (isListening) {
        recognition.start();
      }
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isListening, selectedLanguage]);

  return (
    <div className="bg-gray-800 rounded-lg p-4 w-96 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-medium">Live Captions</h3>
        <div className="flex items-center space-x-2">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setIsListening(!isListening)}
            className={`p-2 rounded-full ${
              isListening ? 'bg-blue-500' : 'bg-gray-700'
            } hover:bg-opacity-80`}
          >
            <Mic className="w-4 h-4 text-white" />
          </button>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-3 max-h-60 overflow-y-auto">
        {captions.map(caption => (
          <div key={caption.id} className="bg-gray-700 rounded-lg p-3">
            <div className="flex justify-between items-start mb-1">
              <span className="text-white text-sm font-medium">
                {caption.speaker}
              </span>
              <span className="text-gray-400 text-xs">
                {caption.timestamp}
              </span>
            </div>
            <p className="text-gray-300 text-sm">{caption.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 