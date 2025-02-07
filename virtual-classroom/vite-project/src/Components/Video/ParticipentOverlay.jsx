import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, Share, Hand, Users, Settings, 
  Layout, Pin, MoreVertical, UserPlus, Grid, Maximize2, 
  MessageSquare, PhoneOff, Smile, Volume2, Volume1, VolumeX,
  Users as UsersGroup
} from 'lucide-react';
import BreakoutRooms from './BrakeoutRoom';
import Controls from './Controls';
import ParticipantVideo from './ParticipantVideo';
import { useMediaStream } from './UseMediaStream';

function ParticipantOverlay({ participant, onPin, onMute, onVideoToggle }) {
  const [showMenu, setShowMenu] = useState(false);
  const [volume, setVolume] = useState(100);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVolumeChange = (e) => {
    setVolume(parseInt(e.target.value));
    // Add your volume control logic here
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-black/20 p-3 transition-opacity duration-300 hover:opacity-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {participant.isHost && (
              <span className="bg-blue-500 text-xs text-white px-2 py-0.5 rounded-full">Host</span>
            )}
            <span className="text-white text-sm font-medium">{participant.name}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {participant.isSpeaking && (
              <div className="flex space-x-1">
                <div className="w-1 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-1 h-4 bg-green-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-1 h-3 bg-green-400 rounded-full animate-pulse delay-150"></div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {participant.handRaised && (
            <div className="animate-bounce">
              <Hand size={16} className="text-yellow-400" />
            </div>
          )}
          
          {participant.isScreenSharing && (
            <Share size={16} className="text-blue-400" />
          )}
          
          {participant.isMuted && (
            <MicOff size={16} className="text-red-400" />
          )}

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-white hover:bg-gray-700/50 rounded-full p-1.5 transition-colors"
            >
              <MoreVertical size={16} />
            </button>

            {showMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-56 bg-gray-800 rounded-lg shadow-lg py-1 z-10 border border-gray-700">
                <button
                  onClick={() => onPin(participant.id)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-700 flex items-center"
                >
                  <Pin size={16} className="mr-2" />
                  {participant.isPinned ? 'Unpin' : 'Pin'} participant
                </button>
                
                <button
                  onClick={() => onMute(participant.id)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-700 flex items-center"
                >
                  {participant.isMuted ? <Mic size={16} className="mr-2" /> : <MicOff size={16} className="mr-2" />}
                  {participant.isMuted ? 'Unmute' : 'Mute'} participant
                </button>

                <button
                  onClick={() => onVideoToggle(participant.id)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-700 flex items-center"
                >
                  {participant.isVideoOff ? <Video size={16} className="mr-2" /> : <VideoOff size={16} className="mr-2" />}
                  {participant.isVideoOff ? 'Enable' : 'Disable'} video
                </button>

                <div className="px-4 py-2 text-sm text-gray-200 border-t border-gray-700">
                  <div className="flex items-center">
                    {volume === 0 ? (
                      <VolumeX size={16} className="mr-2" />
                    ) : volume < 50 ? (
                      <Volume1 size={16} className="mr-2" />
                    ) : (
                      <Volume2 size={16} className="mr-2" />
                    )}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {participant.isHost && (
                  <>
                    <div className="border-t border-gray-700"></div>
                    <button className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700 flex items-center">
                      <UserPlus size={16} className="mr-2" />
                      Remove participant
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ParticipantOverlay