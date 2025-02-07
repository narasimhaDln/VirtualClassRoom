import React, { useState } from 'react';
import { 
  FaMicrophone, FaMicrophoneSlash, 
  FaVideo, FaVideoSlash,
  FaDesktop, FaStop,
  FaCog, FaHandPaper,
  FaRecordVinyl, FaDownload,
  FaUsers, FaComments,
  FaPhoneSlash, FaExpand,
  FaRegSmile, FaFilter
} from 'react-icons/fa';

export function VideoControls({ 
  isMuted, 
  isVideoOff, 
  isRecording,
  isHandRaised,
  isBlurred,
  onToggleAudio, 
  onToggleVideo,
  onScreenShare,
  isScreenSharing,
  availableDevices,
  activeDevice,
  onDeviceChange,
  onToggleRecording,
  onDownloadRecording,
  onToggleHand,
  onToggleChat,
  onToggleParticipants,
  onLeaveMeeting,
  onToggleFullScreen,
  onToggleBlur,
  hasRecording,
  audioLevel
}) {
  const [showEmoji, setShowEmoji] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const emojis = ['👍', '👏', '❤️', '😊', '🎉', '👋', '🤔', '👌'];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-90 p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Left Controls */}
        <div className="flex items-center gap-2">
          {/* Audio Toggle with Level Indicator */}
          <div className="relative">
            <button
              onClick={onToggleAudio}
              className={`p-4 rounded-full ${
                isMuted ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </button>
            {!isMuted && (
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-900"
                style={{ backgroundColor: audioLevel > 0.5 ? '#22c55e' : '#d1d5db' }}
              />
            )}
          </div>

          {/* Video Toggle */}
          <button
            onClick={onToggleVideo}
            className={`p-4 rounded-full ${
              isVideoOff ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {isVideoOff ? <FaVideoSlash /> : <FaVideo />}
          </button>

          {/* Background Blur */}
          <button
            onClick={onToggleBlur}
            className={`p-4 rounded-full ${
              isBlurred ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <FaFilter />
          </button>
        </div>

        {/* Center Controls */}
        <div className="flex items-center gap-2">
          {/* Screen Share */}
          <button
            onClick={onScreenShare}
            className={`p-4 rounded-full ${
              isScreenSharing ? 'bg-green-500' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title="Share Screen"
          >
            {isScreenSharing ? <FaStop /> : <FaDesktop />}
          </button>

          {/* Recording */}
          <button
            onClick={onToggleRecording}
            className={`p-4 rounded-full ${
              isRecording ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={isRecording ? 'Stop Recording' : 'Start Recording'}
          >
            <FaRecordVinyl />
          </button>

          {/* Hand Raise */}
          <button
            onClick={onToggleHand}
            className={`p-4 rounded-full ${
              isHandRaised ? 'bg-yellow-500' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title="Raise Hand"
          >
            <FaHandPaper />
          </button>

          {/* Reactions */}
          <div className="relative">
            <button
              onClick={() => setShowEmoji(!showEmoji)}
              className="p-4 rounded-full bg-gray-700 hover:bg-gray-600"
              title="Reactions"
            >
              <FaRegSmile />
            </button>
            {showEmoji && (
              <div className="absolute bottom-full mb-2 bg-gray-800 rounded-lg p-2 grid grid-cols-4 gap-2">
                {emojis.map(emoji => (
                  <button
                    key={emoji}
                    className="p-2 hover:bg-gray-700 rounded"
                    onClick={() => {
                      // Handle emoji reaction
                      setShowEmoji(false);
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Participants */}
          <button
            onClick={onToggleParticipants}
            className="p-4 rounded-full bg-gray-700 hover:bg-gray-600"
            title="Participants"
          >
            <FaUsers />
          </button>

          {/* Chat */}
          <button
            onClick={onToggleChat}
            className="p-4 rounded-full bg-gray-700 hover:bg-gray-600"
            title="Chat"
          >
            <FaComments />
          </button>

          {/* Settings */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-4 rounded-full bg-gray-700 hover:bg-gray-600"
              title="Settings"
            >
              <FaCog />
            </button>
            
            {showSettings && (
              <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-800 rounded-lg shadow-lg p-4">
                <h3 className="text-white font-medium mb-3">Settings</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-gray-400 text-sm block mb-1">Microphone</label>
                    <select
                      className="w-full bg-gray-700 rounded p-2 text-white text-sm"
                      value={activeDevice.audioInput || ''}
                      onChange={(e) => onDeviceChange(e.target.value, 'audioinput')}
                    >
                      {availableDevices.audioInput.map(device => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label || `Microphone ${device.deviceId.slice(0, 5)}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm block mb-1">Camera</label>
                    <select
                      className="w-full bg-gray-700 rounded p-2 text-white text-sm"
                      value={activeDevice.videoInput || ''}
                      onChange={(e) => onDeviceChange(e.target.value, 'videoinput')}
                    >
                      {availableDevices.videoInput.map(device => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label || `Camera ${device.deviceId.slice(0, 5)}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Full Screen */}
          <button
            onClick={onToggleFullScreen}
            className="p-4 rounded-full bg-gray-700 hover:bg-gray-600"
            title="Full Screen"
          >
            <FaExpand />
          </button>

          {/* Download Recording */}
          {hasRecording && (
            <button
              onClick={onDownloadRecording}
              className="p-4 rounded-full bg-gray-700 hover:bg-gray-600"
              title="Download Recording"
            >
              <FaDownload />
            </button>
          )}

          {/* Leave Meeting */}
          <button
            onClick={onLeaveMeeting}
            className="p-4 rounded-full bg-red-500 hover:bg-red-600"
            title="Leave Meeting"
          >
            <FaPhoneSlash />
          </button>
        </div>
      </div>
    </div>
  );
}