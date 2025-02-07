import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, MessageSquare, Image as ImageIcon, File, X } from 'lucide-react';

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Teacher Smith',
      content: 'Welcome to today\'s class!',
      timestamp: new Date(),
      type: 'text',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() && files.length === 0) return;

    const newMessages = [];

    if (newMessage.trim()) {
      newMessages.push({
        id: messages.length + 1,
        sender: 'You',
        content: newMessage,
        timestamp: new Date(),
        type: 'text',
      });
    }

    files.forEach((file, index) => {
      newMessages.push({
        id: messages.length + newMessages.length + 1,
        sender: 'You',
        content: '',
        timestamp: new Date(),
        type: file.type.startsWith('image/') ? 'image' : 'file',
        fileUrl: URL.createObjectURL(file),
        fileName: file.name,
      });
    });

    setMessages([...messages, ...newMessages]);
    setNewMessage('');
    setFiles([]);
  };

  const handleFileSelect = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col h-[600px]">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center">
          <MessageSquare className="mr-2" size={20} />
          Class Chat
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${
              message.sender === 'You' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-center mb-1">
              <span className="text-sm font-semibold">{message.sender}</span>
              <span className="text-xs text-gray-500 ml-2">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <div
              className={`rounded-lg p-3 max-w-[80%] ${
                message.sender === 'You'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              {message.type === 'text' && message.content}
              {message.type === 'image' && (
                <div className="relative">
                  <img
                    src={message.fileUrl}
                    alt="Shared image"
                    className="max-w-full rounded"
                  />
                </div>
              )}
              {message.type === 'file' && (
                <div className="flex items-center space-x-2">
                  <File size={20} />
                  <a
                    href={message.fileUrl}
                    download={message.fileName}
                    className="underline"
                  >
                    {message.fileName}
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {files.length > 0 && (
        <div className="px-4 py-2 border-t">
          <div className="flex flex-wrap gap-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-100 rounded-lg p-2"
              >
                {file.type.startsWith('image/') ? (
                  <ImageIcon size={16} className="mr-2" />
                ) : (
                  <File size={16} className="mr-2" />
                )}
                <span className="text-sm truncate max-w-[150px]">
                  {file.name}
                </span>
                <button
                  onClick={() => removeFile(index)}
                  className="ml-2 text-gray-500 hover:text-red-500"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
