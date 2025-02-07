import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function ChatPanel({ onClose, participants, currentUser }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showEmojis, setShowEmojis] = useState(false);
  const messagesEndRef = useRef(null);
  
  const emojis = ['👋', '👍', '👏', '❤️', '😊', '🎉', '🤔', '👌'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: currentUser,
      content: message,
      timestamp: new Date().toLocaleTimeString(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size should be less than 5MB');
      return;
    }

    const newMessage = {
      id: Date.now(),
      sender: currentUser,
      content: file.name,
      fileUrl: URL.createObjectURL(file),
      fileType: file.type,
      timestamp: new Date().toLocaleTimeString(),
      type: 'file'
    };

    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <div className="flex flex-col h-full bg-gray-800">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-white font-medium">Chat</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender.id === currentUser.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${
                msg.sender.id === currentUser.id ? 'bg-blue-500' : 'bg-gray-700'
              } rounded-lg p-3`}>
                {msg.sender.id !== currentUser.id && (
                  <div className="text-sm text-gray-300 mb-1">{msg.sender.name}</div>
                )}
                {msg.type === 'text' ? (
                  <p className="text-white">{msg.content}</p>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Paperclip size={16} className="text-gray-300" />
                      <span className="text-white">{msg.content}</span>
                    </div>
                    {msg.fileType.startsWith('image/') ? (
                      <img 
                        src={msg.fileUrl} 
                        alt="Shared file" 
                        className="max-w-full rounded"
                      />
                    ) : (
                      <a 
                        href={msg.fileUrl} 
                        download={msg.content}
                        className="text-blue-300 hover:underline text-sm"
                      >
                        Download file
                      </a>
                    )}
                  </div>
                )}
                <div className="text-xs text-gray-300 mt-1">{msg.timestamp}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEmojis(!showEmojis)}
              className="p-2 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
            >
              <Smile size={20} />
            </button>
            {showEmojis && (
              <div className="absolute bottom-full left-0 mb-2 bg-gray-700 rounded-lg p-2 grid grid-cols-4 gap-2">
                {emojis.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setMessage(prev => prev + emoji);
                      setShowEmojis(false);
                    }}
                    className="p-2 hover:bg-gray-600 rounded"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
          <label className="p-2 rounded hover:bg-gray-700 text-gray-400 hover:text-white cursor-pointer">
            <Paperclip size={20} />
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*,.pdf,.doc,.docx"
            />
          </label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="p-2 rounded bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} className="text-white" />
          </button>
        </div>
      </form>
    </div>
  );
} 