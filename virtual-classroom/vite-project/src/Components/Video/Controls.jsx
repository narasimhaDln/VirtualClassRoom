import React, { memo, useState, useEffect } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, Share, Hand, Smile, PhoneOff, 
  Volume2, Volume1, VolumeX, Settings, Users, MessageCircle, 
  Layout, CircleDot, Download, Filter, PictureInPicture, Lock,
  Grid, Coffee, Clock, Keyboard, Headphones, Webcam, Network,
  MonitorSpeaker, Gauge, Shield, Languages, Maximize, Minimize, Mic2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Controls = memo(({ 
  isMuted, onToggleMic,
  isVideoOn, onToggleVideo,
  isScreenSharing, onToggleScreenShare,
  handRaised, onToggleHand,
  volume, onVolumeChange,
  showEmoji, onToggleEmoji,
  onEndCall,
  onToggleSettings,
  onToggleParticipants,
  onToggleChat,
  isRecording,
  onToggleRecording,
  onChangeLayout,
  onToggleBlur,
  isBlurred,
  audioLevel = 0,
  onToggleKeyboardShortcuts,
  onToggleStats,
  onToggleSecurityOptions,
  onToggleLanguage,
  onToggleDeviceTest,
  networkQuality = 100,
  isHost = false,
  availableLanguages = ['English', 'Spanish', 'French'],
  currentLanguage = 'English'
}) => {
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [showEmojiPanel, setShowEmojiPanel] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPiPActive, setIsPiPActive] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [currentLayout, setCurrentLayout] = useState('grid');
  const [showLayoutOptions, setShowLayoutOptions] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSecurityOptions, setShowSecurityOptions] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showDeviceTest, setShowDeviceTest] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Recording timer
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.altKey) {
        switch(e.key) {
          case 'm': onToggleMic(); break;
          case 'v': onToggleVideo(); break;
          case 'h': onToggleHand(); break;
          case 'r': handleRecordingToggle(); break;
          case 's': onToggleScreenShare(); break;
          case 'f': handleFullScreen(); break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRecordingToggle = () => {
    if (!isRecording) {
      toast.success('Recording started');
      // Play sound effect
      new Audio('/recording-started.mp3').play().catch(() => {});
    } else {
      toast.success('Recording stopped');
    }
    onToggleRecording();
  };

  const handlePiPToggle = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiPActive(false);
      } else {
        const video = document.querySelector('video');
        if (video) {
          await video.requestPictureInPicture();
          setIsPiPActive(true);
        }
      }
    } catch (error) {
      toast.error('Picture in Picture failed');
    }
  };

  const handleLockToggle = () => {
    setIsLocked(!isLocked);
    toast.success(isLocked ? 'Meeting unlocked' : 'Meeting locked');
  };

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const handleDeviceTest = () => {
    setShowDeviceTest(true);
    // Implement device test logic
  };

  const layouts = [
    { id: 'grid', icon: Grid, label: 'Grid View' },
    { id: 'spotlight', icon: Layout, label: 'Spotlight' },
    { id: 'presentation', icon: Share, label: 'Presentation' }
  ];

  const emojis = ['👍', '👏', '❤️', '😊', '🎉', '👋', '🤔', '👌'];

  const handleEmojiClick = (emoji) => {
    toast.success(`Reaction sent: ${emoji}`);
    setShowEmojiPanel(false);
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX />;
    if (volume < 0.5) return <Volume1 />;
    return <Volume2 />;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Left Controls */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <button
              onClick={onToggleMic}
              className={`p-3 rounded-full transition-all duration-200 ${
                isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <MicOff className="text-white" size={20} /> : <Mic className="text-white" size={20} />}
            </button>
            {!isMuted && audioLevel > 0.5 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            )}
          </div>

          <button
            onClick={onToggleVideo}
            className={`p-3 rounded-full transition-all duration-200 ${
              !isVideoOn ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={isVideoOn ? "Stop Video" : "Start Video"}
          >
            {isVideoOn ? <Video className="text-white" size={20} /> : <VideoOff className="text-white" size={20} />}
          </button>

          <button
            onClick={onToggleBlur}
            className={`p-3 rounded-full transition-all duration-200 ${
              isBlurred ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title="Background Blur"
          >
            <Filter className="text-white" size={20} />
          </button>
        </div>

        {/* Center Controls */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={onToggleScreenShare}
            className={`p-3 rounded-full transition-all duration-200 ${
              isScreenSharing ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title="Share Screen"
          >
            <Share className="text-white" size={20} />
          </button>

          <div className="relative">
            <button
              onClick={handleRecordingToggle}
              className={`p-3 rounded-full transition-all duration-200 ${
                isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              title={isRecording ? "Stop Recording" : "Start Recording"}
            >
              <CircleDot className="text-white" size={20} />
            </button>
            {isRecording && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {formatTime(recordingTime)}
              </div>
            )}
          </div>

          <button
            onClick={onToggleHand}
            className={`p-3 rounded-full transition-all duration-200 ${
              handRaised ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={handRaised ? "Lower Hand" : "Raise Hand"}
          >
            <Hand className="text-white" size={20} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowEmojiPanel(!showEmojiPanel)}
              className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-200"
              title="Reactions"
            >
              <Smile className="text-white" size={20} />
            </button>
            {showEmojiPanel && (
              <div className="absolute bottom-full mb-2 bg-gray-800 rounded-lg p-2 grid grid-cols-4 gap-2">
                {emojis.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => handleEmojiClick(emoji)}
                    className="p-2 hover:bg-gray-700 rounded transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <button
              onClick={() => setShowLayoutOptions(!showLayoutOptions)}
              className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-200"
              title="Change Layout"
            >
              <Layout className="text-white" size={20} />
            </button>
            {showLayoutOptions && (
              <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg p-2 w-48">
                {layouts.map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => {
                      setCurrentLayout(id);
                      onChangeLayout(id);
                      setShowLayoutOptions(false);
                    }}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded hover:bg-gray-700 ${
                      currentLayout === id ? 'bg-blue-500' : ''
                    }`}
                  >
                    <Icon size={16} className="text-white" />
                    <span className="text-white text-sm">{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handlePiPToggle}
            className={`p-3 rounded-full transition-all duration-200 ${
              isPiPActive ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title="Picture in Picture"
          >
            <PictureInPicture className="text-white" size={20} />
          </button>

          <button
            onClick={handleLockToggle}
            className={`p-3 rounded-full transition-all duration-200 ${
              isLocked ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={isLocked ? "Unlock Meeting" : "Lock Meeting"}
          >
            <Lock className="text-white" size={20} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowVolumeControl(!showVolumeControl)}
              className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-200"
              title="Volume"
            >
              {getVolumeIcon()}
            </button>
            {showVolumeControl && (
              <div className="absolute bottom-full right-0 mb-2 p-2 bg-gray-800 rounded-lg">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => {
                    onVolumeChange(parseFloat(e.target.value));
                    toast.success(`Volume: ${Math.round(e.target.value * 100)}%`);
                  }}
                  className="w-32 accent-blue-500"
                />
              </div>
            )}
          </div>

          <button
            onClick={onEndCall}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-200 flex items-center space-x-2"
            title="End Call"
          >
            <PhoneOff size={20} />
            <span className="font-medium">Leave</span>
          </button>

          {/* Network Quality Indicator */}
          <div className="relative">
            <button
              className={`p-3 rounded-full transition-all duration-200 ${
                networkQuality < 50 ? 'bg-red-500' : networkQuality < 80 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              title="Network Quality"
            >
              <Network className="text-white" size={20} />
              <span className="absolute -top-2 -right-2 text-xs bg-gray-800 px-1 rounded-full">
                {networkQuality}%
              </span>
            </button>
          </div>

          {/* Device Test */}
          <button
            onClick={handleDeviceTest}
            className="p-3 rounded-full bg-gray-700 hover:bg-gray-600"
            title="Test Devices"
          >
            <Headphones className="text-white" size={20} />
          </button>

          {/* Keyboard Shortcuts */}
          <div className="relative">
            <button
              onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
              className="p-3 rounded-full bg-gray-700 hover:bg-gray-600"
              title="Keyboard Shortcuts"
            >
              <Keyboard className="text-white" size={20} />
            </button>
            {showKeyboardShortcuts && (
              <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg p-4 w-64">
                <h3 className="text-white font-medium mb-2">Keyboard Shortcuts</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>Toggle Mic</span>
                    <span className="font-mono">Alt + M</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Toggle Video</span>
                    <span className="font-mono">Alt + V</span>
                  </div>
                  {/* Add more shortcuts */}
                </div>
              </div>
            )}
          </div>

          {/* Language Selector */}
          {isHost && (
            <div className="relative">
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="p-3 rounded-full bg-gray-700 hover:bg-gray-600"
                title="Change Language"
              >
                <Languages className="text-white" size={20} />
              </button>
              {showLanguageSelector && (
                <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg p-2 w-48">
                  {availableLanguages.map(lang => (
                    <button
                      key={lang}
                      onClick={() => {
                        onToggleLanguage(lang);
                        setShowLanguageSelector(false);
                        toast.success(`Language changed to ${lang}`);
                      }}
                      className={`w-full text-left px-3 py-2 rounded hover:bg-gray-700 ${
                        currentLanguage === lang ? 'bg-blue-500' : ''
                      }`}
                    >
                      <span className="text-white text-sm">{lang}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Security Options (Host Only) */}
          {isHost && (
            <div className="relative">
              <button
                onClick={() => setShowSecurityOptions(!showSecurityOptions)}
                className="p-3 rounded-full bg-gray-700 hover:bg-gray-600"
                title="Security Options"
              >
                <Shield className="text-white" size={20} />
              </button>
              {showSecurityOptions && (
                <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg p-4 w-64">
                  <h3 className="text-white font-medium mb-3">Security Options</h3>
                  <div className="space-y-3">
                    <label className="flex items-center text-gray-300 text-sm">
                      <input type="checkbox" className="mr-2" /> Lock Meeting
                    </label>
                    <label className="flex items-center text-gray-300 text-sm">
                      <input type="checkbox" className="mr-2" /> Mute All Participants
                    </label>
                    <label className="flex items-center text-gray-300 text-sm">
                      <input type="checkbox" className="mr-2" /> Disable Chat
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stats */}
          <button
            onClick={() => {
              setShowStats(!showStats);
              onToggleStats?.();
            }}
            className={`p-3 rounded-full transition-all duration-200 ${
              showStats ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title="Meeting Stats"
          >
            <Gauge className="text-white" size={20} />
          </button>

          {/* Full Screen */}
          <button
            onClick={handleFullScreen}
            className="p-3 rounded-full bg-gray-700 hover:bg-gray-600"
            title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
          >
            {isFullScreen ? 
              <Minimize className="text-white" size={20} /> : 
              <Maximize className="text-white" size={20} />
            }
          </button>
        </div>
      </div>
    </div>
  );
});

Controls.displayName = 'Controls';
export default Controls; 