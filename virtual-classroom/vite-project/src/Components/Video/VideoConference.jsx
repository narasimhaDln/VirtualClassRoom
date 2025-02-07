import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Layout, Users, Maximize2, Share, Hand, MicOff, Volume2, 
  Settings, MessageCircle, Smile, MoreVertical, Shield, 
  UserPlus, Phone, PhoneOff, Camera, CameraOff, Mic,
  Video, PictureInPicture, Lock, Grid, Coffee, Clock,
  Download, Upload, Wifi, AlertCircle, MoreHorizontal,
  ChevronRight, X, Monitor, UserCheck, Filter,
  MessageSquare, Bell, Calendar, HelpCircle, Volume1, VolumeX,
  VideoOff, Image, BarChart2, FileText, Keyboard, Crown
} from 'lucide-react';
import { useMediaStream } from './UseMediaStream';
import BreakoutRooms from './BrakeoutRoom';
import Controls from './Controls';
import ParticipantVideo from './ParticipantVideo';
import { toast } from 'react-hot-toast';
import { VirtualBackground } from './VirtualBackground';
import { MeetingPolls } from './MeetingPolls';
import { ChatPanel } from './ChatPanel';
import { MeetingNotes } from './MeetingNotes';

export default function VideoConference() {
  const [participants, setParticipants] = useState([
    { id: 1, name: 'Teacher Smith', isSpeaking: true, handRaised: false, role: 'teacher', isMuted: false, isVideoOff: false, isPinned: true, audioLevel: 0.8, isScreenSharing: false },
    { id: 2, name: 'John Doe', isSpeaking: false, handRaised: true, role: 'student', isMuted: true, isVideoOff: false, isPinned: false, audioLevel: 0, isScreenSharing: false },
    { id: 3, name: 'Jane Smith', isSpeaking: false, handRaised: false, role: 'student', isMuted: false, isVideoOff: true, isPinned: false, audioLevel: 0.3, isScreenSharing: false },
    { id: 4, name: 'Mike Johnson', isSpeaking: false, handRaised: false, role: 'student', isMuted: false, isVideoOff: false, isPinned: false, audioLevel: 0.5, isScreenSharing: true },
  ]);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [layout, setLayout] = useState('grid');
  const [showParticipants, setShowParticipants] = useState(false);
  const [showBreakoutRooms, setShowBreakoutRooms] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [volume, setVolume] = useState(1);
  const [breakoutRooms, setBreakoutRooms] = useState([
    { id: 1, name: 'Group 1', participants: [2, 3] },
    { id: 2, name: 'Group 2', participants: [4] },
  ]);

  const videoRef = useRef(null);
  const screenRef = useRef(null);
  const { 
    localStream, 
    screenStream, 
    startScreenShare, 
    stopScreenShare,
    availableDevices,
    switchCamera,
    switchMicrophone,
    initializeMedia
  } = useMediaStream();

  const [isRecording, setIsRecording] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [meetingInfo, setMeetingInfo] = useState({
    title: "Team Weekly Standup",
    duration: "00:45:23",
    isLocked: false,
    quality: "HD",
  });
  const [reactions, setReactions] = useState([]);

  const [networkQuality, setNetworkQuality] = useState(100);
  const [activeTab, setActiveTab] = useState('participants');
  const [notification, setNotification] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [backgroundBlur, setBackgroundBlur] = useState(false);
  const [meetingControls, setMeetingControls] = useState({
    allowChat: true,
    allowReactions: true,
    allowScreenShare: true,
    allowHandRaise: true,
  });

  const localVideoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const containerRef = useRef(null);

  const [meetingStatus, setMeetingStatus] = useState({
    duration: '00:00:00',
    quality: 'HD',
    participants: 12,
    resolution: '1920x1080',
    bitrate: 2500,
    packetLoss: 0
  });

  const [selectedDevice, setSelectedDevice] = useState({ video: '', audio: '' });
  const [blur, setBlur] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [mediaError, setMediaError] = useState(null);

  const [showVirtualBackground, setShowVirtualBackground] = useState(false);
  const [showPolls, setShowPolls] = useState(false);
  const [currentBackground, setCurrentBackground] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const [showNotes, setShowNotes] = useState(false);
  const [isHandRaiseQueueOpen, setIsHandRaiseQueueOpen] = useState(false);
  const [handRaiseQueue, setHandRaiseQueue] = useState([]);
  const [isKeyboardShortcutsOpen, setIsKeyboardShortcutsOpen] = useState(false);

  const [showClassVideo, setShowClassVideo] = useState(true);

  // Initialize media stream when component mounts
  useEffect(() => {
    const init = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          toast.error('Your browser does not support video calls');
          return;
        }

        const stream = await initializeMedia();
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          // Ensure video plays automatically
          try {
            await localVideoRef.current.play();
          } catch (playError) {
            console.error('Error playing video:', playError);
          }
        }

        // Set initial video state
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          setIsVideoOn(true);
          videoTrack.enabled = true;
        }

      } catch (error) {
        console.error('Error accessing media devices:', error);
        toast.error('Could not access camera. Please check permissions.');
        setIsVideoOn(false);
      }
    };

    init();
    startMeetingTimer();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [initializeMedia]);

  // Meeting timer
  const startMeetingTimer = () => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      const diff = Date.now() - startTime;
      const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
      const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
      setMeetingStatus(prev => ({
        ...prev,
        duration: `${hours}:${minutes}:${seconds}`
      }));
    }, 1000);

    // Cleanup timer on component unmount
    return () => clearInterval(timer);
  };

  // Recording functionality
  const startRecording = async () => {
    try {
      const mediaRecorder = new MediaRecorder(localStream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks(prev => [...prev, event.data]);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error) {
      toast.error('Failed to start recording');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    toast.success('Recording stopped');
  };

  const downloadRecording = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = `meeting-recording-${new Date().toISOString()}.webm`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Toggle microphone
  const toggleMic = useCallback(() => {
    if (!localStream) {
      toast.error('No microphone access');
      return;
    }
    
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
      const newMutedState = !isMuted;
      audioTrack.enabled = !newMutedState;
      setIsMuted(newMutedState);
      
      setParticipants(prev => prev.map(p => 
        p.id === 1 ? { ...p, isMuted: newMutedState } : p
      ));
      
      toast.success(`Microphone ${newMutedState ? 'muted' : 'unmuted'}`);
    }
  }, [localStream, isMuted]);

  // Toggle camera
  const toggleVideo = useCallback(() => {
    if (!localStream) {
      toast.error('Camera not initialized');
      return;
    }

    try {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        const newVideoState = !isVideoOn;
        videoTrack.enabled = newVideoState;
        
        // Update video element visibility
        if (localVideoRef.current) {
          localVideoRef.current.style.display = newVideoState ? 'block' : 'none';
        }
        
        setIsVideoOn(newVideoState);
        
        // Update participants state
        setParticipants(prev => prev.map(p => 
          p.id === 1 ? { ...p, isVideoOff: !newVideoState } : p
        ));

        toast.success(`Camera ${newVideoState ? 'enabled' : 'disabled'}`);
      } else {
        toast.error('No camera detected');
      }
    } catch (error) {
      console.error('Error toggling video:', error);
      toast.error('Failed to toggle camera');
    }
  }, [localStream, isVideoOn]);

  // Audio level meter
  useEffect(() => {
    if (!localStream) return;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(localStream);
    microphone.connect(analyser);
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const updateAudioLevel = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAudioLevel(average / 255); // Normalize to 0-1
      requestAnimationFrame(updateAudioLevel);
    };

    updateAudioLevel();

    return () => {
      microphone.disconnect();
      audioContext.close();
    };
  }, [localStream]);

  const handleScreenShare = useCallback(async () => {
    try {
    if (screenStream) {
        await stopScreenShare();
      setParticipants(prev => prev.map(p => ({ ...p, isScreenSharing: false })));
        toast.success('Screen sharing stopped');
    } else {
      const stream = await startScreenShare();
      if (stream && screenRef.current) {
        screenRef.current.srcObject = stream;
        setParticipants(prev => prev.map(p => ({
          ...p,
          isScreenSharing: p.id === 1
        })));
          toast.success('Screen sharing started');
        }
      }
    } catch (error) {
      toast.error('Failed to share screen: ' + error.message);
    }
  }, [screenStream, startScreenShare, stopScreenShare]);

  const togglePin = (participantId) => {
    setParticipants(participants.map(p => ({
      ...p,
      isPinned: p.id === participantId ? !p.isPinned : false
    })));
  };

  const toggleMute = (participantId) => {
    setParticipants(participants.map(p => ({
      ...p,
      isMuted: p.id === participantId ? !p.isMuted : p.isMuted
    })));
  };

  const toggleParticipantVideo = (participantId) => {
    setParticipants(participants.map(p => ({
      ...p,
      isVideoOff: p.id === participantId ? !p.isVideoOff : p.isVideoOff
    })));
  };

  const createBreakoutRoom = (name) => {
    const newRoom = {
      id: breakoutRooms.length + 1,
      name: name || `Group ${breakoutRooms.length + 1}`,
      participants: []
    };
    setBreakoutRooms([...breakoutRooms, newRoom]);
  };

  const moveToBreakoutRoom = (participantId, roomId) => {
    setBreakoutRooms(rooms => rooms.map(room => ({
      ...room,
      participants: room.id === roomId 
        ? [...room.participants, participantId]
        : room.participants.filter(id => id !== participantId)
    })));
  };

  const pinnedParticipant = participants.find(p => p.isPinned);
  const screenSharingParticipant = participants.find(p => p.isScreenSharing);

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX />;
    if (volume < 0.5) return <Volume1 />;
    return <Volume2 />;
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const toggleBlur = () => {
    setBlur(!blur);
    // Implement actual background blur logic here
    toast.success(`Background blur ${!blur ? 'enabled' : 'disabled'}`);
  };

  // Add network quality monitoring
  useEffect(() => {
    const updateNetworkStats = () => {
      // Simulate network stats updates
      setMeetingStatus(prev => ({
        ...prev,
        bitrate: Math.floor(Math.random() * 1000) + 2000,
        packetLoss: Math.floor(Math.random() * 5),
        quality: networkQuality > 80 ? 'HD' : networkQuality > 50 ? 'SD' : 'Low'
      }));
    };

    const statsInterval = setInterval(updateNetworkStats, 2000);
    return () => clearInterval(statsInterval);
  }, [networkQuality]);

  // Add this function for handling leave meeting
  const handleLeaveMeeting = () => {
    if (window.confirm('Are you sure you want to leave the meeting?')) {
      // Stop all tracks
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
      }
      // Redirect to home
      window.location.href = '/';
    }
  };

  // Add participants count update
  useEffect(() => {
    setMeetingStatus(prev => ({
      ...prev,
      participants: participants.length
    }));
  }, [participants]);

  // Add this function for hand raise queue
  const handleHandRaise = () => {
    setHandRaised(!handRaised);
    if (!handRaised) {
      setHandRaiseQueue(prev => [...prev, {
        id: Date.now(),
        name: participants[0].name,
        timestamp: new Date()
      }]);
      toast.success('Hand raised - added to queue');
    } else {
      setHandRaiseQueue(prev => prev.filter(item => item.name !== participants[0].name));
      toast.success('Hand lowered');
    }
  };

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.altKey) {
        switch (e.key) {
          case 'm':
            toggleMic();
            break;
          case 'v':
            toggleVideo();
            break;
          case 'h':
            handleHandRaise();
            break;
          case 'n':
            setShowNotes(prev => !prev);
            break;
          case 's':
            handleScreenShare();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleMic, toggleVideo, handleHandRaise, handleScreenShare]);

  return (
    <div ref={containerRef} className="relative h-full bg-gray-900">
      {/* Meeting Status Bar */}
      <div className="absolute top-0 left-0 right-0 bg-gray-800/90 backdrop-blur-sm px-4 py-2 flex items-center justify-between z-10">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-white text-sm">{meetingStatus.duration}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-white text-sm">
              {participants.length} participant{participants.length !== 1 ? 's' : ''}
            </span>
          </div>
          <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
            {meetingStatus.quality}
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleFullScreen}
            className="p-1.5 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="p-1.5 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Video Container */}
      <div className="relative aspect-video bg-gray-800">
        {/* YouTube Class Video - Full width */}
        <div className="absolute inset-0 w-full h-full">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/EpJm0A1sINU?autoplay=1&controls=0&rel=0&disablekb=1&modestbranding=5&showinfo=0&iv_load_policy=3&fs=0&start=2&end=1020"
            title="Class Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Single Camera View - Top right corner */}
        <div className={`absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden shadow-lg ${!isVideoOn ? 'hidden' : ''}`}>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => localVideoRef.current?.requestFullscreen()}
              className="p-1.5 rounded-lg bg-gray-900/80 text-white hover:bg-gray-900"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Avatar when camera is off */}
        <div className={`absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden shadow-lg flex items-center justify-center ${isVideoOn ? 'hidden' : ''}`}>
          <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
            <span className="text-xl text-white">
              {participants.find(p => p.id === 1)?.name?.split(' ').map(n => n[0]).join('') || 'ME'}
            </span>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-800/90 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMic}
              className={`p-3 rounded-full transition-all ${
                isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {isMuted ? (
                <MicOff className="w-5 h-5 text-white" />
              ) : (
                <Mic className="w-5 h-5 text-white" />
              )}
            </button>
            <button
              onClick={toggleVideo}
              className={`p-3 rounded-full transition-all ${
                !isVideoOn ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {!isVideoOn ? (
                <VideoOff className="w-5 h-5 text-white" />
              ) : (
                <Video className="w-5 h-5 text-white" />
              )}
            </button>
            <button
              onClick={toggleBlur}
              className={`p-3 rounded-full transition-all ${
                blur ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              <Filter className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-3 rounded-full transition-all ${
                isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              <Video className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setLayout('grid')}
              className={`p-2 rounded-lg transition-all ${
                layout === 'grid' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setLayout('spotlight')}
              className={`p-2 rounded-lg transition-all ${
                layout === 'spotlight' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Maximize2 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setLayout('presentation')}
              className={`p-2 rounded-lg transition-all ${
                layout === 'presentation' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Monitor className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {recordedChunks.length > 0 && (
              <button
                onClick={downloadRecording}
                className="p-3 rounded-full bg-gray-600 hover:bg-gray-700 transition-all"
              >
                <Download className="w-5 h-5 text-white" />
                    </button>
            )}
            <button 
              onClick={handleLeaveMeeting}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center space-x-2"
            >
              <PhoneOff className="w-5 h-5" />
              <span className="font-medium">Leave</span>
                    </button>
                  </div>
                  
                      <div className="flex items-center space-x-2">
            {/* Virtual Background Button */}
            <button
              onClick={() => setShowVirtualBackground(true)}
              className={`p-3 rounded-full ${
                currentBackground ? 'bg-blue-500' : 'bg-gray-700'
              } hover:bg-opacity-80`}
              title="Virtual Background"
            >
              <Image className="w-5 h-5 text-white" />
            </button>

            {/* Polls Button */}
            <button
              onClick={() => setShowPolls(true)}
              className="p-3 rounded-full bg-gray-700 hover:bg-opacity-80"
              title="Polls"
            >
              <BarChart2 className="w-5 h-5 text-white" />
            </button>

            {/* Chat Button */}
            <button
              onClick={() => setShowChat(true)}
              className="p-3 rounded-full bg-gray-700 hover:bg-opacity-80"
              title="Chat"
            >
              <MessageCircle className="w-5 h-5 text-white" />
            </button>
        </div>

          <div className="flex items-center space-x-2">
                  <button 
              onClick={() => setShowNotes(true)}
              className="p-3 rounded-full bg-gray-700 hover:bg-opacity-80"
              title="Meeting Notes"
                  >
              <FileText className="w-5 h-5 text-white" />
                  </button>
            
                  <button 
              onClick={() => setIsHandRaiseQueueOpen(true)}
              className={`p-3 rounded-full ${
                handRaiseQueue.length > 0 ? 'bg-yellow-500' : 'bg-gray-700'
              } hover:bg-opacity-80`}
              title="Hand Raise Queue"
            >
              <Hand className="w-5 h-5 text-white" />
              {handRaiseQueue.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {handRaiseQueue.length}
                </span>
              )}
                  </button>

                  <button 
              onClick={() => setIsKeyboardShortcutsOpen(true)}
              className="p-3 rounded-full bg-gray-700 hover:bg-opacity-80"
              title="Keyboard Shortcuts"
                  >
              <Keyboard className="w-5 h-5 text-white" />
                  </button>
                </div>
        </div>
      </div>

      {/* Settings Panel */}
      {isSettingsOpen && (
        <div className="absolute right-0 top-12 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h3 className="text-white font-medium">Settings</h3>
                <button 
              onClick={() => setIsSettingsOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
          
          <div className="p-4 space-y-4">
            <div>
              <label className="text-gray-400 text-sm block mb-2">Camera</label>
              <select
                value={selectedDevice.video}
                onChange={(e) => {
                  setSelectedDevice(prev => ({ ...prev, video: e.target.value }));
                  switchCamera(e.target.value);
                }}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
              >
                {availableDevices.videoinput?.map(device => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${device.deviceId.slice(0, 5)}`}
                  </option>
                ))}
              </select>
            </div>

                        <div>
              <label className="text-gray-400 text-sm block mb-2">Microphone</label>
              <select
                value={selectedDevice.audio}
                onChange={(e) => {
                  setSelectedDevice(prev => ({ ...prev, audio: e.target.value }));
                  switchMicrophone(e.target.value);
                }}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
              >
                {availableDevices.audioinput?.map(device => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Microphone ${device.deviceId.slice(0, 5)}`}
                  </option>
                ))}
              </select>
                </div>

                        <div>
              <label className="text-gray-400 text-sm block mb-2">Background Blur</label>
              <button
                onClick={toggleBlur}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  blur ? 'bg-blue-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform ${
                    blur ? 'right-1' : 'left-1'
                  }`}
                />
                      </button>
                    </div>
                  </div>
                </div>
              )}

      {showVirtualBackground && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <VirtualBackground
            onClose={() => setShowVirtualBackground(false)}
            onSelect={(bg) => {
              setCurrentBackground(bg);
              setShowVirtualBackground(false);
            }}
            currentBackground={currentBackground}
          />
                      </div>
      )}

      {showPolls && (
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-50">
          <MeetingPolls
            onClose={() => setShowPolls(false)}
            isHost={participants[0].role === 'teacher'}
          />
                      </div>
      )}

      {showChat && (
        <div className="absolute top-0 right-0 h-full w-80 z-40">
          <ChatPanel
            onClose={() => setShowChat(false)}
            participants={participants}
            currentUser={participants[0]}
          />
                    </div>
      )}

      {showNotes && (
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-50">
          <MeetingNotes onClose={() => setShowNotes(false)} />
                  </div>
      )}

      {isHandRaiseQueueOpen && (
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-50 bg-gray-800 rounded-lg p-4 w-80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-medium">Hand Raise Queue</h3>
            <button onClick={() => setIsHandRaiseQueueOpen(false)} className="text-gray-400 hover:text-white">
              <X size={20} />
                        </button>
                      </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {handRaiseQueue.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Hand className="w-4 h-4 text-yellow-500" />
                  <span className="text-white">{item.name}</span>
                </div>
                <span className="text-gray-400 text-sm">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
            </div>
            ))}
          </div>
        </div>
      )}

      {isKeyboardShortcutsOpen && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gray-800 rounded-lg p-4 w-80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-medium">Keyboard Shortcuts</h3>
            <button onClick={() => setIsKeyboardShortcutsOpen(false)} className="text-gray-400 hover:text-white">
              <X size={20} />
          </button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Toggle Mic</span>
              <kbd className="px-2 py-1 bg-gray-700 rounded text-white">Alt + M</kbd>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Toggle Video</span>
              <kbd className="px-2 py-1 bg-gray-700 rounded text-white">Alt + V</kbd>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Raise Hand</span>
              <kbd className="px-2 py-1 bg-gray-700 rounded text-white">Alt + H</kbd>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Meeting Notes</span>
              <kbd className="px-2 py-1 bg-gray-700 rounded text-white">Alt + N</kbd>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Screen Share</span>
              <kbd className="px-2 py-1 bg-gray-700 rounded text-white">Alt + S</kbd>
        </div>
      </div>
        </div>
      )}
    </div>
  );
}