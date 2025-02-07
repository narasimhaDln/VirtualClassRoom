import React, { useState, useEffect } from 'react';
import { X, Save, Share, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function MeetingNotes({ onClose }) {
  const [notes, setNotes] = useState('');
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    if (autoSave) {
      const timer = setTimeout(() => {
        handleSave();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notes, autoSave]);

  const handleSave = () => {
    localStorage.setItem('meeting-notes', notes);
    setLastSaved(new Date());
    toast.success('Notes saved');
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Meeting Notes',
        text: notes,
      });
      toast.success('Notes shared successfully');
    } catch (error) {
      toast.error('Failed to share notes');
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 w-96 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-medium">Meeting Notes</h3>
        <div className="flex items-center space-x-2">
          {lastSaved && (
            <div className="flex items-center text-gray-400 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {new Date(lastSaved).toLocaleTimeString()}
            </div>
          )}
          <button
            onClick={handleSave}
            className="p-2 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
          >
            <Save className="w-5 h-5" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
          >
            <Share className="w-5 h-5" />
          </button>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
      </div>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Type your meeting notes here..."
        className="w-full h-64 bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="mt-4 flex items-center justify-between text-sm">
        <label className="flex items-center text-gray-400">
          <input
            type="checkbox"
            checked={autoSave}
            onChange={(e) => setAutoSave(e.target.checked)}
            className="mr-2"
          />
          Auto-save
        </label>
        <span className="text-gray-400">
          {notes.length} characters
        </span>
      </div>
    </div>
  );
} 