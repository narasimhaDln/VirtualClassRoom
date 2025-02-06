import { useState } from 'react';
import React from 'react'
import Navigation from './Components/Navigation';
import ClassInfo from './Components/ClassInfo';
import VideoConference from './Components/VideoConference';
import Whiteboard from './Components/Whiteboard';
import Chat from './Components/Chat';
import Sidebar from './Components/Sidebar';
import { Grid, MessageSquare } from 'lucide-react';
import  useToast  from '../src/Components/Hooks/UseToast';

function App() {
  const [activeTab, setActiveTab] = useState('whiteboard');
  const { ToastContainer } = useToast();

  const instructor = {
    name: 'Dr. Sarah Johnson',
    department: 'Mathematics Department',
    avatar: 'https://source.unsplash.com/random/40x40?teacher'
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation
        userName="John Doe"
        userAvatar="https://source.unsplash.com/random/40x40?face"
      />

      <ClassInfo
        className="Mathematics 101"
        roomNumber="MAT-101"
        isLive={true}
      />

      <main className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <VideoConference />
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="flex items-center">
                  <button
                    onClick={() => setActiveTab('whiteboard')}
                    className={`px-6 py-3 flex items-center space-x-2 border-b-2 font-medium ${
                      activeTab === 'whiteboard'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Grid size={18} />
                    <span>Whiteboard</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`px-6 py-3 flex items-center space-x-2 border-b-2 font-medium ${
                      activeTab === 'chat'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <MessageSquare size={18} />
                    <span>Chat</span>
                  </button>
                </div>
              </div>
              <div className="p-4">
                {activeTab === 'whiteboard' ? <Whiteboard /> : <Chat />}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <Sidebar instructor={instructor} />
          </div>
        </div>
      </main>

      <ToastContainer />
    </div>
  );
}

export default App;